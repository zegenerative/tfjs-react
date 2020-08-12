import React from "react";
import { Button, Segment } from "semantic-ui-react";
import { saveModel, loadModel } from "../tensorflowjs";

const TrainAndTest = ({ data }) => {
  if (!data.model) {
    return (
      <div className="App">
        <p>Loading....</p>
      </div>
    );
  }

  return (
    <Segment.Group>
      <Segment>
        <header>Train and test your model</header>
        <p>Training status:</p>
        <p>Testing status:</p>
        <Button>Train new model</Button>
        <Button>Test model</Button>
        <Button onClick={() => saveModel(data.model)}>Save model</Button>
        <Button onClick={loadModel}>Load model</Button>
      </Segment>
    </Segment.Group>
  );
};

export default TrainAndTest;
