import React, {Component} from 'react';
import { ResponsiveLine } from '@nivo/line'


class LIWCLineChart extends Component {
  // Declare a new state variable, which we'll call "count"
  // const [count, setCount] = useState(0);
  // set the dimensions and margins of the graph
  state = {
    data: [],
    chartData: []
  };

  queryData() {
    // Toggle these two lines between local dev and deployment
    // return fetch('https://eloquent-blackwell-3fb9dd.netlify.com/.netlify/functions/LIWCData', {
      return fetch('/.netlify/functions/LIWCData', {
      headers: {accept: "Accept: application/json"},
      method: 'POST',
    }).then(response => {
      return response.json()
    })
  }

  componentDidMount() {
    console.log('fetching data');
    this.queryData().then((response) => {
      // Store queried data in state
      this.formatData(response)
    }).catch((error) => {
      console.log('API error', error)
    });

  };

  formatData(data) {
    // Sort data by year
    data.sort((a, b) => (a.year < b.year) ? -1 : 1);
    let posemoArr = data.map(function (elem) {
      return {
        'x': elem['year'],
        'y': elem['posemo']
      }
    });
    let posemoData = {
      id: 'Positive Emotion',
      data: posemoArr
    };
    let negemoArr = data.map(function (elem) {
      return {
        'x': elem['year'],
        'y': elem['negemo']
      }
    });
    let negemoData = {
      id: 'Negative Emotion',
      data: negemoArr
    };
    this.setState({chartData: [posemoData, negemoData]});
  }

  render() {
    return (
    <div style={{ height: 500 }}>
      <ResponsiveLine
      data={this.state.chartData}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: 'linear', min: 'auto', max: 'auto' }}
      yScale={{ type: 'linear', stacked: true, min: 'auto', max: 'auto' }}
      axisTop={null}
      axisRight={null}
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
      colors={{ scheme: 'nivo' }}
      pointSize={10}
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
