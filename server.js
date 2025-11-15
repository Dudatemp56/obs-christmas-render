const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
app.use(cors());

let latestValue = "$0.00";

async function scrapeBalance() {
  try {
    const browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-zygote"
      ]
    });

    const page = await browser.newPage();
    await page.goto("https://pump.fun/profile/toys4kids?tab=balances", {
      waitUntil: "networkidle2",
      timeout: 60000
    });

    await page.waitForTimeout(5000);

    let value = await page.evaluate(() => {
      const elements = [...document.querySelectorAll("*")];
      const item = elements.find(el => el.textContent.includes("Creator Rewards"));
      if (!item) return null;

      const valueEl = item.parentElement.querySelector("div:last-child");
      return valueEl ? valueEl.textContent.trim() : null;
    });

    console.log("Scraped:", value);
    if (value) latestValue = value;

    await browser.close();
  } catch (err) {
    console.error("Scrape error:", err.message);
  }
}

scrapeBalance();
setInterval(scrapeBalance, 30000);

app.get("/api/balance", (req, res) => {
  res.json({ value: latestValue });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server running on port", PORT));
