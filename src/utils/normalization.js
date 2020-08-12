function normalize(tensor, previousMin = null, previousMax = null) {
  const min = previousMin || tensor.min();
  const max = previousMax || tensor.max();
  const normalizedTensor = tensor.sub(min).div(max.sub(min));
  return {
    tensor: normalizedTensor,
    min,
    max,
  };
}

function denormalize(tensor, min, max) {
  const denormalizedTensor = tensor.mul(max.sub(min)).add(min);
  return denormalizedTensor;
}

module.exports = {
  normalize,
  denormalize,
};
