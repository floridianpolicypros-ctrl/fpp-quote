const fs = require('fs');
const logo = fs.readFileSync('logo.txt','utf8').trim();
const prompt = fs.readFileSync('summary-prompt.txt','utf8');
function load(f){ return fs.readFileSync(f,'utf8').split('__LOGO__').join(logo); }
const routes = {
  "/":"hub.html","/home":"index.html","/realtor":"realtor.html","/lender":"lender.html",
  "/property":"property.html","/investment":"investment.html",
  "/renters":"renters.html","/condo":"renters.html",
  "/auto":"auto.html","/commercial":"commercial-auto.html","/rec":"recreation.html",
  "/flood":"flood.html","/umbrella":"umbrella.html"
};
const PAGES = {};
for (const [r,f] of Object.entries(routes)) PAGES[r] = Buffer.from(load(f),'utf8').toString('base64');

const worker = `const PAGES = ${JSON.stringify(PAGES)};
const SUMMARY_PROMPT = ${JSON.stringify(prompt)};
const RECIPIENT = "carlos@floridianpolicypros.com";
const FROM = "Floridian Policy Pros Quotes <quotes@floridianpolicypros.com>";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let p = url.pathname.replace(/\\/+$/,"") || "/";
    if (p === "/api/submit") return handleSubmit(request, env);
    const b64 = PAGES[p] || PAGES["/"];
    const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    return new Response(new TextDecoder("utf-8").decode(bytes),
      { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
  }
};

async function handleSubmit(request, env) {
  if (request.method !== "POST") return j({error:"POST only"},405);
  try {
    const { formType="quote", subject="Quote Request", fields={}, files=[] } = await request.json();

    // 1) Build the AI summary from fields + docs
    let summary = "";
    let aiError = null;
    try {
      const content = [];
      let docBytes = 0;
      for (const f of files.slice(0,5)) {
        const size = (f.dataBase64||"").length * 0.75;
        if (docBytes + size > 24_000_000) break; // stay under API limits
        docBytes += size;
        if ((f.type||"").includes("pdf"))
          content.push({type:"document",source:{type:"base64",media_type:"application/pdf",data:f.dataBase64}});
        else if ((f.type||"").startsWith("image/"))
          content.push({type:"image",source:{type:"base64",media_type:f.type,data:f.dataBase64}});
      }
      content.push({type:"text",text:
        "FORM TYPE: "+formType+"\\n\\nFORM DATA (submitted by client):\\n"+
        Object.entries(fields).filter(([k,v])=>v).map(([k,v])=>k+": "+v).join("\\n")+
        "\\n\\nATTACHED DOCUMENTS: "+(files.map(f=>f.name).join(", ")||"none")+
        "\\n\\nProduce the full Quote Summary now."});
      let out = null;
      for (let attempt=0; attempt<3; attempt++) {
        const r = await fetch("https://api.anthropic.com/v1/messages",{
          method:"POST",
          headers:{"content-type":"application/json","x-api-key":env.ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01"},
          body: JSON.stringify({model:"claude-sonnet-5",max_tokens:8000,system:SUMMARY_PROMPT,
            messages:[{role:"user",content}]})
        });
        out = await r.json();
        const retriable = out.error && /overloaded|rate_limit|529|429/i.test(out.error.type+" "+out.error.message);
        if (!retriable) break;
        await new Promise(res=>setTimeout(res, 4000*(attempt+1)));
      }
      if (out.error) aiError = out.error.message;
      else summary = (out.content||[]).map(c=>c.text||"").join("");
    } catch(e){ aiError = String(e); }
    if (!summary) summary = "AI summary unavailable ("+(aiError||"unknown error")+").\\n\\nRAW FORM DATA:\\n"+
      Object.entries(fields).filter(([k,v])=>v).map(([k,v])=>k+": "+v).join("\\n");

    // 2) Word file (.doc = Word-HTML)
    const client = (fields.firstName||"")+" "+(fields.lastName||fields.bizName||"");
    const addr = fields.propAddress || fields.currentAddress || "";
    const docName = (client.trim()||"Client")+" - "+(addr||formType)+" - Quote Summary.doc";
    const docHtml = wordDoc(summary, client.trim(), addr, formType);

    // 3) Email via Resend with attachments
    const attachments = [{ filename: docName.replace(/[\\\\/:*?"<>|]/g,"-"),
                           content: btoa(unescape(encodeURIComponent(docHtml))) }];
    let attBytes = 0;
    for (const f of files) {
      const size=(f.dataBase64||"").length*0.75;
      if (attBytes+size > 35_000_000) break; // Resend ~40MB cap
      attBytes += size;
      attachments.push({ filename: f.name||"document", content: f.dataBase64 });
    }
    const er = await fetch("https://api.resend.com/emails",{
      method:"POST",
      headers:{"content-type":"application/json","authorization":"Bearer "+env.RESEND_API_KEY},
      body: JSON.stringify({ from: FROM, to: [RECIPIENT], subject: subject,
        text: summary, attachments })
    });
    const eout = await er.json();
    // Phone push notification (ntfy)
    try {
      const who = (client.trim()||"Unknown client");
      const note = who + (addr ? " — " + addr : "") + " (" + formType.replace(/ intake form.*/i,"") + ")";
      await fetch("https://ntfy.sh/fpp-quotes-ovsjc7k2m9", { method:"POST",
        headers: { "Title": eout.id ? "New quote request" : "Quote request — EMAIL FAILED", "Priority": eout.id ? "high" : "urgent", "Tags": eout.id ? "moneybag" : "warning" },
        body: note });
    } catch(e){}
    if (eout.id) return j({ok:true, id:eout.id, aiError});
    return j({ok:false, error: eout.message || JSON.stringify(eout), aiError});
  } catch(e){ return j({ok:false, error:String(e)}); }
}

function wordDoc(text, client, addr, formType){
  const esc = s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const body = esc(text).split("\\n").map(l=>{
    if(/^===.*===$/.test(l.trim())) return "<h2>"+l.trim()+"</h2>";
    if(/^[A-Z][A-Za-z &\\/]+:?$/.test(l.trim())&&l.trim().length<60) return "<h3>"+l.trim()+"</h3>";
    return l.trim()===""?"<p>&nbsp;</p>":"<p>"+l+"</p>";
  }).join("");
  return '<html xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8">'+
    '<title>Quote Summary</title><style>body{font-family:Calibri,Arial,sans-serif;font-size:11pt}'+
    'h1{font-size:16pt;color:#274b73}h2{font-size:13pt;color:#274b73;border-bottom:1px solid #ccc}'+
    'h3{font-size:12pt;color:#1f3c5c}p{margin:2pt 0}</style></head><body>'+
    "<h1>"+esc(client||"Client")+" — "+esc(addr)+"</h1>"+
    "<p><i>Submitted via "+esc(formType)+" intake form · "+new Date().toLocaleString("en-US",{timeZone:"America/New_York"})+"</i></p>"+
    body+"</body></html>";
}
function j(o,s=200){ return new Response(JSON.stringify(o),{status:s,headers:{"content-type":"application/json"}}); }
`;
fs.mkdirSync('dist',{recursive:true});
fs.writeFileSync('dist/worker.js', worker);
console.log('Built dist/worker.js —', worker.length, 'bytes,', Object.keys(routes).length, 'routes + /api/submit');
