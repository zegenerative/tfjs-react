import React, { useState, useEffect } from "react";
import "./App.css";
import request from "superagent";
import * as tfvis from "@tensorflow/tfjs-vis";
// tfjs-node-gpu better performance, uses webgl

function App() {
  const [data, setData] = useState([]);

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

  function showSummary(name, model) {
    tfvis.show.modelSummary({ name }, JSON.parse(model));
  }

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

  if (!data.model) {
    return (
      <div className="App">
        <header className="App-header">Loading...</header>;
      </div>
    );
  }

  console.log(data.trainingLoss, data.testingLoss);
  plot(data.points, "House Age");
  // showSummary("Model summary", data.model);

  return (
    <div className="App">
      <header className="App-header">
        <p>TensorflowJS-vis version: {tfvis.version}</p>
      </header>
    </div>
  );
}

export default App;
