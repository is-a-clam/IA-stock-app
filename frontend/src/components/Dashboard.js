import React from "react"
import axios from "../axiosConfig"
import { Tab, List, Grid, Header, Button, Icon, Modal, Form } from 'semantic-ui-react'

class Dashboard extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      transactionModalOpen: false,
      transactionModalMode: "",
      transactionModalStock: "",
      transactionAmount: "",
      transactionAmountErr: null,
      transactionPrice: "",
      transactionPriceErr: null,
      dash: {},
    }
  }

  componentDidMount() {
    axios
      .get("api/user-dash/")
      .then((res) => {
        this.setState({dash: res.data.dash})
      })
  }

  handleRemoveFromDashboard(symbol) {
    let newDash = this.state.dash
    delete newDash[symbol]
    this.setState({dash: newDash})
    this.props.removeFromDash(symbol)
  }

  handleSubmitTransaction() {
    let newDash = this.state.dash
    let stock = this.state.transactionModalStock
    let amount = parseInt(this.state.transactionAmount)
    let price = parseInt(this.state.transactionPrice)

    if (this.state.transactionModalMode === "Buy") {
      newDash[stock].amount += amount
      newDash[stock].totalEarnings -= amount*price
    }
    else {
      newDash[stock].amount -= amount
      newDash[stock].totalEarnings += amount*price
    }
    this.setState({dash: newDash})
    axios.put("api/user-dash/", {dash: newDash})
    this.setState({transactionModalOpen: false})
  }

  amountOnChange(e, {value: amount}) {
    if (isNaN(amount)) {
      this.setState({transactionAmountErr: "Please input a number"})
      return
    }
    if (amount.trim() === "") {
      this.setState({
        transactionAmountErr: null,
        transactionAmount: "",
      })
      return
    }
    if (amount <= 0) {
      this.setState({transactionAmountErr: "Please input a positive number"})
      return
    }
    if (this.state.transactionModalMode === "Sell") {
      if (amount > this.state.dash[this.state.transactionModalStock].amount) {
        this.setState({transactionAmountErr: "You cannot sell more than you currently have"})
        return
      }
    }
    this.setState({
      transactionAmountErr: null,
      transactionAmount: amount,
    })
  }

  priceOnChange(e, {value: price}) {
    if (isNaN(price)) {
      this.setState({transactionPriceErr: "Please input a number"})
      return
    }
    if (price.trim() === "") {
      this.setState({
        transactionPriceErr: null,
        transactionPrice: "",
      })
      return
    }
    if (price <= 0) {
      this.setState({transactionPriceErr: "Please input a positive number"})
      return
    }
    this.setState({
      transactionPriceErr: null,
      transactionPrice: price,
    })
  }

  render() {
    return (
      <Tab.Pane
        style = {{
          background: '#3f3f3f',
          border: '0px solid',
          color: 'white',
          padding: '0px',
          height: `${window.innerHeight - 40}px`
        }}
      >
        <List
          divided
          inverted
          style = {{
            fontSize: '20px',
            width: 'inherit',
            height: '85%',
            overflowY: 'scroll',
            padding: '20px',
            marginTop: '0px',
            marginLeft: '20px',
            marginRight: '20px',
          }}
        >
          {/* List Header */}
          <List.Item style = {{ marginBottom: '10px' }}>
            <Grid style = {{ marginLeft: '0px' }}>
              <Grid.Column width={3} style = {{
                paddingTop: '25px',
                paddingLeft: '0px',
                paddingRight: '0px',
              }}>
                <Header as = 'h1' inverted>
                  Symbol
                </Header>
              </Grid.Column>
              <Grid.Column width={3} style = {{
                paddingTop: '25px',
                paddingLeft: '0px',
                paddingRight: '0px',
              }}>
                <Header as = 'h1' inverted>
                  Amount
                </Header>
              </Grid.Column>
              <Grid.Column width={5} style = {{
                paddingTop: '25px',
                paddingLeft: '0px',
                paddingRight: '0px',
              }}>
                <Header as = 'h1' inverted>
                  Total Amount
                </Header>
              </Grid.Column>
            </Grid>
          </List.Item>

          {/* List Items */}
          {Object.entries(this.state.dash).map(([symbol, info]) => {
            return (
              <List.Item style = {{ marginBottom: '10px' }}>
                <Grid style = {{marginLeft: '0px'}}>
                  <Grid.Column width={3} style = {{
                    paddingTop: '25px',
                    paddingLeft: '0px',
                    paddingRight: '0px',
                  }}>
                    {symbol}
                  </Grid.Column>
                  <Grid.Column width={3} style = {{
                    paddingTop: '25px',
                    paddingLeft: '0px',
                    paddingRight: '0px',
                  }}>
                    {info.amount}
                  </Grid.Column>
                  <Grid.Column width={3} style = {{
                    paddingTop: '25px',
                    paddingLeft: '0px',
                    paddingRight: '0px',
                  }}>
                    ${info.totalEarnings}
                  </Grid.Column>
                  <Grid.Column width={3} style = {{
                    paddingTop: '25px',
                    paddingLeft: '0px',
                    paddingRight: '0px',
                  }}>
                    <Button
                      inverted
                      size = 'mini'
                      color = 'green'
                      onClick = {() => {this.setState({
                        transactionModalOpen: true,
                        transactionModalMode: "Buy",
                        transactionModalStock: symbol,
                      })}}
                    >
                      Buy
                    </Button>
                    <Button
                      inverted
                      size = 'mini'
                      color = 'red'
                      onClick = {() => {this.setState({
                        transactionModalOpen: true,
                        transactionModalMode: "Sell",
                        transactionModalStock: symbol,
                      })}}
                    >
                      Sell
                    </Button>
                  </Grid.Column>
                  <Grid.Column width={1} floated='right' style = {{
                    paddingTop: '25px',
                    paddingLeft: '0px',
                    paddingRight: '0px',
                  }}>
                  <Icon
                    link name = 'close'
                    onClick = {() => this.handleRemoveFromDashboard(symbol)}
                  />
                  </Grid.Column>
                </Grid>
              </List.Item>
            )
          })}
        </List>
        <Modal
          closeIcon
          onOpen = {() => this.setState({transactionModalOpen: true})}
          onClose = {() => this.setState({
            transactionModalOpen: false,
            transactionModalMode: "",
            transactionModalStock: "",
            transactionAmount: "",
            transactionAmountErr: null,
            transactionPrice: "",
            transactionPriceErr: null,
          })}
          open = {this.state.transactionModalOpen}
        >
          <Modal.Header>
            {this.state.transactionModalMode}
          </Modal.Header>
          <Modal.Content>
            <p>
              Please enter amount and price of {this.state.transactionModalStock} stock
            </p>
            <br></br>
            <Form>
              <Form.Group widths='equal'>
                <Form.Input
                  transparent
                  placeholder = 'Amount'
                  onChange = {this.amountOnChange.bind(this)}
                  error = {this.state.transactionAmountErr && {
                    content: this.state.transactionAmountErr,
                    pointing: 'above',
                  }}
                />
                <Form.Input
                  transparent
                  placeholder = 'Price'
                  onChange = {this.priceOnChange.bind(this)}
                  error = {this.state.transactionPriceErr && {
                    content: this.state.transactionPriceErr,
                    pointing: 'above',
                  }}
                />
              </Form.Group>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button
              onClick = {() => this.handleSubmitTransaction()}
              primary
              disabled = {
                this.state.transactionAmountErr !== null ||
                this.state.transactionPriceErr !== null ||
                this.state.transactionAmount.trim() === "" ||
                this.state.transactionPrice.trim() === ""
              }
            >
              Submit
            </Button>
          </Modal.Actions>
        </Modal>
      </Tab.Pane>
    )
  }
}

export default Dashboard
