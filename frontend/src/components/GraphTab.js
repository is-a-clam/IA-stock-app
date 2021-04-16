import React, { Component } from "react"
import { Menu, Item, Sidebar, Tab, Grid, Icon, Container } from 'semantic-ui-react'
import { StockListingRow } from './styledComponents'
import TimeRange, { ranges, increments } from './TimeRange'
import LineChart from './Graph'

class StockListing extends React.Component {
  render() {
    return (
      <Item style =
        {{
          border: '1px solid #707070',
          margin: '0px',
          marginBottom: '-1px',
        }}
      >
        <Item.Content>
          <Item.Description style = {{color: 'white'}} >
            <Grid style = {{margin: '1em', marginBottom: '0.5em'}}>
              <StockListingRow columns={3}>
                <Grid.Column width={3}>
                  <Icon color='blue' name='minus' size='large'/>
                </Grid.Column>
                <Grid.Column width={4}>
                  {this.props.symbol}
                </Grid.Column>
                <Grid.Column width={3}>
                  {this.props.symbol}
                </Grid.Column>
              </StockListingRow>
              <StockListingRow>
                <Grid.Column width={3}>
                  hi
                </Grid.Column>
              </StockListingRow>
            </Grid>
          </Item.Description>
        </Item.Content>
      </Item>
    )
  }
}

class GraphTab extends React.Component {
  constructor(props) {
    super(props)
  }

  handleRangeClick(e, { name }) {
    this.props.rangeOnChange(name)
  }

  handleIncrementClick(e, { name }) {
    this.props.incrementOnChange(name)
  }

  render() {
    return (
      <Tab.Pane
        style = {{
          background: '#3f3f3f',
          border: '0px solid',
          padding: '0px',
          height: '100%'
        }}
      >
        <Grid stackable style = {{margin: '0px'}} columns = {2}>

            {/* Range Menu */}
            <Grid.Column width = {6} style = {{padding: '0px', paddingLeft: '1em'}}>
              <Menu inverted secondary style = {{margin: '0px'}}>
                <Menu.Item header>
                  Range:
                </Menu.Item>

                {ranges().map((timeRange) => {
                  return (
                    <Menu.Item
                      name = {timeRange.short}
                      active = {this.props.range === timeRange.short}
                      onClick = {this.handleRangeClick.bind(this)}
                    />
                  )
                })}

              </Menu>
            </Grid.Column>

            {/* Increment Menu */}
            <Grid.Column width = {10} style = {{padding: '0px'}}>
              <Menu inverted secondary style = {{margin: '0px'}}>
                <Menu.Item header>
                  Increment:
                </Menu.Item>

                {increments().map((timeRange) => {
                  return (
                    <Menu.Item
                      name = {timeRange.short}
                      active = {this.props.increment === timeRange.short}
                      onClick = {this.handleIncrementClick.bind(this)}
                    />
                  )
                })}

              </Menu>
            </Grid.Column>

        </Grid>

        <Sidebar.Pushable as = {Container}>

          {/* StockListings */}
          <Sidebar
            as = {Item.Group}
            animation = 'overlay'
            direction = {'right'}
            visible
            width = 'wide'
            style = {{background: '#202225'}}
          >
            {this.props.stocks.map((symbol) => {
              return (
                <StockListing
                  symbol = {symbol}
                />
              )
            })}
          </Sidebar>

          {/* Graph */}
          <Sidebar.Pusher>
            <Container>
              <LineChart
                range = {this.props.range}
                increment = {this.props.increment}
              />
            </Container>
          </Sidebar.Pusher>

        </Sidebar.Pushable>
      </Tab.Pane>
    )
  }
}

export default GraphTab
