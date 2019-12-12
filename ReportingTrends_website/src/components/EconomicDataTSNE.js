import React, {Component, Fragment} from 'react';
import { ResponsiveScatterPlot } from '@nivo/scatterplot'

const customNode = ({ node, x, y, size, color, blendMode, onMouseEnter, onMouseMove, onMouseLeave, onClick }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text fontSize={12}>{node['data']['year']}</text>
      <circle
        r={size / 2}
        fill={color}
        style={{ mixBlendMode: blendMode }}
        onMouseEnter={onMouseEnter}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      />
    </g>
  );
};

const customTooltip = ({ node }) => {
  return (
    <div
      style={{
        color: node.style.color,
        background: 'gray',
        padding: '12px 16px',
        border: '3px solid' + node.style.color
      }}
    >
      <strong>
        {node.data.year}
      </strong>
      <br/>
      {`Inflation: ${node.data['Inflation'].toFixed(2)} %`}
      <br/>
      {`Unemployment: ${node.data['unemployed_percent'].toFixed(2)} %`}
      <br/>
      {`GDP Change: ${node.data['change_current'].toFixed(2)} %`}
    </div>
  )
};


class EconomicDataTSNE extends Component {
  // Initialize with no data

  formatRenderedData = () => {
    let clusters = [...new Set(this.props.data.map(({cluster}) => (cluster)))].sort();
    return clusters.map((cluster) => {
      let clusterData = this.props.data
        .filter(elem => elem['cluster'] === cluster)
        .map(elem => {
          elem['id'] = String(elem['year']);
          return elem
        });
      return {id: String(cluster), data: clusterData}
    });
  };

  render() {
    let renderedData = this.formatRenderedData();

    return (
      <Fragment>
        <div style={{ height: this.props.height }}>
          <ResponsiveScatterPlot
            data={renderedData}
            margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
            xScale={{ type: 'linear', min: 'auto', max: 'auto' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
            blendMode="multiply"
            useMesh={false}
            enableGridX={false}
            enableGridY={false}
            gridXValues={null}
            gridYValues={null}
            axisTop={null}
            axisRight={null}
            renderNode={customNode}
            tooltip={customTooltip}
            axisBottom={{
              orient: 'bottom',
              tickSize: 0,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'TSNE Dimension 1',
              legendPosition: 'middle',
              legendOffset: 46,
              'format': () => null
            }}
            axisLeft={{
              orient: 'left',
              tickSize: 0,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'TSNE Dimension 2',
              legendPosition: 'middle',
              legendOffset: -60,
              'format': () => null
            }}
            legends={[ {
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
                effects: [{ on: 'hover', style: { itemOpacity: 1 } }]
              } ]}
          />
        </div>
      </Fragment>
    );
  }
}
export default EconomicDataTSNE;