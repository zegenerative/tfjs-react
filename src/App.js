import React, { useState, useEffect } from "react";
import "./App.css";
import request from "superagent";
import * as tfvis from "@tensorflow/tfjs-vis";
// tfjs-node-gpu better performance, uses webgl

function App() {
  const [sampleData, setSampleData] = useState([]);

  async function fetchDataset() {
    const dataset = await request("/home")
      .then((res) => {
        return res.body;
      })
      .catch(console.error);
    setSampleData(dataset);
  }

  useEffect(() => {
    fetchDataset();
  }, []);

  if (!sampleData[0]) {
    return "";
  }
  console.log(sampleData[0]);

  return (
    <div className="App">
      <header className="App-header">
        <p>TensorflowJS-vis version: {tfvis.version}</p>
        {sampleData.map((el, i) => (
          <p key={i}>{el.longitude}</p>
        ))}
      </header>
    </div>
  );
}

export default App;
