import React, { useState } from "react"
// import { Link } from "gatsby"

import Button from '@material-ui/core/Button';

import Layout from "../components/layout"
// import Image from "../components/image"
import SEO from "../components/seo"



const IndexPage = () => {
  const [imageSrc, setImageSrc] = useState(null);

  const handleImageChange = e => {
    console.log('here');
    console.log(e.target.files);
    const reader = new FileReader();

    reader.onload = event => setImageSrc(event.target.result);
    reader.readAsDataURL(e.target.files[0]);
  }

  const handlePredict = async () => {
    console.log('hola');
  };

  return (
    <Layout>
      <SEO title="Home" />
      <div>
        <p>
          Select a image:
        </p>
        <input
          id="input-image"
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleImageChange}
        />
        <p>
          {imageSrc && <img src={imageSrc} alt="preview" style={{ maxHeight: 500 }} />}
        </p>
        <p>
          <Button variant="contained" color="primary" onClick={handlePredict}>
            Predict
          </Button>
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
