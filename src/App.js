import React, { useState, useEffect } from "react";
import "./App.css";
import "semantic-ui-css/semantic.min.css";
import * as tfvis from "@tensorflow/tfjs-vis";
import TrainAndTest from "./components/TrainAndTest";
import Predict from "./components/Predict";
import { loadData } from "./tensorflowjs";
import { plot, plotClasses } from "./utils/tfjsvis";
import { Container, Segment, Button, Grid } from "semantic-ui-react";

const housingPrices = "http://localhost:3000/kc_house_data.csv";

function App() {
  const [data, setData] = useState(undefined);
  const [model, setModel] = useState(undefined);
  let firstOpen = true;

  let dataLoaded = false;
  if (data) {
    dataLoaded = true;
  }

  let modelLoaded = false;
  if (model) {
    modelLoaded = true;
  }

  useEffect(() => {
    loadData(housingPrices).then(setData);
  }, []);

  const toggleVisor = () => {
    if (firstOpen) {
      plot(data.points, "Square feet");
      plotClasses(data.points, "Waterfront");
      if (modelLoaded) {
        tfvis.show.modelSummary({ name: "Model summary" }, model.model);
      }
    } else {
      tfvis.visor().toggle();
    }
    firstOpen = false;
  };
  if (model) {
    console.log(model);
  }

  return (
    <>
      <header className="App-header">
        Linear regression with TensorflowJS
      </header>
      <Container>
        <Grid>
          <Grid.Column textAlign="center">
            <Button
              primary
              disabled={!dataLoaded}
              size="massive"
              style={{ margin: "2%" }}
              onClick={toggleVisor}
            >
              Visor
            </Button>
          </Grid.Column>
        </Grid>
        <Segment.Group>
          <Segment>
            <TrainAndTest
              data={data}
              loaded={dataLoaded}
              model={model}
              setModel={setModel}
            />
          </Segment>
          <Segment>
            <Predict
              data={data}
              loaded={dataLoaded}
              setData={setData}
              model={model}
            />
          </Segment>
        </Segment.Group>
      </Container>
    </>
  );
}

export default App;
