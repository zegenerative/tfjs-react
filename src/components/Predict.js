import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  Segment,
  SegmentGroup,
  Header,
  Divider,
} from "semantic-ui-react";
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
          <Header>Predict:</Header>
          <Divider />

          <Form>
            <Form.Field>
              <Input
                type="number"
                size="small"
                placeholder="enter a value"
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
          <Header>Results:</Header>
          <Divider />

          <p>{prediction}</p>
        </Segment>
      </SegmentGroup>
    </>
  );
};

export default Predict;
