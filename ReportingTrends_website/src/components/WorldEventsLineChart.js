import React, {Component, Fragment} from 'react';
import {ResponsiveLine} from "@nivo/line";
import Dropdown from "react-dropdown";


class WorldEventsLineChart extends Component {
  // Initialize with no data
  state = {
    renderedFeature: 'Positive_emotion',
    LIWCFeatures: ['Positive_emotion', 'Negative_emotion',
      'Analytical_Thinking', 'Clout', 'Authentic',
      'Emotional_Tone', 'Anxiety', 'Anger', 'Sadness'],
    renderMarkers: true,
  };

  handleChange = feature => {
    this.setState({ renderedFeature: feature.value});
  };

  handleButtonPress = () => {
    const currentState = this.state.renderMarkers;
    this.setState({ renderMarkers: !currentState });
  };

  formatRenderedData = () => {
    // Get all unique topics in the dataset
    let feature = this.state.renderedFeature;
    let featureData = this.props.data.map(elem => {
      return ({
        x: elem['year'],
        y: elem[feature]
      })
    });
    return [{id: feature, data: featureData}];
  };

  render() {
    const renderedData = this.formatRenderedData();
    const { worldEvents } = this.props;
    let markers;
    if (!this.state.renderMarkers) {
      markers = null;
    } else {
      markers = worldEvents.map(elem => {
        return ({
          axis: 'x',
          value: elem['year'],
          lineStyle: { stroke: '#b0413e', strokeWidth: 2 },
          legend: elem['event'],
          legendOrientation: 'vertical'
        })
      });
    }

    return (
        <Fragment>
          <div className='chartOptions'>
            <div className='dropdownContainer'>
              <span>LIWC Feature</span>
              <Dropdown
                className='dropdown'
                options={this.state.LIWCFeatures}
                onChange={this.handleChange}
                value={this.state.renderedFeature}
                placeholder="Select an option"
              />
            </div>
            <div className='worldEventsBtnContainer'>
              <button
                className="btn btn-default"
                // style={buttonStyle}
                onClick={this.handleButtonPress}>Toggle World Events
              </button>
            </div>
          </div>
          <div className='chart' style={{ height: this.props.height }}>
            <ResponsiveLine
              data={ renderedData }
              margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
              xScale={{ type: 'linear', min: 'auto', max: 'auto' }}
              yScale={{ type: 'linear', stacked: false, min: 'auto', max: 'auto' }}
              axisTop={null}
              axisRight={null}
              markers={markers}
              axisBottom={{
                orient: 'bottom',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Year',
                legendOffset: 36,
                legendPosition: 'middle'
              }}
              axisLeft={{
                orient: 'left',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: this.state.renderedFeature,
                legendOffset: -40,
                legendPosition: 'middle'
              }}
              colors={{ scheme: 'nivo' }}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              pointLabelYOffset={-12}
              useMesh={true}
              enableSlices="x"
            />
          </div>
        </Fragment>

      )
    }
  }

export default WorldEventsLineChart;