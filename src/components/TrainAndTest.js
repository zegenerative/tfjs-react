import React from "react";
import { Button, Segment, Header, Divider } from "semantic-ui-react";
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
        <Header>Train and test your model</Header>
        <Divider />
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
