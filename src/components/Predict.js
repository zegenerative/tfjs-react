import React, { useState } from "react";
import {
  Form,
  Input,
  Segment,
  SegmentGroup,
  Header,
  Divider,
} from "semantic-ui-react";
import { predict } from "../tensorflowjs";

const Predict = ({ data, model }) => {
  const [input, setInput] = useState(undefined);
  const [prediction, setPrediction] = useState(undefined);

  function submitInput(event) {
    event.preventDefault();
    predict(
      input,
      model.model,
      data.normalizedFeature,
      data.normalizedLabel
    ).then(setPrediction);
  }

  const handleChange = (e, value) => setInput(parseInt(value.value));

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
                placeholder="Median income"
                value={input}
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Button icon="settings" onClick={submitInput}>
              Submit
            </Form.Button>
          </Form>
        </Segment>
      </Segment.Group>
      <SegmentGroup>
        <Segment>
          <Header>Predicted house value:</Header>
          <Divider />
          <p>{prediction}</p>
        </Segment>
      </SegmentGroup>
    </>
  );
};

export default Predict;
