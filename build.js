const fs = require('fs');
const logo = fs.readFileSync('logo.txt','utf8').trim();
const prompt = fs.readFileSync('summary-prompt.txt','utf8');
function patchForm(s){
  var GUARD='if(window.__sending){toast("Already sending — hang tight…");return;}\n  window.__sending=true;\n  const _sb=(e&&e.submitter)||[...document.querySelectorAll("button")].find(b=>/send/i.test(b.textContent)&&/request|quote/i.test(b.textContent));\n  const _sbTxt=_sb?_sb.innerHTML:"";\n  if(_sb){_sb.disabled=true;_sb.style.opacity=".7";_sb.textContent="⏳ Sending…";}\n  toast("Sending your request…");';
  var OK='if(_sb){_sb.textContent="✅ Sent!";} if(window.__fppConfirm){window.__fppConfirm();} toast("✅ Sent!");';
  var FAIL='window.__sending=false; if(_sb){_sb.disabled=false;_sb.style.opacity="";_sb.innerHTML=_sbTxt;} ';
  ['toast("Sending your request…");','toast("Sending your request\\u2026");'].forEach(function(t){ if(s.indexOf(t)>=0 && s.indexOf("window.__sending")<0) s=s.replace(t,GUARD); });
  ['toast("✅ Sent! Carlos has your request — docs and all.");','toast("\\u2705 Sent! Carlos has your request \\u2014 docs and all.");'].forEach(function(t){ if(s.indexOf(t)>=0 && s.indexOf("be in touch shortly")<0) s=s.replace(t,OK); });
  if(s.indexOf(".catch(()=>{ window.location.href")>=0 && s.indexOf("_sb.innerHTML=_sbTxt")<0) s=s.replace(".catch(()=>{ window.location.href",".catch(()=>{ "+FAIL+"window.location.href");
  return s;
}
function patchPapa(s){
  if(s.indexOf('btnPapa')<0 || s.indexOf('FL_APPRAISERS')>=0) return s;
  var g=function(c){return 'https://www.google.com/search?q='+encodeURIComponent(c+' County FL property appraiser');};
  var inj='<script>\n'+
  'var FL_APPRAISERS={'+
  '"Alachua":"https://www.acpafl.org","Baker":"https://www.bakerpa.com","Bay":"https://www.baypa.net","Bradford":"https://www.bradfordappraiser.com","Brevard":"https://www.bcpao.us","Broward":"https://web.bcpa.net","Calhoun":"https://www.calhounpa.net","Charlotte":"https://www.ccappraiser.com","Citrus":"https://www.citruspa.org","Clay":"https://ccpao.com","Collier":"https://www.collierappraiser.com","Columbia":"'+g('Columbia')+'","DeSoto":"'+g('DeSoto')+'","Dixie":"'+g('Dixie')+'","Duval":"https://www.coj.net/departments/property-appraiser","Escambia":"https://www.escpa.org","Flagler":"https://www.flaglerpa.com","Franklin":"'+g('Franklin')+'","Gadsden":"'+g('Gadsden')+'","Gilchrist":"'+g('Gilchrist')+'","Glades":"'+g('Glades')+'","Gulf":"'+g('Gulf')+'","Hamilton":"'+g('Hamilton')+'","Hardee":"'+g('Hardee')+'","Hendry":"'+g('Hendry')+'","Hernando":"'+g('Hernando')+'","Highlands":"https://www.hcpao.org","Hillsborough":"https://www.hcpafl.org","Holmes":"'+g('Holmes')+'","Indian River":"https://www.ircpa.org","Jackson":"'+g('Jackson')+'","Jefferson":"'+g('Jefferson')+'","Lafayette":"'+g('Lafayette')+'","Lake":"https://www.lakecopropappr.com","Lee":"https://www.leepa.org","Leon":"https://www.leonpa.org","Levy":"'+g('Levy')+'","Liberty":"'+g('Liberty')+'","Madison":"'+g('Madison')+'","Manatee":"https://www.manateepao.gov","Marion":"https://www.pa.marion.fl.us","Martin":"https://www.pa.martin.fl.us","Miami-Dade":"https://www.miamidade.gov/pa","Monroe":"https://www.mcpafl.org","Nassau":"https://www.nassauflpa.com","Okaloosa":"'+g('Okaloosa')+'","Okeechobee":"'+g('Okeechobee')+'","Orange":"https://www.ocpafl.org","Osceola":"https://www.property-appraiser.org","Palm Beach":"https://pbcpao.gov","Pasco":"https://www.pascopa.com","Pinellas":"https://www.pcpao.gov","Polk":"https://www.polkpa.org","Putnam":"'+g('Putnam')+'","St. Johns":"'+g('St. Johns')+'","St. Lucie":"https://www.paslc.gov","Santa Rosa":"https://srcpa.gov","Sarasota":"https://www.sc-pa.com","Seminole":"https://www.scpafl.org","Sumter":"https://www.sumterpa.com","Suwannee":"'+g('Suwannee')+'","Taylor":"'+g('Taylor')+'","Union":"'+g('Union')+'","Volusia":"https://vcpa.vcgov.org","Wakulla":"'+g('Wakulla')+'","Walton":"https://waltonpa.com","Washington":"'+g('Washington')+'"};\n'+
  'var FL_CITY2COUNTY={"west palm beach":"Palm Beach","boca raton":"Palm Beach","boynton beach":"Palm Beach","delray beach":"Palm Beach","lake worth":"Palm Beach","lake worth beach":"Palm Beach","wellington":"Palm Beach","jupiter":"Palm Beach","palm beach gardens":"Palm Beach","royal palm beach":"Palm Beach","greenacres":"Palm Beach","riviera beach":"Palm Beach","belle glade":"Palm Beach","palm beach":"Palm Beach","fort lauderdale":"Broward","hollywood":"Broward","pembroke pines":"Broward","miramar":"Broward","coral springs":"Broward","pompano beach":"Broward","davie":"Broward","plantation":"Broward","sunrise":"Broward","deerfield beach":"Broward","weston":"Broward","tamarac":"Broward","coconut creek":"Broward","margate":"Broward","lauderhill":"Broward","parkland":"Broward","miami":"Miami-Dade","hialeah":"Miami-Dade","miami beach":"Miami-Dade","homestead":"Miami-Dade","doral":"Miami-Dade","miami gardens":"Miami-Dade","aventura":"Miami-Dade","cutler bay":"Miami-Dade","coral gables":"Miami-Dade","north miami":"Miami-Dade","stuart":"Martin","palm city":"Martin","hobe sound":"Martin","jensen beach":"Martin","port st. lucie":"St. Lucie","port saint lucie":"St. Lucie","fort pierce":"St. Lucie","vero beach":"Indian River","sebastian":"Indian River","melbourne":"Brevard","palm bay":"Brevard","titusville":"Brevard","cocoa":"Brevard","rockledge":"Brevard","merritt island":"Brevard","indialantic":"Brevard","satellite beach":"Brevard","okeechobee":"Okeechobee","tampa":"Hillsborough","brandon":"Hillsborough","riverview":"Hillsborough","plant city":"Hillsborough","st. petersburg":"Pinellas","saint petersburg":"Pinellas","clearwater":"Pinellas","largo":"Pinellas","palm harbor":"Pinellas","pinellas park":"Pinellas","dunedin":"Pinellas","tarpon springs":"Pinellas","orlando":"Orange","winter park":"Orange","apopka":"Orange","ocoee":"Orange","winter garden":"Orange","kissimmee":"Osceola","st. cloud":"Osceola","saint cloud":"Osceola","fort myers":"Lee","cape coral":"Lee","estero":"Lee","bonita springs":"Lee","lehigh acres":"Lee","naples":"Collier","marco island":"Collier","sarasota":"Sarasota","venice":"Sarasota","north port":"Sarasota","bradenton":"Manatee","palmetto":"Manatee","lakewood ranch":"Manatee","jacksonville":"Duval","gainesville":"Alachua","tallahassee":"Leon","ocala":"Marion","lakeland":"Polk","winter haven":"Polk","daytona beach":"Volusia","deltona":"Volusia","port orange":"Volusia","ormond beach":"Volusia","new smyrna beach":"Volusia","pensacola":"Escambia","panama city":"Bay","key west":"Monroe","key largo":"Monroe","marathon":"Monroe","spring hill":"Hernando","brooksville":"Hernando","new port richey":"Pasco","wesley chapel":"Pasco","land o lakes":"Pasco","hudson":"Pasco","punta gorda":"Charlotte","port charlotte":"Charlotte","sebring":"Highlands","avon park":"Highlands","clermont":"Lake","leesburg":"Lake","tavares":"Lake","eustis":"Lake","mount dora":"Lake","sanford":"Seminole","altamonte springs":"Seminole","oviedo":"Seminole","lake mary":"Seminole","longwood":"Seminole","casselberry":"Seminole","winter springs":"Seminole","the villages":"Sumter","palm coast":"Flagler","st. augustine":"St. Johns","saint augustine":"St. Johns","fernandina beach":"Nassau","destin":"Okaloosa","fort walton beach":"Okaloosa","crestview":"Okaloosa","niceville":"Okaloosa","fleming island":"Clay","orange park":"Clay","middleburg":"Clay","green cove springs":"Clay","lake city":"Columbia"};\n'+
  '(function(){\n'+
  ' var sel=document.getElementById("addrCounty"); if(!sel) return;\n'+
  ' var cur=sel.value;\n'+
  ' var names=Object.keys(FL_APPRAISERS);\n'+
  ' sel.innerHTML=\'<option value="">Select county\\u2026</option>\'+names.map(function(c){return "<option>"+c+"</option>";}).join("")+"<option>Other</option>";\n'+
  ' if(cur && sel.querySelector(\'option[value="\'+cur+\'"]\')) sel.value=cur;\n'+
  ' var btn=document.getElementById("btnPapa");\n'+
  ' function upd(){ var c=sel.value&&FL_APPRAISERS[sel.value]?sel.value:null;\n'+
  '   btn.textContent=c?("\\uD83D\\uDD0E Look up on "+c+" County Property Appraiser"):"\\uD83D\\uDD0E Look up on Property Appraiser (pick county)"; }\n'+
  ' sel.addEventListener("change",upd);\n'+
  ' var cityEl=document.querySelector(\'[name="propCity"]\');\n'+
  ' if(cityEl){ cityEl.addEventListener("change",function(){ var k=(cityEl.value||"").trim().toLowerCase(); var c=FL_CITY2COUNTY[k]; if(c&&!sel.value){ sel.value=c; upd(); } }); }\n'+
  ' btn.onclick=function(){\n'+
  '   var addrEl=document.querySelector(\'[name="propAddress"]\');\n'+
  '   var addr=[addrEl?addrEl.value:"",cityEl?cityEl.value:"","FL"].filter(Boolean).join(", ");\n'+
  '   if(!addrEl||!addrEl.value){ if(typeof toast==="function")toast("Enter the address first"); return; }\n'+
  '   var c=sel.value&&FL_APPRAISERS[sel.value]?sel.value:null;\n'+
  '   if(!c){ if(typeof toast==="function")toast("Pick the county first \\u2014 then I\\u2019ll open its appraiser"); sel.focus(); return; }\n'+
  '   try{ navigator.clipboard.writeText(addr); }catch(e){}\n'+
  '   if(typeof toast==="function")toast("Address copied \\u2014 paste it into the "+c+" appraiser search");\n'+
  '   window.open(FL_APPRAISERS[c],"_blank");\n'+
  ' };\n'+
  ' upd();\n'+
  '})();\n'+
  '<\/script>';
  return s.replace('</body>', inj+'\n</body>');
}
function patchUX(s){
  if(s.indexOf('/api/submit')<0 || s.indexOf('__fppConfirm')>=0) return s;
  var inj='<script>\n'+
  '(function(){\n'+
  ' [].slice.call(document.querySelectorAll("button")).forEach(function(b){var t=(b.textContent||"").trim();if(/copy summary/i.test(t)||t==="\\uD83D\\uDCCB Copy"||/^\\uD83D\\uDCCB Copy/.test(t)){b.remove();}});\n'+
  ' window.__fppConfirm=function(){\n'+
  '  var o=document.createElement("div");\n'+
  '  o.style.cssText="position:fixed;inset:0;background:rgba(244,247,251,.98);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px";\n'+
  '  o.innerHTML=\'<div style="max-width:480px;background:#fff;border:1px solid #dbe4ef;border-radius:18px;padding:34px 28px;text-align:center;box-shadow:0 10px 40px rgba(20,40,70,.15);font-family:inherit">\'+\n'+
  '   \'<div style="font-size:52px;line-height:1">\\u2705</div>\'+\n'+
  '   \'<h2 style="margin:14px 0 6px;color:#274b73;font-size:22px">Request received!</h2>\'+\n'+
  '   \'<p style="color:#44536a;font-size:14.5px;line-height:1.55;margin:0 0 6px">We\\u2019ve got it \\u2014 your documents are being read right now. A confirmation email is on its way to you, and one of our experienced agents will follow up with your quote as soon as possible.</p>\'+\n'+
  '   \'<p style="color:#8a97ab;font-size:12.5px;margin:0 0 18px">You can safely close this page.</p>\'+\n'+
  '   \'<a href="https://outlook.office.com/book/BookaMeetingwithCarlosSevilla@NETORGFT15593750.onmicrosoft.com/" target="_blank" rel="noopener" style="display:inline-block;background:#274b73;color:#fff;text-decoration:none;padding:11px 20px;border-radius:999px;font-weight:600;font-size:14px">\\uD83D\\uDCC5 Prefer to talk? Book a call with Carlos</a>\'+\n'+
  '  \'</div>\';\n'+
  '  document.body.appendChild(o);\n'+
  '  window.scrollTo(0,0);\n'+
  ' };\n'+
  '})();\n'+
  '<\/script>';
  return s.replace('</body>', inj+'\n</body>');
}
function patchVin(s){
  var o='<div class="field"><label>VIN</label><input name="v1VIN" placeholder="17-digit VIN"></div>';
  var n='<div class="field"><label>VIN <span class="req">*</span></label><input name="v1VIN" placeholder="17-digit VIN" required></div>';
  return s.split(o).join(n);
}
function load(f){ return patchVin(patchPapa(patchUX(patchForm(fs.readFileSync(f,'utf8').split('__LOGO__').join(logo))))); }
const routes = {
  "/":"hub.html","/home":"index.html","/realtor":"realtor.html","/lender":"lender.html",
  "/property":"property.html","/investment":"investment.html",
  "/renters":"renters.html","/condo":"renters.html",
  "/auto":"auto.html","/commercial":"commercial-auto.html","/rec":"recreation.html",
  "/flood":"flood.html","/umbrella":"umbrella.html","/builders":"builders-risk.html"
};
const PAGES = {};
for (const [r,f] of Object.entries(routes)) PAGES[r] = Buffer.from(load(f),'utf8').toString('base64');

