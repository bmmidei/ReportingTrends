import React, {Component} from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
// import Image from "../components/image"
import EconomicDataTSNE from "../components/EconomicDataTSNE"
import WordCountsLineChart from "../components/WordCountsLineChart";
import TopicLineChart from "../components/TopicLineChart";
import Loadable from 'react-loadable';

const LoadableLIWCLineChart = Loadable({
  loader: () => import('../components/LIWCLineChart'),
  loading() {
    return <div>Loading...</div>
  }
});

const LoadableLIWCEconomicLineChart = Loadable({
  loader: () => import('../components/LIWCEconomicLineChart'),
  loading() {
    return <div>Loading...</div>
  }
});

class IndexPage extends Component {

  state = {
    EconomicData: [],
    LIWCData: [],
    TopicData: [],
    worldEvents: [
      {year: 1929, event: 'Wall Street Crash Triggering Great Depression'},
      {year: 1939, event: 'Outbreak of WWII'},
      {year: 1945, event: 'Conclusion of WWII'},
      {year: 1955, event: 'Outbreak of Vietnam War'},
      {year: 1962, event: 'Cuban Missile Crisis'},
      {year: 1989, event: 'Fall of the Berlin Wall'},
      {year: 2001, event: 'September 11th Attacks'},
      {year: 2008, event: 'Housing Bubble Burst'}
    ]
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
        {LIWCData && <LoadableLIWCLineChart height={500} data={LIWCData}/>}
        {LIWCData && EconomicData &&
          <LoadableLIWCEconomicLineChart height={500} economicData={EconomicData} LIWCData={LIWCData}/>}
        {TopicData && <TopicLineChart height={500} data={TopicData}/>}
        <Link to="/page-2/">Go to page 2</Link>
      </Layout>
    )
  }
}

export default IndexPage;
