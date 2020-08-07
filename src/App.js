import React, { useState, useEffect } from "react";
import "./App.css";
import request from "superagent";
import * as tfvis from "@tensorflow/tfjs-vis";
// tfjs-node-gpu better performance, uses webgl

function App() {
  const [sampleData, setSampleData] = useState([]);

  function plot(pointsArray, featureName) {
    tfvis.render.scatterplot(
      { name: `${featureName} vs House price` },
      { values: [pointsArray], series: ["original"] },
      {
        xLabel: featureName,
        yLabel: "Price",
      }
    );
  }

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

  if (!sampleData.result) {
    return "";
  }

  plot(sampleData.points, "House Age");

  return (
    <div className="App">
      <header className="App-header">
        <p>TensorflowJS-vis version: {tfvis.version}</p>
        {sampleData.result.map((el, i) => (
          <p key={i}>{el.longitude}</p>
        ))}
      </header>
    </div>
  );
}

export default App;
