import React from 'react'
import { Loader, Dimmer } from 'semantic-ui-react'
import { Line } from 'react-chartjs-2';
import axios from "../axiosConfig";

class LineChart extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      labels: [],
      dayData: {},
      minuteData: {},
    }
  }

  componentDidMount() {
    this.loadStockData()
  }

  componentDidUpdate(prevProps) {
    if (this.props.stocks !== prevProps.stocks) {
      this.loadStockData()
    }
  }

  // setLabels() {
  //   switch(this.props.increment.unit) {
  //     case "minute":
  //       // code block
  //       break;
  //     case "hour":
  //       // code block
  //       break;
  //     case "day":
  //       // code block
  //       break;
  //     case "week":
  //       // code block
  //       break;
  //     case "month":
  //       // code block
  //       break;
  //     case "year":
  //       // code block
  //       break;
  //   }
  // }

  loadStockData() {
    var requests = []
    for (let stock of this.props.stocks) {
      requests.splice(requests.length, 0,
        axios.get("api/get-stock-day-bar/" + stock.symbol + "/")
      )
    }
    for (let stock of this.props.stocks) {
      requests.splice(requests.length, 0,
        axios.get("api/get-stock-minute-bar/" + stock.symbol + "/")
      )
    }
    Promise.all(requests).then((res) => {
      var dayData = {}, minuteData = {}
      var numStocks = this.props.stocks.length
      for (let i = 0; i < numStocks; i++) {
        dayData[this.props.stocks[i].symbol] = res[i].data.dayBar
      }
      for (let i = 0; i < numStocks; i++) {
        minuteData[this.props.stocks[i].symbol] = res[i+numStocks].data.minuteBar
      }
      this.setState({dayData: dayData, minuteData: minuteData})
      this.setState({loading: false})
    })
    this.setState({loading: true})
  }

  render() {
    if (this.state.loading) {
      return (
        <div style = {{ height: `${window.innerHeight - 80}px` }}>
          <Dimmer style = {{backgroundColor: '#00000000'}} active>
            <Loader />
          </Dimmer>
        </div>
      )
    }
    console.log(this.state)
    return (
      <div style = {{ height: `${window.innerHeight - 80}px` }}>
        <Line
          data = {{
            labels: this.state.dayData[this.props.stocks[0].symbol].map((dayData) => {
              return dayData.date
            }),
            datasets: this.props.stocks.map((stock, index) => {
              return (
                {
                  label: stock.symbol,
                  borderColor: stock.color,
                  backgroundColor: '#00000000',
                  borderWidth: 2,
                  data: this.state.dayData[stock.symbol].map((dayData) => {
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
                  max: 1000,
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
