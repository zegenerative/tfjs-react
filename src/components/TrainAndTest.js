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
          <Message.Content>We are fetching the dataset</Message.Content>
        </Message>
      );
    }
    if (!training && data && !model) {
      return <Message>Ready to train a model</Message>;
    }
    if (training && data && !model) {
      return (
        <Message icon>
          <Icon name="circle notched" loading />
          <Message.Content>We are training the model</Message.Content>
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
      return <Message>Ready to test a model</Message>;
    }
    if (testing === true) {
      return (
        <Message icon>
          <Icon name="circle notched" loading />
          <Message.Content>We are testing the model</Message.Content>
        </Message>
      );
    } else {
      console.log("got a number", testing);
      return <Message>loss: {testing}</Message>;
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
        <Header>Train and test your model</Header>
        <Divider />
        <Header as="h4">Training status:</Header>
        {showTrainingStatus()}
        <Header as="h4">Testing status:</Header>
        {showTestingStatus()}
        <Divider />
        <Button disabled={!loaded} onClick={() => onTrainingClick()}>
          Train model
        </Button>
        <Button disabled={!model} onClick={() => onTestingClick()}>
          Test model
        </Button>
        <Button disabled={!loaded} onClick={saveModel}>
          Save model
        </Button>
        <Button disabled={!loaded} onClick={loadModel}>
          Load model
        </Button>
      </Segment>
    </Segment.Group>
  );
};

export default TrainAndTest;
