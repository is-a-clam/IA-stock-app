import React from 'react'
import Chart from "chart.js";
import 'chartjs-adapter-luxon';

class LineChart extends React.Component {
  chartRef = React.createRef();

  componentDidMount() {

    Chart.pluginService.register({
			beforeDraw: function (chart, easing) {
				if (chart.config.options.chartArea && chart.config.options.chartArea.backgroundColor) {
					var helpers = Chart.helpers;
					var ctx = chart.chart.ctx;
					var chartArea = chart.chartArea;

					ctx.save();
					ctx.fillStyle = chart.config.options.chartArea.backgroundColor;
					ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
					ctx.restore();
				}
			}
		});

    var myChartRef = this.chartRef.current.getContext("2d");

    new Chart(myChartRef, {
      type: 'line',
      data: {
        labels: ['2020-07-20', '2020-07-21', '2020-07-22', '2020-07-23', '2020-07-24'],
        datasets: [
          {
            borderColor: '#4283ca',
            borderWidth: 2,
            data: [65, 59, 80, 81, 56]
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        legend: {
          display: false
        },
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
            gridLines: {
              color: "#707070"
            }
          }],
          xAxes: [{
            type: 'time',
            time: {
              unit: 'day'
            },
            gridLines: {
              color: "#707070"
            }
          }]
        },
        chartArea: {
					backgroundColor: '#2B2D30'
				}
      }
    })
  }

  render() {
    return (
      <div
        className = 'stockGraph'
        style = {{
          height: `${window.innerHeight - 80}px`
        }}
      >
        <canvas
          id="stockChart"
          ref={this.chartRef}
        />
      </div>
    )
  }
}

export default LineChart
