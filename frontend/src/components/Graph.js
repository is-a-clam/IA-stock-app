import React from 'react'
import { Line } from 'react-chartjs-2';
import axios from "../axiosConfig";

class LineChart extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      data: {},
    }
  }

  componentDidMount() {
    var requests = []
    for (let stock of this.props.stocks) {
      requests.splice(requests.length, 0,
        axios.get("api/get-stock-day-bar/" + stock.symbol + "/")
      )
    }
    Promise.all(requests).then((res) => {
      for (const [index, result] of res.entries()) {
        this.setState({data: {[this.props.stocks[index].symbol]: result.data.dayBar}})
      }
      this.setState({loading: false})
    })
  }

  render() {
    if (this.state.loading) {
      return (
        <div style = {{ height: `${window.innerHeight - 80}px` }}>
          Loading
        </div>
      )
    }
    return (
      <div style = {{ height: `${window.innerHeight - 80}px` }}>
        <Line
          data = {{
            labels: this.state.data[this.props.stocks[0].symbol].map((dayData) => {
              return dayData.date
            }),
            datasets: this.props.stocks.map((stock, index) => {
              return (
                {
                  borderColor: stock.color,
                  backgroundColor: '#00000000',
                  borderWidth: 2,
                  data: this.state.data[stock.symbol].map((dayData) => {
                    return dayData.price
                  })
                }
              )
            })
          }}
          options = {{
            maintainAspectRatio: false,
            legend: { display: false },
            scales: {
              yAxes: [{
                ticks: {
                  min: 0,
                  max: 160,
                  stepSize: 50,
                  callback: (val, index) => {
                    return val % 50 === 0 ? val : '';
                  },
                },
                gridLines: { color: "#707070" }
              }],
              xAxes: [{
                type: 'time',
                time: { unit: 'day' },
                gridLines: { color: "#707070" }
              }]
            },
            chartArea: { backgroundColor: '#2B2D30' }
          }}
        />
      </div>
    )
  }
}

export default LineChart
