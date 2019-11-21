import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
// import BarChart from "../components/BarChart"
import EconomicDataTSNE from "../components/EconomicDataTSNE"



const IndexPage = () => (
  <Layout>
    <SEO title="Reporting Trends" />
    <h1>Analyzing Reporting Trends in the New York Times</h1>
    <p>Now go build something great, bro.</p>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
    <EconomicDataTSNE />
    {/*<BarChart data={[5,10,1,3]} size={[500,500]} />*/}
    <Link to="/page-2/">Go to page 2</Link>
  </Layout>
);

export default IndexPage
