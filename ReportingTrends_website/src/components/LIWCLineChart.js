import React, {Component} from 'react';
import * as d3 from 'd3'


class LIWCLineChart extends Component {
  // Declare a new state variable, which we'll call "count"
  // const [count, setCount] = useState(0);
  // set the dimensions and margins of the graph
  state = {
    data: []
  };

  queryData() {
    // Toggle these two lines between local dev and deployment
    // return fetch('https://eloquent-blackwell-3fb9dd.netlify.com/.netlify/functions/EconomicData', {
    return fetch('/.netlify/functions/EconomicData', {
      headers: { accept: "Accept: application/json" },
      method: 'POST',
    }).then(response => {
      return response.json()
    })
  }

  componentDidMount() {
    console.log('fetching data');
    this.queryData().then((response) => {
      // Store queried data in state
      this.setState({data: response});
    }).catch((error) => {
      console.log('API error', error)
    });
    this.createChart()
  };

  componentDidUpdate() {
    this.createChart()
  };

  createChart() {
    // Sort data by year
    let data = this.state.data;
    data.sort((a, b) => (a.year > b.year) ? -1 : 1);

    let margin = {top: 10, right: 50, bottom: 40, left: 60},
      width = this.props.width - margin.left - margin.right,
      height = this.props.height - margin.top - margin.bottom;

    const node = this.node;

    let line_svg = d3.select(node)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // let div = d3.select("body").append("div")
    //   .attr("class", "tooltip")
    //   .style("opacity", 0);

    let x = d3.scaleLinear()
      .domain([1941, 2010])
      .range([0, width]);
    line_svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    // Add Y axis
    let y = d3.scaleLinear()
      .domain([d3.min(data, function (d) {
        return d.Inflation;
      }), d3.max(data, function (d) {
        return d.Inflation;
      })])
      .range([height, 0]);
    line_svg.append("g")
      .call(d3.axisLeft(y));

    let y2 = d3.scaleLinear()
      .domain([d3.min(data, function (d) {
        return d.unemployed_percent;
      }), d3.max(data, function (d) {
        return d.unemployed_percent;
      })])
      .range([height, 0]);
    line_svg.append("g")
      .attr("transform", "translate( " + width + ", 0 )")
      .call(d3.axisRight(y2));

    // Add the line
    line_svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "darkOrange")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function (d) {
          return x(d.year)
        })
        .y(function (d) {
          return y(d.Inflation)
        })
      )

    // Add the line
    line_svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function (d) {
          return x(d.year)
        })
        .y(function (d) {
          return y2(d.unemployed_percent)
        })
      )

    line_svg.append("text")
      .attr("transform",
        "translate(" + (width / 2) + " ," +
        (height + margin.top + 25) + ")")
      .style("text-anchor", "middle")
      .text("Year");

    line_svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style('fill', 'darkOrange')
      .text("Inflation");

    line_svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 20 + width)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style('fill', 'steelblue')
      .text("Unemployed percent");
  }

  render() {
    return (
      <svg ref={node => this.node = node}
           width={1000} height={500}>
      </svg>
    );
  }
}
export default LIWCLineChart;
