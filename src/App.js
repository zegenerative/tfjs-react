import React, { useState, useEffect } from "react";
import "./App.css";
import * as tfvis from "@tensorflow/tfjs-vis";
import TrainAndTest from "./components/TrainAndTest";
import Predict from "./components/Predict";
import { run } from "./tensorflowjs";
import { plot } from "./utils/tfjsvis";
import { Segment } from "semantic-ui-react";

const housingPrices = "http://localhost:3000/housing.csv";
// tfjs-node-gpu better performance, but as of august 2020 only CUDA(Linux) + nvidia

function App() {
  const [data, setData] = useState([]);

  //check if uses WebGL:
  // console.log(tf.getBackend());

  useEffect(() => {
    run(housingPrices).then(setData);
  }, []);

  if (!data.model) {
    return (
      <>
        <header className="App-header">
          Linear regression with TensorflowJS
        </header>
        <p>Loading...</p>
      </>
    );
  }
  plot(data.points, "House Age");
  tfvis.show.modelSummary({ name: "Model summary" }, data.model);
  return (
    <>
      <header className="App-header">
        Linear regression with TensorflowJS
      </header>
      <Segment.Group>
        <Segment>
          <TrainAndTest data={data} />;
        </Segment>
        <Segment>
          <Predict data={data} setData={setData} />;
        </Segment>
      </Segment.Group>
    </>
  );
}

export default App;
