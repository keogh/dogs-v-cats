import React, { useState, useRef } from "react"
// import { Link } from "gatsby"
import * as tf from '@tensorflow/tfjs';

import Button from '@material-ui/core/Button';

import Layout from "../components/layout"
// import Image from "../components/image"
import SEO from "../components/seo"



const IndexPage = ({ location }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [predictedData, setPredictedData] = useState(null);
  const imageEl = useRef(null);

  const handleImageChange = e => {
    const reader = new FileReader();

    reader.onload = event => setImageSrc(event.target.result);
    reader.readAsDataURL(e.target.files[0]);
    setPredictedData(null);
  }

  const handlePredict = async () => {
    const model = await tf.loadLayersModel(`${location.href}model/model.json`);
    model.summary()

    let example = tf.image.resizeBilinear(
      tf.browser.fromPixels(imageEl.current), [150, 150]
    );

    let examples = example.reshape([1, 150, 150, 3])
    examples = tf.div(examples, tf.scalar(255.0, 'float32'));
    window.example = example;
    window.examples = examples;

    const prediction = model.predict(examples)
    window.prediction = prediction;
    const predictedValue = prediction.dataSync()

    let label = 'cat';
    let prob = 0.0;
    if (predictedValue > 0.5) {
      label = 'dog';
      prob = predictedValue * 100;
    } else {
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
      <div>
        <p>
          Select a image:
        </p>
        <p>
          <input
            id="input-image"
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
          />
        </p>
        <p>
          <Button variant="contained" color="primary" onClick={handlePredict}>
            Predict
          </Button>
        </p>
        {predictedData && (
          <>
            <p>This is a {predictedData.label}</p>
            <p>I'm {Intl.NumberFormat('en-US', { maximumFractionDigits: 3 }).format(predictedData.prob)}% sure of that!</p>
            <p>Predicted value: {predictedData.predictedValue}</p>
          </>
        )}
        <p>
          {imageSrc &&
            <img id="img-sample" src={imageSrc} ref={imageEl} alt="preview" style={{ maxHeight: 400 }} />
          }
        </p>
      </div>
      {/* <h1>Hi people</h1>
      <p>Welcome to your new Gatsby site.</p>
      <p>Now go build something great.</p>
      <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
        <Image />
      </div>
      <Link to="/page-2/">Go to page 2</Link> */}
    </Layout>
  );
}

export default IndexPage
