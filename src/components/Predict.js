import React, { useState } from "react";
import { Button, Form, Input, Segment, SegmentGroup } from "semantic-ui-react";
import { predict } from "../tensorflowjs";

const Predict = ({ data }) => {
  const [input, setInput] = useState(undefined);
  const [prediction, setPrediction] = useState(undefined);

  function submitInput(event) {
    event.preventDefault();
    predict(
      input,
      data.model,
      data.normalizedFeature,
      data.normalizedLabel
    ).then(setPrediction);
  }

  const handleChange = (e, value) => setInput(parseInt(value.value));

  if (!data.model) {
    return (
      <div className="App">
        <p>Loading....</p>
      </div>
    );
  }
  console.log(prediction);
  return (
    <>
      <Segment.Group>
        <Segment>
          <header>Predict:</header>
          <Form>
            <Form.Field>
              <label>Value</label>
              <Input
                type="number"
                size="small"
                placeholder="value"
                value={input}
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Button onClick={submitInput}>submit</Form.Button>
          </Form>
        </Segment>
      </Segment.Group>
      <SegmentGroup>
        <Segment>
          <p>Results:</p>
          <p>{prediction}</p>
          <button onClick={() => console.log(prediction)}>test</button>
        </Segment>
      </SegmentGroup>
    </>
  );
};

export default Predict;
