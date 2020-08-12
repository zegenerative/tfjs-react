import * as tf from "@tensorflow/tfjs";
const date = new Date();
const { normalize, denormalize } = require("../utils/normalization");

export function createModel() {
  const model = tf.sequential();

  model.add(
    tf.layers.dense({
      units: 1,
      useBias: true,
      activation: "linear",
      inputDim: 1,
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

export async function trainModel(
  model,
  trainingFeatureTensor,
  trainingLabelTensor
) {
  return model.fit(trainingFeatureTensor, trainingLabelTensor, {
    batchSize: 32,
    epochs: 20,
    callbacks: {
      onEpochEnd: (epoch, log) =>
        console.log(`Epoch ${epoch}: loss = ${log.loss}`),
    },
    validationSplit: 0.2,
  });
}

const storageID = "test";

export async function saveModel(model) {
  await model.save(`localstorage://${storageID}`);
}

export async function loadModel() {
  const storageKey = `localstorage://${storageID}`;
  const models = await tf.io.listModels();
  const modelInfo = models[storageKey];
  if (modelInfo) {
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

export async function run(dataset) {
  const housingDataset = await tf.data.csv(dataset);

  const pointsDataset = housingDataset.map((record) => ({
    x: record.housing_median_age,
    y: record.median_house_value,
  }));
  const points = await pointsDataset.toArray();
  tf.util.shuffle(points);

  const featureValues = points.map((p) => p.x);
  const featureTensor = tf.tensor2d(featureValues, [featureValues.length, 1]);

  const labelValues = points.map((p) => p.y);
  const labelTensor = tf.tensor2d(labelValues, [labelValues.length, 1]);

  const normalizedFeature = normalize(featureTensor);
  const normalizedLabel = normalize(labelTensor);

  const [trainingFeatureTensor, testingFeatureTensor] = tf.split(
    normalizedFeature.tensor,
    2
  );

  const [trainingLabelTensor, testingLabelTensor] = tf.split(
    normalizedLabel.tensor,
    2
  );
  const model = await createModel();
  // const trainedModel = await trainModel(
  //   model,
  //   trainingFeatureTensor,
  //   trainingLabelTensor
  // );
  // const trainingLoss = trainedModel.history.loss.pop();
  // const lossTensor = model.evaluate(testingFeatureTensor, testingLabelTensor);
  // const testingLoss = await lossTensor.dataSync();
  // const validationLoss = await trainedModel.history.val_loss.pop();

  // await model.save(
  //   `file:///Users/zegerdevos/Documents/code/MachineLearning/udemy-tfjs/tfjs-backend/src/models/${date}/`
  // );

  return {
    points,
    model,
    normalizedFeature,
    normalizedLabel,
    // trainingLoss,
    // testingLoss,
    // validationLoss
  };
}
