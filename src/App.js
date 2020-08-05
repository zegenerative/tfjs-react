import React, { useState, useEffect } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import housing from "./data/housing.csv";
// tfjs-node-gpu better performance, uses webgl

function App() {
  const [sampleData, setSampleData] = useState([]);
  async function showSampleDataset(dataset) {
    const housingDataset = tf.data.csv(dataset);
    const sampleDataset = housingDataset.take(3);
    const dataArray = await sampleDataset.toArray();
    return dataArray;
  }

  useEffect(() => {
    showSampleDataset(housing).then(setSampleData);
  }, []);

  if (!sampleData[0]) {
    return "";
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>TensorflowJS version: {tf.version.tfjs}</p>
        {sampleData.map((el, i) => (
          <p key={i}>{el.longitude}</p>
        ))}
      </header>
    </div>
  );
}

export default App;
