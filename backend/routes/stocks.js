const express = require('express');
const router = express.Router();
const axios = require('axios');

// Example using Alpha Vantage
router.get('/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol;

    const response = await axios.get(
      `https://www.alphavantage.co/query`,
      {
        params: {
          function: "TIME_SERIES_INTRADAY",
          symbol,
          interval: "5min",
          apikey: process.env.ALPHA_API_KEY
        }
      }
    );

    const raw = response.data["Time Series (5min)"];
    if (!raw) return res.status(400).json({ message: "Invalid symbol" });

    const prices = Object.keys(raw).slice(0, 50).map(time => ({
      time,
      price: Number(raw[time]["4. close"])
    }));

    res.json({ prices });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;