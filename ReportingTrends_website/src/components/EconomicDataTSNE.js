import React, {Component} from 'react';
import * as d3 from 'd3'


class EconomicDataTSNE extends Component {
  // Initialize with no data
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
    let data = this.state.data;
    let left = d3.min(data, function (d) { return d.x });
    let right = d3.max(data, function (d) { return d.x });
    let bottom = d3.min(data, function (d) { return d.y });
    let top = d3.max(data, function (d) { return d.y });
    let buffer = 1;
    const node = this.node;
    // set the dimensions and margins of the graph
    let margin = {top: 10, right: 50, bottom: 40, left: 60},
      width = this.props.width - margin.left - margin.right,
      height = this.props.height - margin.top - margin.bottom;

    let svg = d3.select(node)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    let cValue = function(d) { return d.cluster;},
      color = d3.scaleOrdinal(d3.schemeCategory10);

    // Add X axis
    let x = d3.scaleLinear()
      .domain([left-buffer, right+buffer])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .append("text")
      .text("Protein (g)");

    // Add Y axis
    let y = d3.scaleLinear()
      .domain([bottom-buffer, top+buffer])
      .range([ height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));

    let div = d3.select('body').append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("text-align", "center")
      .style("width", "120px")
      .style("height", "58px")
      .style("padding", "2px")
      .style("font", "12px sans-serif")
      .style("background",  "lightsteelblue")
      .style("border", "0px")
      .style("border-radius", "8px")
      .style("pointer-events", "none");

    // Add dot")
    svg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) { return x(d.x); } )
      .attr("cy", function (d) { return y(d.y); } )
      .attr("r", 5.5)
      .style("fill", function(d) { return color(cValue(d));})
      .on("mouseover", function(d) {
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html("Year: " + d.year + "<br/>Inflation: " + d.Inflation.toFixed(2) + "<br/>Employed: " + d.employed_percent + "%<br/>Unemployed: " + d.unemployed_percent+ "%")
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
        div.transition()
          .duration(200)
          .style("opacity", 0);
      });

    svg.append("text")
      .attr("transform",
        "translate(" + (width/2) + " ," +
        (height + margin.top + 25) + ")")
      .style("text-anchor", "middle")
      .text("TSNE Dimension 1");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("TSNE Dimension 2");

    svg.append('g')
      .selectAll("text")
      .data(data)
      .enter()
      .append('text')
      .style("font", "10px sans-serif")
      .attr("x", function (d) { return x(d.x); } )
      .attr("y", function (d) { return y(d.y); } )
      .text(function(d){return d.year})
    }


  render() {
    return (
      <svg ref={node => this.node = node}
           width={this.props.width} height={this.props.height}>
      </svg>
    );
  }
}
export default EconomicDataTSNE;