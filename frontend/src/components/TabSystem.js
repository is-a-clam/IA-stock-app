import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import GraphTab from './GraphTab'
import HomeTab from './HomeTab'
import Dashboard from './Dashboard'
import TimeRange from './TimeRange'
import { Grid, Tab, Menu, Icon, Input } from 'semantic-ui-react'
import axios from '../axiosConfig'

class TabSystem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeIndex: 0,
      availableStocks: [],
      tabs: [],
      toggleNameEdit: false,
      toggleTempName: '',
      toggleNameEditID: '',
    }
  }

  componentDidMount() {
    this.refreshPage()
  }

  refreshPage() {
    axios
      .get('api/user-profile/')
      .then(res => {
        this.setState({ tabs: res.data.tabs })
      })
      .catch(err => console.log(err))
    axios
      .get('api/list-stocks')
      .then(res => {
        this.setState({ availableStocks: res.data })
      })
      .catch(err => console.log(err))
  }

  onClickCloseTab(id) {
    let tabs = this.state.tabs.slice()
    let newTabs = tabs.filter(tab => tab.id !== id)
    this.setState({ tabs: newTabs })
    axios.put('api/user-profile/', { tabs: newTabs })
  }

  onAddTab() {
    let newTabs = this.state.tabs.slice()
    newTabs.splice(newTabs.length - 1, 0, {
      id: uuidv4(),
      label: 'newGraph',
      range: TimeRange.ONE_DAY.short,
      increment: TimeRange.ONE_MIN.short,
      stocks: [],
    })
    this.setState({ tabs: newTabs })
    axios.put('api/user-profile/', { tabs: newTabs })
  }

  onOpenCloseSettings(state) {
    let tabs = this.state.tabs.slice()
    let newTabs = tabs.map(tab => {
      if (tab.id === 'home') {
        tab.settings = state
      }
      return tab
    })
    this.setState({ tabs: newTabs })
    axios.put('api/user-profile/', { tabs: newTabs })
  }

  onChangeTabRange(id, timeRange) {
    let tabs = this.state.tabs.slice()
    let newTabs = tabs.map(tab => {
      if (tab.id === id) {
        tab.range = timeRange
        return tab
      } else {
        return tab
      }
    })
    this.setState({ tabs: newTabs })
    axios.put('api/user-profile/', { tabs: newTabs })
  }

  onChangeTabIncrement(id, timeRange) {
    let tabs = this.state.tabs.slice()
    let newTabs = tabs.map(tab => {
      if (tab.id === id) {
        tab.increment = timeRange
        return tab
      } else {
        return tab
      }
    })
    this.setState({ tabs: newTabs })
    axios.put('api/user-profile/', { tabs: newTabs })
  }

  onChangeTabStocks(id, newStocks) {
    let tabs = this.state.tabs.slice()
    let newTabs = tabs.map(tab => {
      if (tab.id === id) {
        tab.stocks = newStocks
        return tab
      } else {
        return tab
      }
    })
    this.setState({ tabs: newTabs })
    axios.put('api/user-profile/', { tabs: newTabs })

    axios
      .get('api/user-stocks/')
      .then(res => {
        var newUserStocks = res.data.stocks
        for (var stock of newStocks) {
          if (!(stock.symbol in newUserStocks)) {
            if (stock.symbol) {
              newUserStocks[stock.symbol] = {
                addedToDash: false,
              }
            }
          }
        }
        axios.put('api/user-stocks/', { stocks: newUserStocks })
      })
      .catch(err => {
        console.log(err)
      })
  }

  onChangeTabName(id, newName) {
    let tabs = this.state.tabs.slice()
    let newTabs = tabs.map(tab => {
      if (tab.id === id) {
        tab.label = newName
        return tab
      } else {
        return tab
      }
    })
    this.setState({ tabs: newTabs })
    axios.put('api/user-profile/', { tabs: newTabs })
  }

  onAddStockToDash(symbol) {
    axios.post('api/user-dash-add/', { symbol: symbol })
  }

  onRemoveStockFromDash(symbol) {
    axios.post('api/user-dash-remove/', { symbol: symbol })
  }

  render() {
    return (
      <div className='tabs'>
        <Tab
          menu={{ inverted: true, attached: true }}
          panes={this.state.tabs.map(tab => {
            if (tab.id === 'home') {
              return {
                menuItem: {
                  key: 'home',
                  icon: 'home',
                },
                render: () => (
                  <HomeTab
                    checkLogin={this.props.checkLogin}
                    addToDash={symbol => this.onAddStockToDash(symbol)}
                    settingsOpen={tab.settings}
                    onOpenCloseSettings={state => this.onOpenCloseSettings(state)}
                  />
                ),
              }
            } else if (tab.id === 'dashboard') {
              return {
                menuItem: {
                  key: 'dashboard',
                  icon: 'dashboard',
                },
                render: () => <Dashboard removeFromDash={symbol => this.onRemoveStockFromDash(symbol)} />,
              }
            } else if (tab.id === 'add') {
              return {
                menuItem: {
                  key: 'add',
                  icon: 'add',
                },
                render: () => <Tab.Pane />,
              }
            } else {
              return {
                menuItem: (
                  <Menu.Item key={tab.id}>
                    <Grid textAlign='center'>
                      <Grid.Row columns={2}>
                        <Grid.Column
                          width={10}
                          onDoubleClick={() =>
                            this.setState({
                              toggleNameEdit: true,
                              toggleTempName: tab.label,
                              toggleNameEditID: tab.id,
                            })
                          }
                        >
                          {this.state.toggleNameEdit && this.state.toggleNameEditID === tab.id ? (
                            <Input
                              transparent
                              style={{
                                padding: '0px',
                                margin: '0px',
                              }}
                              input={{
                                style: {
                                  color: 'white',
                                },
                              }}
                              value={this.state.toggleTempName}
                              onChange={(e, { value }) => {
                                this.setState({
                                  toggleTempName: value,
                                })
                              }}
                              onKeyDown={e => {
                                if (e.key === 'Enter' || e.key === 'Escape') {
                                  if (this.state.toggleTempName !== '') {
                                    this.onChangeTabName(tab.id, this.state.toggleTempName)
                                  }
                                  this.setState({
                                    toggleNameEdit: false,
                                  })
                                  e.preventDefault()
                                  e.stopPropagation()
                                }
                              }}
                            />
                          ) : (
                            tab.label
                          )}
                        </Grid.Column>
                        <Grid.Column width={5}>
                          <Icon link name='close' size='small' onClick={() => this.onClickCloseTab(tab.id)} />
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </Menu.Item>
                ),
                render: () => (
                  <GraphTab
                    range={tab.range}
                    rangeOnChange={timeRange => this.onChangeTabRange(tab.id, timeRange)}
                    increment={tab.increment}
                    incrementOnChange={timeRange => this.onChangeTabIncrement(tab.id, timeRange)}
                    stocks={tab.stocks}
                    stocksOnChange={newStocks => this.onChangeTabStocks(tab.id, newStocks)}
                    availableStocks={this.state.availableStocks}
                  />
                ),
              }
            }
          })}
          activeIndex={this.state.activeIndex}
          onTabChange={(e, data) => {
            // Add tab button clicked
            if (data.activeIndex === this.state.tabs.length - 1) {
              var indexToAdd = this.state.tabs.length - 1
              this.onAddTab()
              this.setState({ activeIndex: indexToAdd })
            }
            // Close tab button clicked
            else if (e.target.className === 'close small link icon') {
              // Current tab is last tab
              if (this.state.activeIndex === this.state.tabs.length - 2) {
                this.setState({
                  activeIndex: this.state.activeIndex - 1,
                })
              } else {
                if (data.activeIndex < this.state.activeIndex) {
                  this.setState({
                    activeIndex: this.state.activeIndex - 1,
                  })
                }
              }
            }
            // Default case
            else {
              this.setState({ activeIndex: data.activeIndex })
            }
          }}
        />
      </div>
    )
  }
}

export default TabSystem
