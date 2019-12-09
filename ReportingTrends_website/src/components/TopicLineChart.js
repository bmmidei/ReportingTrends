import React, {Component} from 'react';


class TopicLineChart extends Component {
  // Initialize with no data
  state = {
    data: []
  };

  queryData() {
    // Toggle these two lines between local dev and deployment
    // return fetch('https://eloquent-blackwell-3fb9dd.netlify.com/.netlify/functions/TopicData', {
    return fetch('/.netlify/functions/TopicData', {
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
  };

  render() {
    return (<h1>hello</h1>);
  }
}
export default TopicLineChart;