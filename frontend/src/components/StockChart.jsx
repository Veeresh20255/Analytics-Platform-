import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";

export default function StockChart() {
  const [symbol, setSymbol] = useState("AAPL");
  const [data, setData] = useState([]);

  const fetchStock = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/stocks/${symbol}`);
      setData(res.data.prices);
    } catch (err) {
      console.error(err);
    }
  };

  // Refresh every 10 sec
  useEffect(() => {
    fetchStock();
    const interval = setInterval(fetchStock, 10000);
    return () => clearInterval(interval);
  }, [symbol]);

  const x = data.map(d => d.time);
  const y = data.map(d => d.price);

  return (
    <div>
      <h3>Live Stock Chart</h3>

      <input
        value={symbol}
        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
        placeholder="Enter symbol (AAPL, TSLA)"
      />

      <Plot
        data={[
          {
            x,
            y,
            type: "scatter",
            mode: "lines",
            line: { color: "#3b82f6" }
          }
        ]}
        layout={{ width: 800, height: 400, title: symbol }}
      />
    </div>
  );
}