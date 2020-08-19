import * as tf from "@tensorflow/tfjs";

function normalize(tensor, previousMin = null, previousMax = null) {
  // multiple features
  const featureDimensions = tensor.shape.length > 1 && tensor.shape[1];
  if (featureDimensions && featureDimensions > 1) {
    // split into separate tensors
    const features = tf.split(tensor, featureDimensions, 1);

    const normalizedFeatures = features.map((featureTensor, i) =>
      normalize(
        featureTensor,
        previousMin ? previousMin[i] : null,
        featureTensor,
        previousMin ? previousMin[i] : null
      )
    );

    const returnTensor = tf.concat(
      normalizedFeatures.map((f) => f.tensor),
      1
    );
    const min = normalizedFeatures.map((f) => f.min);
    const max = normalizedFeatures.map((f) => f.max);
    return {
      tensor: returnTensor,
      min,
      max,
    };
  } else {
    // just one feature
    const min = previousMin || tensor.min();
    const max = previousMax || tensor.max();
    const normalizedTensor = tensor.sub(min).div(max.sub(min));
    return {
      tensor: normalizedTensor,
      min,
      max,
    };
  }
}

function denormalize(tensor, min, max) {
  // multiple features
  const featureDimensions = tensor.shape.length > 1 && tensor.shape[1];
  if (featureDimensions && featureDimensions > 1) {
    // split into separate tensors
    const features = tf.split(tensor, featureDimensions, 1);

    const denormalized = features.map((featureTensor, i) =>
      denormalize(featureTensor, min[i], max[i])
    );

    const returnTensor = tf.concat(denormalized, 1);
    return returnTensor;
  } else {
    // just one feature
    const denormalizedTensor = tensor.mul(max.sub(min)).add(min);
    return denormalizedTensor;
  }
}

module.exports = {
  normalize,
  denormalize,
};
