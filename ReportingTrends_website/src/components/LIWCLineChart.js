import React, {Component} from 'react';
import { ResponsiveLine } from '@nivo/line'
import Dropdown from 'react-dropdown'

class LIWCLineChart extends Component {
  // Declare a new state variable, which we'll call "count"
  // const [count, setCount] = useState(0);
  // set the dimensions and margins of the graph
  state = {
    LIWCData: [],
    economicData: [],
    selectedLIWCFeature: 'Positive_emotion',
    selectedEconFeature: 'Inflation',
    LIWCFeatures: ['Positive_emotion'],
    econFeatures: ['change_current', 'change_chained', 'Inflation'],
  };

  queryData(source) {
    // Toggle these two lines between local dev and deployment
    return fetch('https://eloquent-blackwell-3fb9dd.netlify.com/.netlify/functions/' + source, {
      // return fetch('/.netlify/functions/' + source, {
      headers: {accept: "Accept: application/json"},
      method: 'POST',
    }).then(response => {
      return response.json()
    })
  }

  componentDidMount() {
    console.log('fetching LIWC data');
    this.queryData('LIWCData').then((response) => {
      // Store queried data in state
      response.sort((a, b) => (a.year < b.year) ? -1 : 1);
      let LIWCFeatures = Object.keys(response[0]).splice(1).map(function (elem) {
        return {
          'label': elem,
          'value': elem
        }});
      this.setState({LIWCData: response,
                           LIWCFeatures: LIWCFeatures})
    }).catch((error) => {
      console.log('API error', error)
    });

    console.log('fetching Economic data');
    this.queryData('EconomicData').then((response) => {
      // Store queried data in state
      response.sort((a, b) => (a.year < b.year) ? -1 : 1);
      this.setState({economicData: response})
    }).catch((error) => {
      console.log('API error', error)
    });
  }

  handleChange = selectedLIWCFeature => {
    this.setState({ selectedLIWCFeature: selectedLIWCFeature.value});
    console.log(`Option selected:`, selectedLIWCFeature);
  };

  render() {
    const { selectedLIWCFeature } = this.state;
    const { selectedEconFeature } = this.state;
    const { LIWCFeatures } = this.state;

    let LIWCArr = this.state.LIWCData.map(function (elem) {
      return {
        'x': elem['year'],
        'y': elem[selectedLIWCFeature]
      }
    });
    let LIWCFeatureData = {
      id: selectedLIWCFeature,
      data: LIWCArr
    };

    let economicArr = this.state.economicData.map(function (elem) {
      return {
        'x': elem['year'],
        'y': elem[selectedEconFeature]
      }
    });
    let economicFeatureData = {
      id: selectedEconFeature,
      data: economicArr
    };
    let chartData = [LIWCFeatureData, economicFeatureData];

    return (
    <div style={{ height: 500 }}>
      <Dropdown options={LIWCFeatures}
                onChange={this.handleChange}
                value={this.state.selectedLIWCFeature}
                placeholder="Select an option"
                styles={{border: '2px solid red'}}
                maxMenuHeight = {'100px'}
                autoFocus={true}
                menuColor='red'/>
      <ResponsiveLine
        data={chartData}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'linear', min: 'auto', max: 'auto' }}
        yScale={{ type: 'linear', stacked: false, min: 'auto', max: 'auto' }}
        axisTop={null}
        axisBottom={{
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Date',
          legendOffset: 36,
          legendPosition: 'middle'
        }}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Emotion',
          legendOffset: -40,
          legendPosition: 'middle'
        }}
        axisRight={{
          orient: 'right',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'asdf',
          legendOffset: 40,
          legendPosition: 'middle'
        }}
        colors={{ scheme: 'nivo' }}
        // pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        // pointLabel=y
        pointLabelYOffset={-12}
        useMesh={true}
        />
      </div>
    )
  }
}
export default LIWCLineChart;
