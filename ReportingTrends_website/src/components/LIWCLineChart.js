import React, {Component, Fragment} from 'react';
import { ResponsiveLine } from '@nivo/line'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import spearson from '../static/spearson.js';


class LIWCLineChart extends Component {
  // Declare a new state variable, which we'll call "count"
  // const [count, setCount] = useState(0);
  // set the dimensions and margins of the graph
  state = {
    feature1: 'Positive_emotion',
    feature2: 'Negative_emotion',
    LIWCFeatures: ['Positive_emotion', 'Negative_emotion',
                   'Analytical_Thinking', 'Clout', 'Authentic',
                   'Emotional_Tone', 'Anxiety', 'Anger', 'Sadness'],
  };

  handleChange1 = feature1 => {
    this.setState({ feature1: feature1.value});
    console.log(`Option selected:`, feature1);
  };

  handleChange2 = feature2 => {
    this.setState({ feature2: feature2.value});
    console.log(`Option selected:`, feature2);
  };

  formatRenderedData = () => {
    // let LIWCFeatures = Object.keys(this.props.data[0]).splice(1);
    let selectedFeatures = [this.state.feature1, this.state.feature2];
    return selectedFeatures.map((feature) => {
      let featureData = this.props.data
        .map(elem => {
          return {
            'x': elem['year'],
            'y': Number.parseFloat(elem[feature]).toFixed(2)
          }
        });
      return {id: feature, data: featureData};
    })
  };

  render() {
    const renderedData = this.formatRenderedData();

    let corrData = renderedData.map((feature) =>{
      let featureData = feature['data'];
      return featureData.map((elem) => elem['y'] )
    });
    let x = corrData[0].map(Number);
    let y = corrData[1].map(Number);
    let correlation = spearson.correlation.pearson(x, y, true);

    return (
      <Fragment>
        <Dropdown options={this.state.LIWCFeatures}
                  onChange={this.handleChange1}
                  value={this.state.feature1}
                  placeholder="Select an option"
        />
        <p>Feature 1</p>
        <Dropdown options={this.state.LIWCFeatures}
                  onChange={this.handleChange2}
                  value={this.state.feature2}
                  placeholder="Select an option"
        />
        <p>Feature 2</p>
        <h5>{correlation}</h5>
        <div style={{ height: this.props.height}}>
          <ResponsiveLine
            data={renderedData}
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
            enableSlices={'x'}
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
      </Fragment>
    )
  }
}
export default LIWCLineChart;
