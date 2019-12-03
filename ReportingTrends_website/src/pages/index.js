import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
// import Image from "../components/image"
import EconomicDataTSNE from "../components/EconomicDataTSNE"
import WordCountsLineChart from "../components/WordCountsLineChart";
import LIWCLineChart from "../components/LIWCLineChart";

const IndexPage = () => (
  <Layout>
    {/*<SEO title="Reporting Trends" />*/}
    <h1>Analyzing Reporting Trends in the New York Times</h1>
    {/*<div style={{maxWidth: `300px`, marginBottom: `1.45rem`}}>*/}
    {/*  <Image/>*/}
    {/*</div>*/}
    <EconomicDataTSNE width={600} height={400}/>
    <WordCountsLineChart width={600} height={400}/>
    <LIWCLineChart />
    <Link to="/page-2/">Go to page 2</Link>
  </Layout>
);

export default IndexPage
