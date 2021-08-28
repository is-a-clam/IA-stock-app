import React from 'react'
import { Loader, Dimmer } from 'semantic-ui-react'
import { Line } from 'react-chartjs-2'
import { DateTime, Duration } from 'luxon'
import axios from "../axiosConfig"
import TimeRange from "./TimeRange"

class LineChart extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      labels: [],
      dayData: {},
      minuteData: {},
    }
  }

  componentDidMount() {
    this.loadStockData()
    this.loadLabels()
  }

  componentDidUpdate(prevProps) {
    // If stocks Change, update stock data
    if (this.props.stocks !== prevProps.stocks) {
      this.loadStockData()
    }
    // If increment or Range change, update labels
    if (this.props.increment !== prevProps.increment) {
      this.loadLabels()
    }
    if (this.props.range !== prevProps.range) {
      this.loadLabels()
    }
  }

  previousMarketOpen(datetime) {
    var result = datetime
    result = result.set({ second: 0, millisecond: 0 })
    // If time is after 4pm
    if (datetime.hour >= 16) {
      result = result.set({ hour: 15, minute: 59})
    }
    // If time is before 9:30am
    else if ((datetime.hour === 9 && datetime.minute < 30) || (datetime.hour < 9)) {
      result = result.minus(Duration.fromObject({ days: 1 }))
      result = result.set({ hour: 15, minute: 59})
    }
    // if day is on a Sunday or Monday
    if (result.weekday > 5) {
      result = result.set({ weekday: 5, hour: 15, minute: 59 })
    }
    return result
  }

  loadStockData() {
    var requests = []
    // Request Day Bar Data
    for (let stock of this.props.stocks) {
      requests.splice(requests.length, 0,
        axios.get("api/get-stock-day-bar/" + stock.symbol + "/")
      )
    }
    // Request Minute Bar Data
    for (let stock of this.props.stocks) {
      requests.splice(requests.length, 0,
        axios.get("api/get-stock-minute-bar/" + stock.symbol + "/")
      )
    }
    // Received Data from Backend
    Promise.all(requests).then((res) => {
      var dayData = {}, minuteData = {}
      var numStocks = this.props.stocks.length
      // Store Day Bar Data
      for (let i = 0; i < numStocks; i++) {
        dayData[this.props.stocks[i].symbol] = res[i].data.dayBar
      }
      // Store Minute Bar Data
      for (let i = 0; i < numStocks; i++) {
        minuteData[this.props.stocks[i].symbol] = res[i+numStocks].data.minuteBar
      }
      this.setState({dayData: dayData, minuteData: minuteData})
    })
  }

  loadLabels() {
    var labels = []
    var increment = TimeRange.fromString(this.props.increment)
    var range = TimeRange.fromString(this.props.range)

    // Get last time the market was open
    var currTime = this.previousMarketOpen(DateTime.utc().setZone('UTC-4'))
    // Get increment in terms of Luxon Duration
    var incrementDuration = Duration.fromObject({
      [increment.unit + "s"]: increment.number
    })
    // Get start time in terms of Luxon Date based on range selected
    var goalTime = currTime.minus(Duration.fromObject({
      [range.unit + "s"]: range.number
    }))

    // Create labels by decrementing from end time to start time
    while (currTime.toMillis() >= goalTime.toMillis()) {
      // Get date with time
      if (increment.unit === "minute" || increment.unit === "hour") {
        labels.splice(0, 0, currTime.toISO({
          suppressMilliseconds: true,
          includeOffset: false
        }))
      }
      // Get date without time
      else {
        labels.splice(0, 0, currTime.toISODate())
      }
      currTime = this.previousMarketOpen(currTime.minus(incrementDuration))
    }
    // Store labels
    this.setState({labels: labels})
  }

  getDatasetsAndLabels() {
    var result = []
    var ignoredLabels = []
    var labels = this.state.labels
    var increment = TimeRange.fromString(this.props.increment)

    // Determine location of data source
    if (increment.unit === "minute" || increment.unit === "hour") {
      var stockDataName = "minuteData"
    }
    else {
      var stockDataName = "dayData"
    }

    // Loop through every stock
    for (let stockSymbol in this.state[stockDataName]) {
      // Get color of stock
      let stockColor = this.props.stocks.filter((stock) => {
        return stock.symbol === stockSymbol
      })[0]?.color
      if (stockColor) {
        // Get price from data for each label
        let stockData = this.state.labels.map((label) => {
          var price = this.state[stockDataName][stockSymbol][label]
          if (price === 0 || price == null || price == undefined) {
            ignoredLabels.splice(ignoredLabels.length, 0, label)
          }
          else {
            return price
          }
        })
        // Create a dataset and append to result
        result.splice(result.length, 0, {
          label: stockSymbol,
          borderColor: stockColor,
          backgroundColor: '#00000000',
          borderWidth: 2,
          data: stockData,
        })
      }
    }
    var newLabels = []
    labels.forEach((label) => {
      if (!ignoredLabels.includes(label)) {
        if (increment.unit === "minute" || increment.unit === "hour") {
          label = label.substring(label.indexOf('T')+1, label.length-3)
        }
        newLabels.splice(newLabels.length, 0, label)
      }
    })
    return [result, newLabels]
  }

  render() {
    const processed = this.getDatasetsAndLabels()
    const processedLabels = processed[1]
    const processedDatasets = processed[0]
    return (
      <div style = {{ height: `${window.innerHeight - 80}px` }}>
        <Line
          data = {{
            labels: processedLabels,
            datasets: processedDatasets,
          }}
          options = {{
            maintainAspectRatio: false,
            legend: { display: false },
            scales: {
              y: [{
                ticks: {
                  min: 0,
                  max: 1000,
                  stepSize: 5,
                },
                gridLines: { color: "#707070" }
              }],
              x: [{
                type: 'timeseries',
                time: { unit: 'day' },
                gridLines: { color: "#707070" },
                ticks: { source: 'labels' }
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
