import React, { Component } from "react"
import { v4 as uuidv4 } from 'uuid';
import GraphTab from './GraphTab'
import HomeTab from './HomeTab'
import TimeRange from './TimeRange'
import { Grid, Tab, Menu, Icon } from 'semantic-ui-react'

class TabSystem extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      graphTabs: [
        {
          id: '3266c5d6-f917-4372-8461-89ac2e53a5bf',
          label: 'graph1',
          range: TimeRange.ONE_DAY.short,
          increment: TimeRange.ONE_MIN.short,
          stocks: ['AAPL', 'AMZN'],
        },
        {
          id: 'cc452470-d25d-424c-9601-7acaa65f3003',
          label: 'graph2',
          range: TimeRange.ONE_DAY.short,
          increment: TimeRange.ONE_MIN.short,
          stocks: ['GOOGL'],
        },
      ],
    }
  }

  onClickCloseTab(id) {
    let graphTabs = this.state.graphTabs.slice();
    let filtered = graphTabs.filter(tab => tab.id !== id)
    this.setState({
      graphTabs: filtered
    })
  }

  onChangeTabRange(id, timeRange) {
    let graphTabs = this.state.graphTabs.slice();
    let newGraphTabs = graphTabs.map((tab) => {
      if (tab.id === id) {
        tab.range = timeRange
        return tab
      }
      else {
        return tab
      }
    })
    this.setState({
      graphTabs: newGraphTabs
    })
  }

  onChangeTabIncrement(id, timeRange) {
    let graphTabs = this.state.graphTabs.slice();
    let newGraphTabs = graphTabs.map((tab) => {
      if (tab.id === id) {
        tab.increment = timeRange
        return tab
      }
      else {
        return tab
      }
    })
    this.setState({
      graphTabs: newGraphTabs
    })
  }

  render() {
    return (
      <div className="tabs">
        <Tab
          menu = {{inverted: true, attached: true}}
          panes =
          {this.state.graphTabs.map((tab) => {
            return {
              menuItem: (
                <Menu.Item>
                  <Grid textAlign='center'>
                    <Grid.Row columns = {2}>
                      <Grid.Column width = {10}>
                        {tab.label}
                      </Grid.Column>
                      <Grid.Column width = {5}>
                        <Icon
                          link name = 'close'
                          size = 'small'
                          onClick = {() => this.onClickCloseTab(tab.id)}
                        />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Menu.Item>
              ),
              render: () =>
              <GraphTab
                range = {tab.range}
                rangeOnChange = {(timeRange) => this.onChangeTabRange(tab.id, timeRange)}
                increment = {tab.increment}
                incrementOnChange = {(timeRange) => this.onChangeTabIncrement(tab.id, timeRange)}
                stocks = {tab.stocks}
              />
            }
          })}
        />
      </div>
    )
  }
}

export default TabSystem