const worker = `const PAGES = ${JSON.stringify(PAGES)};
const SUMMARY_PROMPT = ${JSON.stringify(prompt)};
const RECIPIENT = "carlos@floridianpolicypros.com";
const FROM = "Floridian Policy Pros Quotes <quotes@floridianpolicypros.com>";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let p = url.pathname.replace(/\\/+$/,"") || "/";
    if (p === "/api/submit") return handleSubmit(request, env, ctx);
    if (p === "/api/maillog") {
      if (url.searchParams.get("k") !== "fppz7q4m2x") return new Response("nope",{status:403});
      const r = await fetch("https://api.resend.com/emails", { headers: { authorization: "Bearer " + env.RESEND_API_KEY } });
      return new Response(await r.text(), { headers: { "content-type": "application/json" } });
    }
    const b64 = PAGES[p] || PAGES["/"];
    const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    return new Response(new TextDecoder("utf-8").decode(bytes),
      { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
  }
};

async function handleSubmit(request, env, ctx) {
  if (request.method !== "POST") return j({error:"POST only"},405);
  let payload = null;
  try { payload = await request.json(); } catch(e){ return j({ok:false, error:"bad request"},400); }
  ctx.waitUntil(processSubmit(payload, env));
  return j({ok:true, queued:true});
}

async function processSubmit(payload, env) {
  try {
    const { formType="quote", subject="Quote Request", fields={}, files=[] } = payload;

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
    // Auto-reply confirmation to the client
    if (eout.id && fields.email && /@/.test(fields.email)) {
      try {
        const first = (fields.firstName||"").trim() || "there";
        const conf = "Hi "+first+",\\n\\n"+
          "Thank you — we've received your quote request"+(addr?(" for "+addr):"")+".\\n\\n"+
          "One of our experienced agents is already reviewing it and will follow up with your quote as soon as possible (usually within one business day).\\n\\n"+
          "Need to add anything or prefer to talk it through? Book a time that works for you:\\n"+
          "https://outlook.office.com/book/BookaMeetingwithCarlosSevilla@NETORGFT15593750.onmicrosoft.com/\\n\\n"+
          "Carlos Sevilla\\nFloridian Policy Pros\\nCell (561) 531-8622 · Office (561) 777-0777\\ncarlos@floridianpolicypros.com\\nFloridianPolicyPros.com";
        await fetch("https://api.resend.com/emails",{
          method:"POST",
          headers:{"content-type":"application/json","authorization":"Bearer "+env.RESEND_API_KEY},
          body: JSON.stringify({ from: FROM, to: [fields.email],
            subject: "We received your quote request — Floridian Policy Pros",
            text: conf })
        });
      } catch(e){}
    }
    // Phone push notification (ntfy)
    try {
      const who = (client.trim()||"Unknown client");
      const note = who + (addr ? " — " + addr : "") + " (" + formType.replace(/ intake form.*/i,"") + ")";
      await fetch("https://ntfy.sh/fpp-quotes-ovsjc7k2m9", { method:"POST",
        headers: { "Title": eout.id ? "New quote request" : "Quote request — EMAIL FAILED", "Priority": eout.id ? "high" : "urgent", "Tags": eout.id ? "moneybag" : "warning" },
        body: note });
    } catch(e){}
  } catch(e){
    try { await fetch("https://ntfy.sh/fpp-quotes-ovsjc7k2m9",{method:"POST",
      headers:{"Title":"Quote processing FAILED","Priority":"urgent","Tags":"warning"},
      body:"processSubmit error: "+String(e).slice(0,180)}); } catch(_){}
  }
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
