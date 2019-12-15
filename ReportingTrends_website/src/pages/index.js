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
    // return fetch('https://reportingtrends.netlify.com/.netlify/functions/' + source, {
      return fetch('/.netlify/functions/' + source, {
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
        <h1>Analyzing Reporting Trends in the New York Times</h1>
        <h4>Brian Midei, Marko Mandic</h4>
        <h6>Columbia University - ELEN6885 Fall 2019</h6>
        <hr />
        <h3>Motivation</h3>
        <p> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. </p>
        <hr />
        <h3>Clustering of Annual Economic Data</h3>
        <p> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. </p>
        {EconomicData && <EconomicDataTSNE data={EconomicData} height={400} width={600}/>}
        <hr />
        <h3>Comparing LIWC Features</h3>
        <p> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. </p>
        {LIWCData && <LoadableLIWCLineChart height={500} width={600} data={LIWCData}/>}
        <hr />
        <h3>Comparing LIWC and Economic Features</h3>
        <p> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. </p>
        {LIWCData && EconomicData &&
          <LoadableLIWCEconomicLineChart height={500} width={600} economicData={EconomicData} LIWCData={LIWCData}/>}
        <hr />
        <h3>Trends in Economic and Political Reporting</h3>
        <p> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. </p>
        {TopicData && <TopicLineChart height={500} width={600} data={TopicData}/>}
        <hr />
        <h3>Effects of Geopolitical Events on Reporting</h3>
        <p> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. </p>
        {LIWCData && <WorldEventsLineChart height={500} width={600} data={LIWCData} worldEvents={this.state.worldEvents}/>}

        {/*<Link to="/page-2/">Go to page 2</Link>*/}
      </Layout>
    )
  }
}

export default IndexPage;
