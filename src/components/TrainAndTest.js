import React, { useState } from "react";
import {
  Button,
  Segment,
  Header,
  Divider,
  Message,
  Icon,
} from "semantic-ui-react";
import { saveModel, loadModel, trainModel, testModel } from "../tensorflowjs";

const TrainAndTest = ({ data, loaded, model, setModel }) => {
  const [training, setTraining] = useState(false);
  const [testing, setTesting] = useState(false);

  const showTrainingStatus = () => {
    if (!data) {
      return (
        <Message icon>
          <Icon name="circle notched" loading />
          <Message.Content>Fetching data...</Message.Content>
        </Message>
      );
    }
    if (!training && data && !model) {
      return <Message>Ready to prepare and train a model</Message>;
    }
    if (training && data && !model) {
      return (
        <Message icon>
          <Icon name="circle notched" loading />
          <Message.Content>Training the model...</Message.Content>
        </Message>
      );
    }
    if (training && data && model) {
      return (
        <>
          <Message>Training loss: {model.trainingLoss}</Message>
          <Message>Validation loss: {model.validationLoss}</Message>
        </>
      );
    }
  };

  const showTestingStatus = () => {
    if (!model) {
      return <Message>No model trained</Message>;
    }
    if (model && !testing) {
      return <Message>Ready to test the model</Message>;
    }
    if (testing === true) {
      return (
        <Message icon>
          <Icon name="circle notched" loading />
          <Message.Content>Testing the model...</Message.Content>
        </Message>
      );
    } else {
      return <Message>Loss: {testing}</Message>;
    }
  };

  function onTrainingClick() {
    setTraining(true);
    trainModel(data.trainingFeatureTensor, data.trainingLabelTensor).then(
      setModel
    );
  }

  function onTestingClick() {
    setTesting(true);
    testModel(
      model.model,
      data.testingFeatureTensor,
      data.testingLabelTensor
    ).then(setTesting);
  }

  return (
    <Segment.Group>
      <Segment>
        <Header>Train and test a model</Header>
        <Divider />
        <Header as="h4">Training status:</Header>
        {showTrainingStatus()}
        <Header as="h4">Testing status:</Header>
        {showTestingStatus()}
        <Divider />
        <Button disabled={!loaded} onClick={() => onTrainingClick()}>
          Prepare/Train
        </Button>
        <Button disabled={!model} onClick={() => onTestingClick()}>
          Test
        </Button>
        <Button disabled={!model} onClick={() => saveModel(model.model)}>
          Save
        </Button>
        <Button disabled={!loaded} onClick={loadModel}>
          Load
        </Button>
      </Segment>
    </Segment.Group>
  );
};

export default TrainAndTest;
