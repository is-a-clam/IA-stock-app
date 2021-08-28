import React from 'react'
import { Item, Grid, Icon, Loader, Popup, Segment, Header, Dimmer } from 'semantic-ui-react'
import { StockListingRow } from './styledComponents'
import axios from "../axiosConfig";

class StockListing extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      extraInfo: false,
      data: null,
    }
  }

  componentDidMount() {
    axios
      .get("api/get-stock-key-info/" + this.props.symbol + "/")
      .then((res) => {
        this.setState({loading: false, data: res.data})
      })
      .catch((err) => console.log(err))
  }

  render() {
    if (this.state.loading) {
      return (
        <Item style =
          {{
            border: '1px solid #707070',
            margin: '0px',
            padding: '1em',
            paddingLeft: '2em',
          }}
        >
          <Item.Content>
            <Item.Description style = {{
                margin: '0px'
              }}
            >
              <Segment style = {{backgroundColor: '#00000000'}}>
                <Dimmer style = {{backgroundColor: '#00000000'}} active>
                  <Loader />
                </Dimmer>
              </Segment>
            </Item.Description>
          </Item.Content>
        </Item>
      )
    }
    return (
      <Popup
        wide
        className='stock-info'
        content={
          <Grid
            style = {{
              marginLeft: '1em',
              marginRight: '1em',
              marginBottom: '0.5em',
              width: 'auto',
            }}
            verticalAlign='middle'
          >
            <Grid.Row>
              <Grid.Column width={10} style={{padding: '0px'}}>
                <Header as='h1'>
                  {this.state.data.companyName}
                </Header>
              </Grid.Column>
              <Grid.Column
                floated='right'
                width={1}
                style={{padding: '0px'}}
                textAlign='right'
              >
                <Icon
                  link
                  name = 'close'
                  size = 'small'
                  onClick = {() => this.setState({extraInfo: false})}
                />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row className='stock-info-row'>
              <Grid.Column width={6} style={{padding: '0px'}}>
                Country
              </Grid.Column>
              <Grid.Column width={9} style={{padding: '0px'}}>
                {this.state.data.country}
              </Grid.Column>
            </Grid.Row>

            <Grid.Row className='stock-info-row' style={{marginBottom: '1em'}}>
              <Grid.Column width={6} style={{padding: '0px'}}>
                Exchange
              </Grid.Column>
              <Grid.Column width={9} style={{padding: '0px'}}>
                {this.state.data.exchange}
              </Grid.Column>
            </Grid.Row>

            <Grid.Row className='stock-info-row'>
              <Grid.Column width={3} style={{padding: '0px'}}>
                Close
              </Grid.Column>
              <Grid.Column width={4} style={{padding: '0px', paddingLeft: '1em'}}>
                {this.state.data.quote.close}
              </Grid.Column>
              <Grid.Column width={6} style={{padding: '0px'}}>
                Open
              </Grid.Column>
              <Grid.Column width={2} style={{padding: '0px'}}>
                {this.state.data.quote.open}
              </Grid.Column>
            </Grid.Row>

            <Grid.Row className='stock-info-row'>
              <Grid.Column width={3} style={{padding: '0px'}}>
                High
              </Grid.Column>
              <Grid.Column width={4} style={{padding: '0px', paddingLeft: '1em'}}>
                {this.state.data.quote.high}
              </Grid.Column>
              <Grid.Column width={6} style={{padding: '0px'}}>
                52 Week High
              </Grid.Column>
              <Grid.Column width={2} style={{padding: '0px'}}>
                {this.state.data.keyStats.week52high}
              </Grid.Column>
            </Grid.Row>

            <Grid.Row className='stock-info-row'>
              <Grid.Column width={3} style={{padding: '0px'}}>
                Low
              </Grid.Column>
              <Grid.Column width={4} style={{padding: '0px', paddingLeft: '1em'}}>
                {this.state.data.quote.low}
              </Grid.Column>
              <Grid.Column width={6} style={{padding: '0px'}}>
                52 Week Low
              </Grid.Column>
              <Grid.Column width={2} style={{padding: '0px'}}>
                {this.state.data.keyStats.week52low}
              </Grid.Column>
            </Grid.Row>

            <Grid.Row className='stock-info-row'>
              <Grid.Column width={3} style={{padding: '0px'}}>
                Volume
              </Grid.Column>
              <Grid.Column width={4} style={{padding: '0px', paddingLeft: '1em'}}>
                {Math.round(this.state.data.quote.latestVolume/10000)/100}M
              </Grid.Column>
              <Grid.Column width={6} style={{padding: '0px'}}>
                Market Cap
              </Grid.Column>
              <Grid.Column width={2} style={{padding: '0px'}}>
                {Math.round(this.state.data.quote.marketCap/1000000000)/1000}T
              </Grid.Column>
            </Grid.Row>

            <Grid.Row className='stock-info-row'>
              <Grid.Column width={3} style={{padding: '0px'}}>
                PE Ratio
              </Grid.Column>
              <Grid.Column width={4} style={{padding: '0px', paddingLeft: '1em'}}>
                {Math.round(this.state.data.keyStats.peRatio*100)/100}
              </Grid.Column>
              <Grid.Column width={6} style={{padding: '0px'}}>
                Dividend Yield
              </Grid.Column>
              <Grid.Column width={2} style={{padding: '0px'}}>
                {Math.round(this.state.data.keyStats.dividendYield*10000)/100}%
              </Grid.Column>
            </Grid.Row>
          </Grid>
        }
        style={{
          background: '#202225',
          opacity: 0.9,
        }}
        position='left center'
        inverted
        open={this.state.extraInfo}
        trigger={
          <Item style =
            {{
              border: '1px solid #707070',
              margin: '0px',
              marginBottom: '-1px',
            }}
          >
            <Item.Content>
              <Item.Description style = {{color: 'white'}}>
                <Grid style = {{margin: '1em', marginBottom: '0.5em'}}>
                  <StockListingRow columns={4}>
                    <Grid.Column width={3}>
                      <Icon style = {{ color: this.props.color }} name = 'minus' size = 'large'/>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      {this.props.symbol}
                    </Grid.Column>
                    <Grid.Column width={7}>
                      {this.state.data.companyName}
                    </Grid.Column>
                    <Grid.Column textAlign='right' width={1}>
                      <Icon
                        link
                        name = 'close'
                        size = 'small'
                        onClick = {this.props.onDelete}
                      />
                    </Grid.Column>
                  </StockListingRow>
                  <StockListingRow>
                    {this.state.data.quote.change > 0 ? (
                      <Icon color = 'green' name = 'arrow up' />
                    ) : (
                      <Icon color = 'red' name = 'arrow down' />
                    )}
                    {this.state.data.quote.latestPrice} (
                    {Math.round(this.state.data.quote.changePercent * 10000) / 100}
                    %)
                  </StockListingRow>
                  <StockListingRow>
                    Previous Close: ${this.state.data.quote.close}
                  </StockListingRow>
                  <StockListingRow>
                    Open: ${this.state.data.quote.open}
                  </StockListingRow>
                  <StockListingRow>
                    <Grid.Column textAlign = 'right'>
                      <button
                        className = 'link-button'
                        style = {{fontFamily: 'Roboto Mono'}}
                        onClick = {() => this.setState({extraInfo: !this.state.extraInfo})}
                      >
                        View Details
                      </button>
                    </Grid.Column>
                  </StockListingRow>
                </Grid>
              </Item.Description>
            </Item.Content>
          </Item>
        }
      />
    )
  }
}

export default StockListing
