import React, {Component} from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
// import Image from "../components/image"
import EconomicDataTSNE from "../components/EconomicDataTSNE"
import WordCountsLineChart from "../components/WordCountsLineChart";
import LIWCLineChart from "../components/LIWCLineChart";
import TopicLineChart from "../components/TopicLineChart";

class IndexPage extends Component {

  state = {
    EconomicData: [],
    LIWCData: [],
    TopicData: [],
  };

  queryData = (source) => {
    // Toggle these two lines between local dev and deployment
    return fetch('https://eloquent-blackwell-3fb9dd.netlify.com/.netlify/functions/' + source, {
      // return fetch('/.netlify/functions/' + source, {
      headers: { accept: "Accept: application/json" },
      method: 'POST',
    }).then(response => {
      return response.json()
    })
  };

  componentDidMount() {
    let dataSources = ['EconomicData', 'LIWCData', 'TopicData'];
    console.log('fetching data');
    dataSources.forEach(source => {
      this.queryData(source).then((response) => {
        // Store queried data in state
        this.setState({[source]: response});
      }).catch((error) => {
        console.log('API error', error)
      });
    });
  };

  render() {
    const { EconomicData } = this.state;
    const { LIWCData } = this.state;
    const { TopicData } = this.state;
    return (
      <Layout>
        {/*<SEO title="Reporting Trends" />*/}
        <h1>Analyzing Reporting Trends in the New York Times</h1>
        {/*<div style={{maxWidth: `300px`, marginBottom: `1.45rem`}}>*/}
        {/*  <Image/>*/}
        {/*</div>*/}
        {EconomicData && <EconomicDataTSNE data={EconomicData} width={600} height={400}/>}
        {EconomicData && <WordCountsLineChart data={EconomicData} width={600} height={400}/>}
        {LIWCData && <LIWCLineChart data={LIWCData}/>}
        {TopicData && <TopicLineChart height={500} data={TopicData}/>}
        <Link to="/page-2/">Go to page 2</Link>
      </Layout>
    )
  }
}


export default IndexPage;
