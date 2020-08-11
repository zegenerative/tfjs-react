import React, { useState, useEffect } from "react";
import "./App.css";
import request from "superagent";
import Home from "./components/Home";
// tfjs-node-gpu better performance, uses webgl

function App() {
  const [data, setData] = useState([]);

  async function fetchDataset() {
    const data = await request("/home")
      .then((res) => {
        console.log(res);
        return res.body;
      })
      .catch(console.error);
    setData(data);
  }

  useEffect(() => {
    fetchDataset();
  }, []);

  return <Home data={data} />;
}

export default App;
