import React from 'react'
import { Tab, Sidebar, Icon, Container, Header, Grid, Button, Modal, Form, List, Dimmer, Loader } from 'semantic-ui-react'
import { MyStocksContainer } from './styledComponents'
import axios from '../axiosConfig'

class HomeTab extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      yourStocksLoading: false,
      newPasswordModalOpen: false,
      newPassword: '',
      changePasswordErr: null,
      confirmModalOpen: false,
      confirmModalText: '',
      confirmModalAction: null,
      userStocks: {},
    }
  }

  componentDidMount() {
    this.setState({ yourStocksLoading: true })
    axios
      .get('api/user-stocks/')
      .then(res => {
        var requests = []
        for (let stock of Object.keys(res.data.stocks)) {
          requests.splice(requests.length, 0, axios.get('api/get-stock-key-info/' + stock + '/'))
        }
        Promise.all(requests).then(res2 => {
          var userStocks = []
          for (let i = 0; i < Object.keys(res.data.stocks).length; i++) {
            userStocks[Object.keys(res.data.stocks)[i]] = {
              company: res2[i].data.companyName,
              rising: res2[i].data.quote.change > 0,
              price: res2[i].data.quote.latestPrice,
              percentage: Math.round(res2[i].data.quote.changePercent * 10000) / 100,
              added: Object.values(res.data.stocks)[i].addedToDash,
            }
          }
          this.setState({
            userStocks: userStocks,
            yourStocksLoading: false,
          })
        })
      })
      .catch(err => console.log(err))
  }

  handleSettingsOpenClose(state) {
    this.props.onOpenCloseSettings(state)
  }

  handleLogout() {
    axios
      .post('api/logout/', {})
      .then(res => {
        this.props.checkLogin()
      })
      .catch(err => {
        console.log(err)
      })
  }

  handleChangePassword(newPassword) {
    axios
      .post('api/change-password/', {
        newPassword: newPassword,
      })
      .then(res => {
        this.setState({
          newPasswordModalOpen: false,
          confirmModalOpen: true,
          confirmModalText: 'You have changed your password',
          confirmModalAction: () => {
            return null
          },
        })
      })
      .catch(err => {
        this.setState({
          changePasswordErr: err.response.data.newPassword[0],
        })
      })
  }

  handleDeleteAccount() {
    axios
      .delete('api/delete-user/')
      .then(res => {
        this.props.checkLogin()
      })
      .catch(err => {
        console.log(err)
      })
  }

  newPasswordOnChange(e, { value: password }) {
    this.setState({ newPassword: password })
  }

  handleAddToDashboard(symbol) {
    let newUserStocks = this.state.userStocks
    newUserStocks[symbol].added = true
    this.setState({ userStocks: newUserStocks })
    this.props.addToDash(symbol)
  }

  render() {
    return (
      <Tab.Pane
        style={{
          background: '#3f3f3f',
          border: '0px solid',
          color: 'white',
          padding: '0px',
          height: `${window.innerHeight - 40}px`,
        }}
      >
        <Sidebar.Pushable as={Container} id='main-content'>
          {/* Settings */}
          <Sidebar
            as={Container}
            animation='overlay'
            direction={'right'}
            visible={this.props.settingsOpen}
            width='wide'
            style={{ background: '#202225' }}
          >
            <Grid
              textAlign='left'
              style={{
                width: 'inherit',
                margin: '1em',
                paddingRight: '1.5em',
              }}
            >
              <Grid.Row style={{ marginBottom: '2em' }}>
                {/* Title */}
                <Grid.Column width={14}>
                  <Header as='h1' inverted>
                    Settings
                  </Header>
                </Grid.Column>
                {/* Open / Close */}
                <Grid.Column width={1}>
                  <Icon link name='close' onClick={() => this.handleSettingsOpenClose(false)} />
                </Grid.Column>
              </Grid.Row>

              {/* Logout */}
              <Grid.Row>
                <Grid.Column>
                  <Button
                    negative
                    onClick={() =>
                      this.setState({
                        confirmModalOpen: true,
                        confirmModalText: 'Are you sure you want to logout?',
                        confirmModalAction: this.handleLogout.bind(this),
                      })
                    }
                  >
                    Logout
                  </Button>
                </Grid.Column>
              </Grid.Row>

              {/* Change Password */}
              <Grid.Row>
                <Grid.Column>
                  <Button
                    negative
                    onClick={() =>
                      this.setState({
                        newPasswordModalOpen: true,
                      })
                    }
                  >
                    Change Password
                  </Button>
                  <Modal
                    closeIcon
                    onOpen={() =>
                      this.setState({
                        newPasswordModalOpen: true,
                      })
                    }
                    onClose={() =>
                      this.setState({
                        newPasswordModalOpen: false,
                        newPassword: '',
                        changePasswordErr: null,
                      })
                    }
                    open={this.state.newPasswordModalOpen}
                  >
                    <Modal.Header>Change Password</Modal.Header>
                    <Modal.Content>
                      <Form>
                        <Form.Input
                          transparent
                          type='password'
                          placeholder='New Password'
                          onChange={this.newPasswordOnChange.bind(this)}
                          error={
                            this.state.changePasswordErr && {
                              content: this.state.changePasswordErr,
                              pointing: 'above',
                            }
                          }
                        />
                      </Form>
                    </Modal.Content>
                    <Modal.Actions>
                      <Button onClick={() => this.handleChangePassword(this.state.newPassword)} primary>
                        Change Password
                      </Button>
                    </Modal.Actions>
                  </Modal>
                </Grid.Column>
              </Grid.Row>

              {/* Delete Account */}
              <Grid.Row>
                <Grid.Column>
                  <Button
                    negative
                    onClick={() =>
                      this.setState({
                        confirmModalOpen: true,
                        confirmModalText: 'Are you sure you want to logout?',
                        confirmModalAction: this.handleDeleteAccount.bind(this),
                      })
                    }
                  >
                    Delete Account
                  </Button>
                </Grid.Column>
              </Grid.Row>

              {/* Confirm Popup */}
              <Modal
                onOpen={() => this.setState({ confirmModalOpen: true })}
                onClose={() => this.setState({ confirmModalOpen: false })}
                open={this.state.confirmModalOpen}
              >
                <Modal.Header>Confirmation</Modal.Header>
                <Modal.Content>{this.state.confirmModalText}</Modal.Content>
                <Modal.Actions>
                  <Button
                    onClick={() => {
                      this.setState({
                        confirmModalOpen: false,
                      })
                      this.state.confirmModalAction()
                    }}
                    primary
                  >
                    Yes
                  </Button>
                </Modal.Actions>
              </Modal>
            </Grid>
          </Sidebar>

          {/* HomeTab */}
          <Sidebar.Pusher>
            <Container id='main-content'>
              <Icon
                link
                name='settings'
                onClick={() => this.handleSettingsOpenClose(!this.props.settingsOpen)}
                style={{
                  marginTop: '1em',
                  paddingLeft: '5px',
                }}
              />
              <Header
                as='h1'
                textAlign='center'
                inverted
                style={{
                  marginTop: '1em',
                  marginBottom: '1em',
                }}
              >
                Your Stocks
              </Header>

              {/* Your Stocks */}
              <Dimmer.Dimmable as={MyStocksContainer} dimmed={this.state.yourStocksLoading}>
                <Dimmer active={this.state.yourStocksLoading} style={{ backgroundColor: '#00000000' }}>
                  <Loader>Loading</Loader>
                </Dimmer>
                <List
                  style={{
                    fontSize: '20px',
                    width: 'inherit',
                    height: '100%',
                    overflowY: 'scroll',
                    padding: '20px',
                    marginTop: '0px',
                  }}
                >
                  {Object.entries(this.state.userStocks).map(([symbol, info]) => {
                    return (
                      <List.Item
                        style={{
                          marginBottom: '10px',
                        }}
                      >
                        <Grid
                          style={{
                            marginLeft: '0px',
                          }}
                        >
                          <Grid.Column
                            width={3}
                            floated='left'
                            style={{
                              paddingTop: '25px',
                              paddingLeft: '0px',
                              paddingRight: '0px',
                            }}
                          >
                            {symbol}
                          </Grid.Column>
                          <Grid.Column
                            width={4}
                            style={{
                              paddingTop: '25px',
                              paddingLeft: '0px',
                              paddingRight: '0px',
                            }}
                          >
                            {info.company}
                          </Grid.Column>
                          <Grid.Column
                            width={6}
                            floated='right'
                            style={{
                              paddingTop: '25px',
                              paddingLeft: '0px',
                              paddingRight: '0px',
                            }}
                          >
                            {info.rising ? <Icon color='green' name='arrow up' /> : <Icon color='red' name='arrow down' />}
                            {info.price} ({info.percentage}%)
                          </Grid.Column>
                          <Grid.Column
                            width={3}
                            floated='right'
                            style={{
                              paddingLeft: '0px',
                              paddingRight: '0px',
                            }}
                          >
                            {info.added ? (
                              <Button basic inverted disabled size='mini' color='blue'>
                                Added to Dashboard
                              </Button>
                            ) : (
                              <Button basic inverted size='mini' color='blue' onClick={() => this.handleAddToDashboard(symbol)}>
                                Add to Dashboard
                              </Button>
                            )}
                          </Grid.Column>
                        </Grid>
                      </List.Item>
                    )
                  })}
                </List>
              </Dimmer.Dimmable>
            </Container>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Tab.Pane>
    )
  }
}

export default HomeTab
