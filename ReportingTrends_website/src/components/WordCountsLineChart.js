import React, {Component} from 'react';
import * as d3 from 'd3'


class WordCountsLineChart extends Component {
  // Declare a new state variable, which we'll call "count"
  // const [count, setCount] = useState(0);
  // set the dimensions and margins of the graph
  constructor(props) {
    super(props)
    this.createChart = this.createChart.bind(this)
  };

  queryData() {
    // return fetch('/.netlify/functions/test', {
    return fetch('https://eloquent-blackwell-3fb9dd.netlify.com/.netlify/functions/test', {
      headers: { accept: "Accept: application/json" },
      method: 'POST',
      body: ''
    }).then(response => {
      return response
    })
  }

  componentDidMount() {
    // console.log('fetching data')
    // this.queryData().then((response) => {
    //   console.log(typeof(response))
    //   console.log('API response', response)
    //   // set app state
    // }).catch((error) => {
    //   console.log('API error', error)
    // });
    this.createChart()
  };
  componentDidUpdate() {
    this.createChart()
  };

  createChart() {
    var margin = {top: 10, right: 50, bottom: 40, left: 60},
      width = 600 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    const node = this.node

    var line_svg = d3.select(node)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // var div = d3.select("body").append("div")
    //   .attr("class", "tooltip")
    //   .style("opacity", 0);

    var line_data = [{
      'year': 1941,
      'change-current': 28.3,
      'change-chained': 18.9,
      'Inflation': 0.7925,
      'employed_percent': 50.4,
      'unemployed_percent': 9.9
    },
      {
        'year': 1942,
        'change-current': 22.4,
        'change-chained': 17.0,
        'Inflation': 0.7250000000000001,
        'employed_percent': 54.5,
        'unemployed_percent': 4.7
      },
      {
        'year': 1943,
        'change-current': 10.5,
        'change-chained': 8.0,
        'Inflation': 0.2458333333333333,
        'employed_percent': 57.6,
        'unemployed_percent': 1.9
      },
      {
        'year': 1966,
        'change-current': 5.7,
        'change-chained': 2.7,
        'Inflation': 0.2841666666666667,
        'employed_percent': 56.9,
        'unemployed_percent': 3.8
      },
      {
        'year': 1967,
        'change-current': 9.4,
        'change-chained': 4.9,
        'Inflation': 0.25,
        'employed_percent': 57.3,
        'unemployed_percent': 9.6
      }]

    var x = d3.scaleLinear()
      .domain([1941, 2010])
      .range([0, width]);
    line_svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([d3.min(line_data, function (d) {
        return d.Inflation;
      }), d3.max(line_data, function (d) {
        return d.Inflation;
      })])
      .range([height, 0]);
    line_svg.append("g")
      .call(d3.axisLeft(y));

    var y2 = d3.scaleLinear()
      .domain([d3.min(line_data, function (d) {
        return d.unemployed_percent;
      }), d3.max(line_data, function (d) {
        return d.unemployed_percent;
      })])
      .range([height, 0]);
    line_svg.append("g")
      .attr("transform", "translate( " + width + ", 0 )")
      .call(d3.axisRight(y2));

    // Add the line
    line_svg.append("path")
      .datum(line_data)
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
      .datum(line_data)
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
export default WordCountsLineChart;