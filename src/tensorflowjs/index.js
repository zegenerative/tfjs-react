import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
// tfjs-node-gpu better performance, but as of august 2020 only CUDA(Linux) + nvidia
const { normalize, denormalize } = require("../utils/normalization");

function createModel() {
  const model = tf.sequential();

  model.add(
    tf.layers.dense({
      units: 10,
      useBias: true,
      activation: "sigmoid",
      inputDim: 1,
    })
  );

  model.add(
    tf.layers.dense({
      units: 10,
      useBias: true,
      activation: "sigmoid",
    })
  );

  // output layer
  model.add(
    tf.layers.dense({
      units: 1,
      useBias: true,
      activation: "sigmoid",
    })
  );

  //with tf.train.adam() you don't have to specify learning rate (in this case 0.1), it does so automatically
  const optimizer = tf.train.sgd(0.1);
  model.compile({
    loss: "meanSquaredError",
    optimizer,
  });

  return model;
}

// number of batches = dataset(rows) / batch size
// training steps (epochs) = number of batches

export async function trainModel(trainingFeatureTensor, trainingLabelTensor) {
  const model = createModel();
  return await train(model, trainingFeatureTensor, trainingLabelTensor);
}

async function train(model, trainingFeatureTensor, trainingLabelTensor) {
  const { onEpochEnd } = tfvis.show.fitCallbacks(
    { name: "Training Performance" },
    ["loss"]
  );
  const trainingResults = await model.fit(
    trainingFeatureTensor,
    trainingLabelTensor,
    {
      batchSize: 32,
      epochs: 10,
      // epochs: 3,
      callbacks: {
        onEpochEnd,
      },
      validationSplit: 0.2,
    }
  );
  const trainingLoss = trainingResults.history.loss.pop();
  const validationLoss = trainingResults.history.val_loss.pop();
  return {
    model,
    trainingResults,
    trainingLoss,
    validationLoss,
  };
}

export async function testModel(
  model,
  testingFeatureTensor,
  testingLabelTensor
) {
  const lossTensor = model.evaluate(testingFeatureTensor, testingLabelTensor);
  const loss = await lossTensor.dataSync();
  return loss;
}

const storageID = "test";

export async function saveModel(model) {
  console.log(model);
  await model.save(`localstorage://${storageID}`);
}

export async function loadModel() {
  const storageKey = `localstorage://${storageID}`;
  const models = await tf.io.listModels();
  const modelInfo = models[storageKey];
  if (modelInfo) {
    alert("Model loaded");
    return await tf.loadLayersModel(storageKey);
  }
  return alert("No model found");
}

export async function predict(
  input,
  model,
  normalizedFeature,
  normalizedLabel
) {
  if (isNaN(input)) {
    return alert("Please enter a valid number");
  }
  const result = tf.tidy(() => {
    const inputTensor = tf.tensor1d([input]);
    const normalizedInput = normalize(
      inputTensor,
      normalizedFeature.min,
      normalizedFeature.max
    );
    const normalizedOutputTensor = model.predict(normalizedInput.tensor);
    const outputTensor = denormalize(
      normalizedOutputTensor,
      normalizedLabel.min,
      normalizedLabel.max
    );
    const outputValue = outputTensor.dataSync()[0];
    const outputValueRounded = (outputValue / 1000).toFixed(0) * 1000;
    return outputValueRounded;
  });
  return result;
}

export async function loadData(dataset) {
  const housingDataset = await tf.data.csv(dataset);

  const pointsDataset = housingDataset.map((record) => ({
    x: record.sqft_living,
    y: record.price,
    class: record.waterfront,
  }));
  const points = await pointsDataset.toArray();
  if (points % 2 !== 0) {
    points.pop();
  }
  tf.util.shuffle(points);

  // extract features
  const featureValues = points.map((p) => [p.x, p.y]);
  const featureTensor = tf.tensor2d(featureValues);

  // extract labels
  const labelValues = points.map((p) => p.class);
  const labelTensor = tf.tensor2d(labelValues, [labelValues.length, 1]);

  const normalizedFeature = normalize(featureTensor);
  const normalizedLabel = normalize(labelTensor);
  featureTensor.dispose();
  labelTensor.dispose();

  const [trainingFeatureTensor, testingFeatureTensor] = tf.split(
    normalizedFeature.tensor,
    2
  );

  const [trainingLabelTensor, testingLabelTensor] = tf.split(
    normalizedLabel.tensor,
    2
  );

  return {
    points,
    normalizedFeature,
    normalizedLabel,
    trainingFeatureTensor,
    trainingLabelTensor,
    testingFeatureTensor,
    testingLabelTensor,
  };
}
