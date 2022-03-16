import React from 'react'
import _ from 'lodash'
import { Menu, Item, Sidebar, Tab, Grid, Container, Search } from 'semantic-ui-react'
import TimeRange from './TimeRange'
import LineChart from './Graph'
import StockListing from './StockListing'

function searchReducer(state, action) {
  switch (action.type) {
    case 'CLEAN_QUERY':
      return { results: [], value: '' }
    case 'START_SEARCH':
      return { ...state, value: action.query }
    case 'FINISH_SEARCH':
      return { ...state, results: action.results }

    default:
      throw new Error()
  }
}

function StockSearch(props) {
  const [state, dispatch] = React.useReducer(searchReducer, {
    results: [],
    value: '',
  })
  const timeoutRef = React.useRef()
  const handleSearchChange = React.useCallback((e, data) => {
    clearTimeout(timeoutRef.current)
    dispatch({ type: 'START_SEARCH', query: data.value })

    timeoutRef.current = setTimeout(() => {
      if (data.value.length === 0) {
        dispatch({ type: 'CLEAN_QUERY' })
        return
      }

      const re = new RegExp(_.escapeRegExp(data.value.toUpperCase()), 'i')
      const isMatch = result => re.test(result.symbol)

      dispatch({
        type: 'FINISH_SEARCH',
        results: _.filter(props.availableStocks, isMatch),
      })
    }, 300)
  }, [])

  React.useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <Search
      input={{
        transparent: true,
        placeholder: ' Search',
        input: {
          style: {
            color: 'white',
          },
        },
      }}
      icon={null}
      onResultSelect={(e, data) => {
        props.addStock(data.result.symbol)
        dispatch({ type: 'CLEAN_QUERY' })
      }}
      resultRenderer={({ symbol }) => <div>{symbol}</div>}
      onSearchChange={handleSearchChange}
      results={state.results}
      value={state.value}
    />
  )
}

class GraphTab extends React.Component {
  handleRangeClick(e, { name }) {
    var newRange = TimeRange.fromString(name)
    var currIncrement = TimeRange.fromString(this.props.increment)
    var newIncrement = TimeRange.getIncrementFromRange(newRange, currIncrement)
    this.props.rangeOnChange(name)
    this.props.incrementOnChange(newIncrement.short)
  }

  handleIncrementClick(e, { name }) {
    var newIncrement = TimeRange.fromString(name)
    var currRange = TimeRange.fromString(this.props.range)
    var newRange = TimeRange.getRangeFromIncrement(newIncrement, currRange)
    this.props.incrementOnChange(name)
    this.props.rangeOnChange(newRange.short)
  }

  handleAddStock(stockSymbol) {
    var newStocks = this.props.stocks.slice()
    var colors = ['#B84D46', '#406FAE', '#508A4E', '#EA8539', '#5D43A0']
    var stockColor = colors[newStocks.length % 5]
    newStocks.splice(newStocks.length, 0, {
      symbol: stockSymbol,
      color: stockColor,
    })
    this.props.stocksOnChange(newStocks)
  }

  handleDeleteStock(index) {
    var newStocks = this.props.stocks.slice()
    newStocks.splice(index, 1)
    this.props.stocksOnChange(newStocks)
  }

  render() {
    return (
      <Tab.Pane
        style={{
          background: '#3f3f3f',
          border: '0px solid',
          padding: '0px',
          height: '100%',
        }}
      >
        <Grid stackable style={{ margin: '0px' }} columns={2}>
          {/* Range Menu */}
          <Grid.Column width={6} style={{ padding: '0px', paddingLeft: '1em' }}>
            <Menu inverted secondary style={{ margin: '0px' }}>
              <Menu.Item header>Range:</Menu.Item>

              {TimeRange.ranges().map(timeRange => {
                return <Menu.Item name={timeRange.short} active={this.props.range === timeRange.short} onClick={this.handleRangeClick.bind(this)} />
              })}
            </Menu>
          </Grid.Column>

          {/* Increment Menu */}
          <Grid.Column width={10} style={{ padding: '0px' }}>
            <Menu inverted secondary style={{ margin: '0px' }}>
              <Menu.Item header>Increment:</Menu.Item>

              {TimeRange.increments().map(timeRange => {
                return (
                  <Menu.Item
                    name={timeRange.short}
                    active={this.props.increment === timeRange.short}
                    onClick={this.handleIncrementClick.bind(this)}
                  />
                )
              })}
            </Menu>
          </Grid.Column>
        </Grid>

        <Sidebar.Pushable as={Container} id='main-content'>
          {/* StockListings */}
          <Sidebar
            as={Item.Group}
            className='stock-listing'
            animation='overlay'
            direction={'right'}
            visible
            width='wide'
            style={{ background: '#202225' }}
          >
            {this.props.stocks.map((stock, index) => {
              return <StockListing symbol={stock.symbol} color={stock.color} onDelete={() => this.handleDeleteStock(index)} />
            })}

            <Item
              style={{
                border: '1px solid #707070',
                margin: '0px',
                marginBottom: '10em',
                padding: '1em',
                paddingLeft: '2em',
              }}
            >
              <Item.Content>
                <StockSearch availableStocks={this.props.availableStocks} addStock={stockSymbol => this.handleAddStock(stockSymbol)} />
              </Item.Content>
            </Item>
          </Sidebar>

          {/* Graph */}
          <Sidebar.Pusher>
            <Container id='main-content' style={{ width: '920px' }}>
              <LineChart range={this.props.range} increment={this.props.increment} stocks={this.props.stocks} />
            </Container>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Tab.Pane>
    )
  }
}

export default GraphTab
