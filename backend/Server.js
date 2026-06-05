const express = require("express");
const axios = require("axios");
const cors = require("cors");
const crypto = require("crypto");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/intraday-stocks", async (req, res) => {
  try {
    const body =
      "data=%7B%22filterCriteria%22%3A%7B%22price_change%22%3A%5B%7B%22value%22%3A%22NONE%22%2C%22key%22%3A%22ltpChange5min%22%2C%22operator%22%3A%22GREATER_THAN_EQUALS%22%2C%22label%22%3A%22None%22%7D%5D%7D%7D";

    const response = await axios.post(
      "https://groww.in/bff/web/stocks/screener/web-pages/screener_stocks?screenerId=intraday",
      body,
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/x-www-form-urlencoded",
          "x-app-id": "growwWeb",
          "x-device-type": "desktop",
          "x-platform": "web",
          "x-device-id": "9b50bca8-8381-5ed0-84b2-e663e094e99e",
          "x-device-id-v2": "9b50bca8-8381-5ed0-84b2-e663e094e99e",
          "x-request-checksum":
            "Mm8ybTNwIyMjNTBxOGRKM294UlZQMmVDeVVtdnBVbFB4QklGcmp0dGtXeXV3enc4NElXMTVISUZ3OGZBeFpyU3ZsUEpJdUl6T05yZjFuK3J2K2dtTVBpVWdWS3h1dFhwR1hxQTlHTkxnQ2FiWjBoRFJrL0k9",
          "x-request-id": crypto.randomUUID(),
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);

    res.status(500).json({
      success: false,
      error: err.response?.data || err.message,
    });
  }
});


app.get("/api/etf-stocks", async (req, res) => {
  try {
    const body =
      "data=%7B%22filterCriteria%22%3A%7B%22category%22%3A%5B%7B%22value%22%3A%22NONE%22%2C%22key%22%3A%22category%22%2C%22operator%22%3A%22EQUALS%22%2C%22label%22%3A%22All%22%7D%5D%2C%22expenseRatio%22%3A%5B%7B%22value%22%3A%22NONE%22%2C%22key%22%3A%22expenseRatio%22%2C%22operator%22%3A%22LESS_THAN_EQUALS%22%2C%22label%22%3A%22All%22%7D%5D%7D%2C%22sortCriteria%22%3A%7B%22key%22%3A%22turnover%22%2C%22order%22%3A%22DESCENDING%22%7D%7D";

    const response = await axios.post(
      "https://groww.in/bff/web/stocks/screener/web-pages/screener_stocks?screenerId=etf",
      body,
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/x-www-form-urlencoded",
          "x-app-id": "growwWeb",
          "x-device-type": "desktop",
          "x-platform": "web",
          "x-device-id": "9b50bca8-8381-5ed0-84b2-e663e094e99e",
          "x-device-id-v2": "9b50bca8-8381-5ed0-84b2-e663e094e99e",
          "x-request-checksum":
            "djB6M28jIyNYRm1KVFloUXlWb1NwYW4xNUVOaHRRNkNOWjFJVDBXV0Jabkd3aWVycU1JaEF4bFU5YWVaZjRuVGVXRHJWdHNwZC9EdytVYlA0R0swVkxxbS9qRVVJcmkzOWZyS29iU1pRZU9rTVVEclhJQT0=",
          "x-request-id": crypto.randomUUID(),
          Referer: "https://groww.in/etfs",
          Origin: "https://groww.in",
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);

    res.status(500).json({
      success: false,
      error: err.response?.data || err.message,
    });
  }
});


app.get("/api/indices", async (req, res) => {
  try {
    const response = await axios.post(
      "https://groww.in/v1/api/stocks_data/v1/tr_live_delayed/segment/CASH/latest_aggregated",
      {
        exchangeAggReqMap: {
          NSE: {
            priceSymbolList: [],
            indexSymbolList: [
              "NIFTY",
              "BANKNIFTY",
              "FINNIFTY",
              "NIFTYMIDSELECT",
              "INDIAVIX",
              "NIFTYTOTALMCAP",
              "NIFTYJR",
              "NIFTY100",
              "NIFTYMIDCAP",
              "NIFTY500",
              "NIFTYAUTO",
              "NIFTYSMALL",
              "NIFTYFMCG",
              "NIFTYMETAL",
              "NIFTYPHARMA",
              "NIFTYPSUBANK",
              "NIFTYIT",
              "NIFTYSMALLCAP250",
              "NIFTYMIDCAP150",
              "NIFTYCDTY",
            ],
          },
          BSE: {
            priceSymbolList: [],
            indexSymbolList: ["1", "14", "2", "19", "23", "93"],
          },
        },
      },
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",

          "x-app-id": "growwWeb",
          "x-device-type": "desktop",
          "x-platform": "web",

          "x-device-id": "9b50bca8-8381-5ed0-84b2-e663e094e99e",
          "x-device-id-v2": "9b50bca8-8381-5ed0-84b2-e663e094e99e",

          "x-request-id": crypto.randomUUID(),

          Referer: "https://groww.in/indices/indian-indices",
          Origin: "https://groww.in",

          // Add these only if API returns 401/403
          authorization: process.env.GROWW_AUTH_TOKEN,
          "x-user-campaign": process.env.GROWW_CAMPAIGN_TOKEN,
          "x-request-checksum": process.env.GROWW_CHECKSUM,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);

    res.status(500).json({
      success: false,
      error: err.response?.data || err.message,
    });
  }
});


app.listen(8000, () => {
  console.log("Server running on port 8000");
});