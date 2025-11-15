const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");

const app = express();
app.use(cors());
app.use(express.static("widget"));

const PORT = process.env.PORT || 3000;
let cached = "$0.00";

async function scrape() {
  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox","--disable-setuid-sandbox","--disable-dev-shm-usage"]
    });
    const page = await browser.newPage();
    await page.goto("https://pump.fun/profile/toys4kids?tab=balances",
      {waitUntil:"networkidle2",timeout:60000});
    await page.waitForTimeout(4000);
    const text=await page.evaluate(()=>document.body.innerText||"");
    const match=text.match(/\$[0-9,]+\.\d{2}/);
    if(match){cached=match[0];console.log("Scraped:",cached);}
    await browser.close();
  } catch(e){console.warn("Scrape error:",e.message);}
}
scrape();
setInterval(scrape,30000);

app.get("/api/balance",(req,res)=>res.json({value:cached}));
app.get("/",(req,res)=>res.sendFile(require("path").resolve(__dirname,"widget","index.html")));

app.listen(PORT,()=>console.log("Server running on port "+PORT));
