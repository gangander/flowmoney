import { writeFile } from "node:fs/promises";

const twseUrl = "https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_AVG_ALL";
const tpexUrl = "https://www.tpex.org.tw/openapi/v1/tpex_mainboard_daily_close_quotes";
const prices = {};

await addTwsePrices();
await addTpexPrices();

await writeFile("prices.json", `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  currency: "TWD",
  prices
}, null, 2)}\n`, "utf8");

console.log(`Wrote ${Object.keys(prices).length} Taiwan stock prices`);

async function addTwsePrices() {
  const rows = await fetchJson(twseUrl);
  for (const row of rows) {
    const code = String(row.Code || "").trim().toUpperCase();
    const price = parsePrice(row.ClosingPrice);
    if (!isSupportedTaiwanSymbol(code) || !price) continue;
    prices[`${code}.TW`] = {
      symbol: `${code}.TW`,
      code,
      name: row.Name || "",
      exchange: "TWSE",
      price,
      date: rocDateToIso(row.Date),
      currency: "TWD"
    };
  }
}

async function addTpexPrices() {
  const rows = await fetchJson(tpexUrl);
  for (const row of rows) {
    const code = String(row.SecuritiesCompanyCode || "").trim().toUpperCase();
    const price = parsePrice(row.Close);
    if (!isSupportedTaiwanSymbol(code) || !price) continue;
    prices[`${code}.TWO`] = {
      symbol: `${code}.TWO`,
      code,
      name: row.CompanyName || "",
      exchange: "TPEx",
      price,
      date: rocDateToIso(row.Date),
      currency: "TWD"
    };
  }
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      "Accept": "application/json",
      "User-Agent": "FlowMoney price updater"
    }
  });
  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }
  return response.json();
}

function parsePrice(value) {
  const price = Number(String(value || "").replace(/,/g, ""));
  return Number.isFinite(price) && price > 0 ? price : 0;
}

function isSupportedTaiwanSymbol(code) {
  return /^(\d{4}|00\d{2,4}[A-Z]?)$/.test(code);
}

function rocDateToIso(value) {
  const text = String(value || "");
  if (!/^\d{7}$/.test(text)) return "";
  const year = Number(text.slice(0, 3)) + 1911;
  return `${year}-${text.slice(3, 5)}-${text.slice(5, 7)}T00:00:00+08:00`;
}
