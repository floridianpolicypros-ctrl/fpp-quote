const fs = require('fs');
const logo = fs.readFileSync('logo.txt','utf8').trim();
const booking = "https://outlook.office.com/book/BookaMeetingwithCarlosSevilla@NETORGFT15593750.onmicrosoft.com/";
function load(f){ let s = fs.readFileSync(f,'utf8'); return s.split('__LOGO__').join(logo).split('__BOOKING__').join(booking); }
const routes = {
  "/":"hub.html","/home":"index.html","/realtor":"realtor.html","/lender":"lender.html",
  "/property":"property.html","/investment":"investment.html",
  "/renters":"renters.html","/condo":"renters.html",
  "/auto":"auto.html","/commercial":"commercial-auto.html","/rec":"recreation.html",
  "/flood":"flood.html","/umbrella":"umbrella.html"
};
const PAGES = {};
for (const [r,f] of Object.entries(routes)) PAGES[r] = Buffer.from(load(f),'utf8').toString('base64');
const worker = "const PAGES = " + JSON.stringify(PAGES) + ";\n" + `export default {
  async fetch(request) {
    const url = new URL(request.url);
    let p = url.pathname.replace(/\\/+$/,"") || "/";
    const b64 = PAGES[p] || PAGES["/"];
    const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    const html = new TextDecoder("utf-8").decode(bytes);
    return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
  }
};
`;
fs.mkdirSync('dist',{recursive:true});
fs.writeFileSync('dist/worker.js', worker);
console.log('Built dist/worker.js —', worker.length, 'bytes');
