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

export async function plotClasses(
  pointsArray,
  keyName,
  size = 400,
  equalizeClassSizes = true
) {
  const allSeries = {};
  pointsArray.forEach((p) => {
    const seriesName = `${keyName}: ${p.class}`;
    let series = allSeries[seriesName];
    if (!series) {
      series = [];
      allSeries[seriesName] = series;
    }
    series.push(p);
  });

  if (equalizeClassSizes) {
    let maxLength = null;
    Object.values(allSeries).forEach((series) => {
      if (
        maxLength === null ||
        (series.length < maxLength && series.length >= 100)
      ) {
        maxLength = series.length;
      }
    });

    Object.keys(allSeries).forEach((key) => {
      allSeries[key] = allSeries[key].slice(0, maxLength);
      if (allSeries[key].length < 100) {
        delete allSeries[key];
      }
    });
  }

  tfvis.render.scatterplot(
    {
      name: "Square feet VS house price",
      styles: { width: "100%" },
    },
    {
      values: Object.values(allSeries),
      series: Object.keys(allSeries),
    },
    {
      xLabel: "Square feet",
      yLabel: "Price",
      height: size,
      width: size * 1.5,
    }
  );
}

export function showSummary(name, model) {
  tfvis.show.modelSummary({ name }, JSON.parse(model));
}
