import React, {Component} from "react"
import Layout from "../components/layout"
import EconomicDataTSNE from "../components/EconomicDataTSNE"
import TopicLineChart from "../components/TopicLineChart";
import WorldEventsLineChart from "../components/WorldEventsLineChart";
import Loadable from 'react-loadable';
import '../static/main.css';


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
      {year: 1929, event: 'Wall Street Crash'},
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
    return fetch('https://reportingtrends.netlify.com/.netlify/functions/' + source, {
      // return fetch('/.netlify/functions/' + source, {
      headers: { accept: "Accept: application/json" },
      method: 'POST',
    }).then(response => {
      return response.json()
    })
  };

  componentDidMount() {
    let dataSources = ['EconomicData', 'LIWCData', 'TopicData'];
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
        <h1>Reporting Trends in the New York Times</h1>
        <h4>Brian Midei, Marko Mandic</h4>
        <h6>Columbia University - ELEN6885 Fall 2019</h6>
        <hr />
        <h3>Motivation</h3>
        <p>Journalism, and the associated bias and trends, has come under increased scrutiny in recent years.
          However, much of this scrutiny is subjective in nature. Our goal is to quantitatively analyze reporting trends
          over the 20th and 21st centuries and answer key questions with regard to trends in reporting over time.
          How do linguistic features change over time and do they correlate with one another? Do linguistic features
          correlate with economic conditions? How responsive is reporting to major geopolitical events? In addition,
          our website can be used by researchers or other interested parties to perform their own analyses using our
          interactive webpage.<br /><br />
          To accomplish this, we analyzed metadata from over 12 million New York Times to
          extract trends in keyword occurrences, sentiment analysis, and other linguistic features. We also compared
          these results to major US economic indicators to determine whether news reporting was significantly affected
          by macroeconomics or geopolitical events.</p>
        <hr />
        <h3>Clustering of Annual Economic Data</h3>
        <p>We compiled economic features (Inflation, GDP percent change, Employment, and Unemployment) from our
          economic data set on a yearly basis ranging from 1940 to 2010. We performed K-means clustering to determine
          which years are similar in terms of the economic indicators. Using t-SNE dimensionality reduction on the data,
          we can visualize the years and cluster labels. <br /> <br />
          By inspecting the economic performance of the years that make up each cluster, we can identify that different
          clusters represent varying levels of economic performance.</p>
        {EconomicData && <EconomicDataTSNE data={EconomicData} height={400} width={600}/>}
        <hr />
        <h3>Comparing LIWC Features</h3>
        <p>Linguistic Inquiry and Word Count (LIWC) is a popular linguistic tool that extracts a standardized set of
          linguistic features from text. We ran LIWC2015 on all the available article titles and compile the results
          on a yearly basis. The plot below shows the relationship between selected LIWC features and their correlation
          coefficient over the period for which data is available.</p>
        {LIWCData && <LoadableLIWCLineChart height={500} width={600} data={LIWCData}/>}
        <hr />
        <h3>Comparing LIWC and Economic Features</h3>
        <p>The graph below shows the relationship between the selected economic and LIWC features.</p>
        {LIWCData && EconomicData &&
          <LoadableLIWCEconomicLineChart height={500} width={600} economicData={EconomicData} LIWCData={LIWCData}/>}
        <hr />
        <h3>Trends in Economic and Political Reporting</h3>
        <p>We analyzed the set of keywords provided by the NYT and selected those which relate to economic and
          political topics. We calculated the percentage of articles with those keywords on a yearly basis.
          The plot below illustrates the percentage of political and economic topics was positively correlated
          until the late 80’s and as well as a huge spike in the percentage of political articles after 2012.</p>
        {TopicData && <TopicLineChart height={500} width={600} data={TopicData}/>}
        <hr />
        <h3>Effects of Geopolitical Events on Reporting</h3>
        <p>The graph below displays the value of the selected LIWC feature over time overlayed with significant
          world events. In certain features, such as anger, we observe immediate changes following world events
          implying a potential causality. </p>
        {LIWCData && <WorldEventsLineChart height={500} width={600} data={LIWCData} worldEvents={this.state.worldEvents}/>}

        {/*<Link to="/page-2/">Go to page 2</Link>*/}
      </Layout>
    )
  }
}

export default IndexPage;
