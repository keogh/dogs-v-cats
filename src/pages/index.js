import * as tf from '@tensorflow/tfjs';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PetsIcon from '@material-ui/icons/Pets';

import React, { useEffect, useRef, useState } from "react";
import Layout from "../components/layout";
import SEO from "../components/seo";


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
  someMarginBottom: {
    marginBottom: 16,
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
        <div className={classes.someMarginBottom}>
          <Typography gutterBottom variant="h6">
            This an image classifier that tries to predict whether the selected image is a Dog or a Cat.
          </Typography>
        </div>

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
            <div className={classes.someMarginBottom}>
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
        <div style={{ minHeight: 400 }}>
          <p>
            {imageSrc &&
              <img id="img-sample" src={imageSrc} ref={imageEl} alt="preview" style={{ maxHeight: 400 }} />
            }

            {!imageSrc &&
              <img alt="placeholder" src="https://via.placeholder.com/350?text=preview" />
            }
          </p>
        </div>
        <Divider className={classes.someMarginBottom} />
        <div>
          <Typography gutterBottom variant="body2">
            This model was trained with <Link href="https://keras.io/" target="_blank" rel="noopener">Keras</Link> library in python with <Link href="https://tensorflow.org/" target="_blank" rel="noopener">Tensorflow</Link> as backend.
            <br/><br/>
            I used the <Link href="https://www.kaggle.com/c/dogs-vs-cats-redux-kernels-edition" target="_blank" rel="noopener">"Dogs vs Cats Redux: Kernels Edition"</Link> dataset un <Link href="https://www.kaggle.com/" target="_blank" rel="noopener">Kaggle</Link>.
            <br/><br/>
            I trained it using <Link href="http://cs231n.github.io/convolutional-networks/" target="_blank" rel="noopener">convolutional neural network</Link> with a <Link href="https://blog.keras.io/building-powerful-image-classification-models-using-very-little-data.html" target="_blank" rel="noopener">data augmentation</Link> technique based on my readings in <Link href="https://twitter.com/fchollet" target="_blank" rel="noopener">François Chollet's</Link> book <Link href="https://www.goodreads.com/book/show/33986067-deep-learning-with-python" target="_blank" rel="noopener">Deep Learning with Python</Link>.
            <br/><br/>
            You can see all the data preparation, training, evaluation, test, accuracy in the Kaggle notebook: <Link href="https://www.kaggle.com/keogh24/dogs-vs-cats-keras-data-augmentation/" target="_blank" rel="noopener">https://www.kaggle.com/keogh24/dogs-vs-cats-keras-data-augmentation/</Link>
            <br/><br/>
            I saved the model in <Link href="https://www.h5py.org/" target="_blank" rel="noopener">HDF5</Link> format then <Link href="https://www.tensorflow.org/js/guide/conversion" target="_blank" rel="noopener">I exported to tensorflow.js</Link>, loaded it in a <Link href="https://www.gatsbyjs.org/" target="_blank" rel="noopener">gatsby.js</Link> static website.
            <br/><br/>
            This will only try to predict whether the image is a dog or cat no matter what image you upload.
            <br/><br/>
            This is all done in the web browser using <Link href="https://www.tensorflow.org/js" target="_blank" rel="noopener">tensorflow.js</Link>
            <br/><br/>
            This was a site I created for a tech talk I gave in Feb 27 2020. Here are the slides.
          </Typography>
        </div>
      </div>
    </Layout>
  );
}

export default IndexPage
