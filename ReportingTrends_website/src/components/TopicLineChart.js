import React, {Component} from 'react';
import {ResponsiveLine} from "@nivo/line";


class TopicLineChart extends Component {
  // Initialize with no data
  state = {
    allTopics: [],
    renderedTopics: [],
  };

  formatRenderedData = () => {
    // Get all unique topics in the dataset
    let allTopics = [...new Set(this.props.data.map(({topic}) => (topic)))];
    return allTopics.map((topic) => {
      let topicData = this.props.data.filter(elem => elem['topic'] === topic)
        .map(elem => {
          return {
            'x': elem['year'],
            'y': Number.parseFloat(elem['count'] / elem['total'] * 100).toFixed(2)

          }
        });
      return {id: topic, data: topicData};
    })
  };

  render() {
    const renderedData = this.formatRenderedData();
    return (
      <div className='chart' style={{ height: this.props.height }}>
        <ResponsiveLine
          data={ renderedData }
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'linear', min: 'auto', max: 'auto' }}
          yScale={{ type: 'linear', stacked: false, min: 'auto', max: 'auto' }}
          axisTop={null}
          axisRight={null}
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
            legend: 'Percentage of Articles',
            legendOffset: -40,
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
          enableSlices="x"
          // tooltip={(elem) => (
          //   <strong>
          //     {elem['point']['data']['x']}: {elem['point']['data']['y']} %
          //     {/*{[Object.keys(elem['point']['data'])].join(',')}*/}
          //   </strong>
          // )}
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemBackground: 'rgba(0, 0, 0, .03)',
                    itemOpacity: 1
                  }
                }
              ]
          }
          ]}
        />
        </div>
      )
    }
  }
export default TopicLineChart;