import React, {Component, Fragment} from 'react';
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import spearson from '../static/spearson.js';
import Plot from 'react-plotly.js';
import '../static/main.css';


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
  };

  handleChange2 = feature2 => {
    this.setState({ feature2: feature2.value});
  };

  formatRenderedData = () => {
    // let LIWCFeatures = Object.keys(this.props.data[0]).splice(1);
    let selectedFeatures = [this.state.feature1, this.state.feature2];
    return selectedFeatures.map((feature, i) => {
      let featureDataX = this.props.data.map(elem => {
        return Number.parseInt(elem['year'])
      });
      let featureDataY = this.props.data.map(elem => {
        return Number.parseFloat(elem[feature])
      });
      let axis = 'y' + String(i+1);
      return {
        x: featureDataX,
        y: featureDataY,
        name: feature,
        yaxis: axis,
        type: 'scatter'
      };
    });
  };

  render() {
    const renderedData = this.formatRenderedData();

    let corrData = renderedData.map((featureData) =>{
      return featureData['y'];
    });
    let x = corrData[0].map(Number);
    let y = corrData[1].map(Number);
    let correlation = spearson.correlation.pearson(x, y, true).toFixed(2);

    return (
      <Fragment>
        <div className='chartOptions'>
          <div className='dropdownContainer'>
            <span>LIWC Feature 1</span>
            <Dropdown
              className='dropdown'
              options={this.state.LIWCFeatures}
              onChange={this.handleChange1}
              value={this.state.feature1}
              placeholder="Select an option"
            />
          </div>
          <div className='featureCorrelation'>
            <span>Correlation:</span>
            <h5>{correlation}</h5>
          </div>
          <div className='dropdownContainer'>
            <span>LIWC Feature 2</span>
            <Dropdown
              className='dropdown'
              options={this.state.LIWCFeatures}
              onChange={this.handleChange2}
              value={this.state.feature2}
              placeholder="Select an option"
            />
          </div>
        </div>
        <div className='chart' style={{ height: this.props.height}}>
          <Plot
            data={renderedData}
            layout={{
              yaxis: {title: 'LIWC: ' + this.state.feature1},
              yaxis2: {
                title: 'LIWC: ' + this.state.feature2,
                overlaying: 'y',
                side: 'right'}
            }}
          />
        </div>
      </Fragment>
    )
  }
}
export default LIWCLineChart;
