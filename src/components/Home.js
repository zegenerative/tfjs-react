import React from "react";
import { plot, showSummary } from "../utils/tfjsvis";

const Home = ({ data }) => {
  if (!data.model) {
    return (
      <div className="App">
        <header>TensorflowJS with React and NodeJS</header>
        <p>Loading....</p>
      </div>
    );
  }

  console.log(JSON.parse(data.model));
  plot(data.points, "House Age");
  // showSummary("Model summary", data.model);

  return (
    <div className="App">
      <header className="App-header">TensorflowJS with React and NodeJS</header>
    </div>
  );
};

export default Home;
