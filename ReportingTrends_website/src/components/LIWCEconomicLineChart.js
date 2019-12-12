import React, {Component, Fragment} from 'react';
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import spearson from '../static/spearson.js';
import Plot from 'react-plotly.js'

class LIWCEconomicLineChart extends Component {
  // Declare a new state variable, which we'll call "count"
  // const [count, setCount] = useState(0);
  // set the dimensions and margins of the graph
  state = {
    LIWCFeature: 'Positive_emotion',
    economicFeature: 'Inflation',
    LIWCFeatures: ['Positive_emotion', 'Negative_emotion',
                   'Analytical_Thinking', 'Clout', 'Authentic',
                   'Emotional_Tone', 'Anxiety', 'Anger', 'Sadness'],
    economicFeatures: ['change_current', 'change_chained', 'Inflation',
                       'employed_percent', 'unemployed_percent'],
  };

  handleChangeLIWC = feature => {
    this.setState({ LIWCFeature: feature.value});
  };

  handleChangeEcon = feature => {
    this.setState({ economicFeature: feature.value});
  };

  formatLIWCData = (LIWCData) => {
    let LIWCFeatureDataX = LIWCData.map(elem => {
      return Number.parseInt(elem['year'])
    });
    let LIWCFeatureDataY = LIWCData.map(elem => {
      return Number.parseFloat(elem[this.state.LIWCFeature])
    });
    return {
      x: LIWCFeatureDataX,
      y: LIWCFeatureDataY,
      name: this.state.LIWCFeature,
      yaxis: 'y1',
      type: 'scatter'
    }
  };

  formatEconomicData = (economicData) => {
    let econFeatureDataX = economicData.map(elem => {
      return Number.parseInt(elem['year'])
    });
    let econFeatureDataY = economicData.map(elem => {
      return Number.parseFloat(elem[this.state.economicFeature])
    });
    return {
      x: econFeatureDataX,
      y: econFeatureDataY,
      name: this.state.economicFeature,
      yaxis: 'y2',
      type: 'scatter'
    }
  };

  formatRenderedData = () => {
    // let LIWCFeatures = Object.keys(this.props.data[0]).splice(1);
    const { LIWCData } = this.props;
    const { economicData } = this.props;
    economicData.sort((a, b) => a.year - b.year);
    let formattedLIWCData = this.formatLIWCData(LIWCData);
    let formattedEconomicData = this.formatEconomicData(economicData);

    return [formattedLIWCData, formattedEconomicData]
  };

  render() {
    const renderedData = this.formatRenderedData();

    let commonYears = renderedData[0]['x'].filter(e => renderedData[1]['x'].indexOf(e) > -1).sort();
    let x = this.props.LIWCData
      .filter(elem =>  commonYears.indexOf(elem['year']) > -1)
      .map(elem => elem[this.state.LIWCFeature])
      .map(Number);
    let y = this.props.economicData
      .filter(elem =>  commonYears.indexOf(elem['year']) > -1)
      .map(elem => elem[this.state.economicFeature])
      .map(Number);
    let correlation = spearson.correlation.pearson(x, y, true).toFixed(2);

    return (
      <Fragment>
        <Dropdown options={this.state.LIWCFeatures}
                  onChange={this.handleChangeLIWC}
                  value={this.state.LIWCFeature}
                  placeholder="Select an option"
        />
        <p>LIWC Feature</p>
        <Dropdown options={this.state.economicFeatures}
                  onChange={this.handleChangeEcon}
                  value={this.state.economicFeature}
                  placeholder="Select an option"
        />
        <p>Economic Feature</p>
        <h5>{correlation}</h5>
        <div style={{ height: this.props.height}}>
          <Plot
            data={renderedData}
            layout={{
              yaxis: {title: 'LIWC: ' + this.state.LIWCFeature},
              yaxis2: {
                title: 'Economy: ' + this.state.economicFeature,
                overlaying: 'y',
                side: 'right'}
            }}
          />
        </div>
      </Fragment>
    )
  }
}
export default LIWCEconomicLineChart;
