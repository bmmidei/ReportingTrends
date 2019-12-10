import React, {Component, Fragment} from 'react';
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import {ResponsiveLine} from "@nivo/line";


class EconomicDataTSNE extends Component {
  // Initialize with no data

  formatRenderedData = () => {
    let clusters = [...new Set(this.props.data.map(({cluster}) => (cluster)))].sort();
    return clusters.map((cluster) => {
      let clusterData = this.props.data.filter(elem => elem['cluster'] === cluster);
      return {id: String(cluster), data: clusterData}
    });
  };

  render() {
    let renderedData = this.formatRenderedData();
    console.log(renderedData);
    return (
      <Fragment>
        <div style={{ height: this.props.height }}>
          <ResponsiveScatterPlot
            data={renderedData}
            margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
            xScale={{ type: 'linear', min: 'auto', max: 'auto' }}
            // xFormat={function(e){return e+" kg"}}
            yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
            // yFormat={function(e){return e+" cm"}}
            blendMode="multiply"
            useMesh={false}
            enableGridX={false}
            enableGridY={false}
            gridXValues={null}
            gridYValues={null}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: 'bottom',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'TSNE Dimension 1',
              legendPosition: 'middle',
              legendOffset: 46
            }}
            axisLeft={{
              orient: 'left',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'TSNE Dimension 2',
              legendPosition: 'middle',
              legendOffset: -60
            }}
            tooltip={(elem) => {
              let data = elem['node']['data'];
              return (
                <div>
                  <span>Year: {data['year']} </span>
                  <span>Inflation: {data['Inflation'].toFixed(2)} </span>
                  <span>Unemployment: {data['unemployed_percent'].toFixed(2)} </span>
                </div>
              )}
            }
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 130,
                translateY: 0,
                itemWidth: 100,
                itemHeight: 12,
                itemsSpacing: 5,
                itemDirection: 'left-to-right',
                symbolSize: 12,
                symbolShape: 'circle',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
          />
        </div>
      </Fragment>
    );
  }
}
export default EconomicDataTSNE;