import * as tfvis from "@tensorflow/tfjs-vis";

export function plot(pointsArray, featureName) {
  tfvis.render.scatterplot(
    { name: `${featureName} vs House price` },
    { values: [pointsArray], series: ["original"] },
    {
      xLabel: featureName,
      yLabel: "Price",
    }
  );
}

export function showSummary(name, model) {
  tfvis.show.modelSummary({ name }, JSON.parse(model));
}
