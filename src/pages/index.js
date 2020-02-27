import React, { useState, useRef, useEffect } from "react"
// import { Link } from "gatsby"
import * as tf from '@tensorflow/tfjs';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import PetsIcon from '@material-ui/icons/Pets';

import Layout from "../components/layout"
// import Image from "../components/image"
import SEO from "../components/seo"


const useModel = url => {
  const [model, setModel] = useState(null);

  useEffect(() => {
    (async () => {
      const tfModel = await tf.loadLayersModel(url);
      tfModel.summary();

      setModel(tfModel);
    })();
  }, [url]);

  return model;
};

// TODO: Migrate to TailwingCSS
const useStyles = makeStyles(() => ({
  predictedPet: {
    marginBottom: 12,
  }
}));

const IndexPage = ({ location }) => {
  const classes = useStyles();
  const [imageSrc, setImageSrc] = useState(null);
  const [predictedData, setPredictedData] = useState(null);
  const imageEl = useRef(null);

  const model = useModel(`${location.href}model/model.json`);

  const handleImageChange = e => {
    const imageFile = e.target.files[0];
    if (!imageFile) {
      return;
    }

    const reader = new FileReader();

    reader.onload = event => setImageSrc(event.target.result);
    reader.readAsDataURL(e.target.files[0]);
    setPredictedData(null);
  }

  const handlePredict = () => {
    let example = tf.image.resizeBilinear(
      tf.browser.fromPixels(imageEl.current), [150, 150]
    );
    let examples = example.reshape([1, 150, 150, 3])
    examples = tf.div(examples, tf.scalar(255.0, 'float32'));

    const prediction = model.predict(examples)
    const predictedValue = prediction.dataSync()[0];

    let label = '';
    let prob = 0.0;
    if (predictedValue > 0.5) {
      label = 'Dog';
      prob = predictedValue * 100;
    } else {
      label = 'Cat';
      prob = (1 - predictedValue) * 100;
    }

    setPredictedData({
      label,
      prob,
      predictedValue
    });
  };

  return (
    <Layout>
      <SEO title="Home" />
      <CssBaseline />
      <div>
        <Typography paragraph>
          Select a image:&nbsp;
          <input
            id="input-image"
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
          />
        </Typography>
        <p>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePredict}
            disabled={!imageSrc}
            endIcon={<PetsIcon />}
          >
            Predict
          </Button>
        </p>
        {predictedData && (
          <>
            <div className={classes.predictedPet}>
              <Typography display="inline" variant="h5">
                This is a&nbsp;
              </Typography>
              <Typography display="inline" variant="h4" color="primary">
                <strong>{predictedData.label}</strong>
              </Typography>
            </div>

            <Typography paragraph>
              I'm <strong>{Intl.NumberFormat('en-US', { maximumFractionDigits: 3 }).format(predictedData.prob)}%</strong> sure of that!
            </Typography>
            <Typography paragraph>
              Predicted value: <strong>{predictedData.predictedValue}</strong>
            </Typography>
          </>
        )}
        <p>
          {imageSrc &&
            <img id="img-sample" src={imageSrc} ref={imageEl} alt="preview" style={{ maxHeight: 400 }} />
          }
        </p>
      </div>
    </Layout>
  );
}

export default IndexPage
