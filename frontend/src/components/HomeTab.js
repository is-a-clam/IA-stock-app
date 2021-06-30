import React from "react"
import { Tab, Sidebar, Icon, Container, Header, Grid, Button, Modal, Input } from 'semantic-ui-react'
import axios from "../axiosConfig";

class HomeTab extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      newPassword: ""
    }
  }

  handleSettingsOpenClose(state) {
    this.props.onOpenCloseSettings(state)
  }

  handleLogout() {
    axios
      .post("api/logout/", {})
      .then((res) => { this.props.checkLogin() })
      .catch((err) => { console.log(err) })
  }

  handleChangePassword(newPassword) {
    axios
      .post("api/change-password/", {
        password: newPassword
      })
      .then((res) => { console.log(res) })
      .catch((err) => { console.log(err) })
  }

  handleDeleteAccount() {
    axios
      .delete("api/delete-user/")
      .then((res) => { this.props.checkLogin() })
      .catch((err) => { console.log(err) })
  }

  newPasswordOnChange(e, {value: password}) {
    this.setState({newPassword: password})
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
        <Sidebar.Pushable as = {Container}>

          {/* Settings */}
          <Sidebar
            as = {Container}
            animation = 'overlay'
            direction = {'right'}
            visible = {this.props.settingsOpen}
            width = 'wide'
            style = {{background: '#202225'}}
          >
            <Grid
              textAlign='left'
              style = {{
                width: 'inherit',
                margin: '0em',
                marginTop: '1em',
              }}
            >
              <Grid.Row style={{marginBottom: '2em'}}>
                <Grid.Column width = {14}>
                  <Header as='h1' inverted>Settings</Header>
                </Grid.Column>
                <Grid.Column width = {1}>
                  <Icon
                    link name = 'close'
                    onClick = {() => this.handleSettingsOpenClose(false)}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Button
                    negative
                    onClick = {() => this.handleLogout()}
                  >
                    Logout
                  </Button>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Modal
                    closeIcon
                    trigger = { <Button negative> Change Password </Button> }
                    header = "Change Password"
                    content = {
                      <Input
                        transparent
                        placeholder = 'New Password'
                        onChange = {this.newPasswordOnChange.bind(this)}
                        style = {{
                          paddingLeft: '1.5em',
                          paddingTop: '1em',
                          paddingBottom: '1em',
                        }}
                      />
                    }
                    actions = {[{
                      content: 'Change Password',
                      positive: true,
                      onClick: () => {this.handleChangePassword(this.state.newPassword)}
                    }]}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Button
                    negative
                    onClick = {() => this.handleDeleteAccount()}
                  >
                    Delete Account
                  </Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Sidebar>

          {/* HomeTab */}
          <Sidebar.Pusher>
            <Container>
              <Icon
                link
                name = 'settings'
                onClick = {() => this.handleSettingsOpenClose(!this.props.settingsOpen)}
                style = {{
                  marginTop: '1em',
                  paddingLeft: '5px',
                }}
              />
              <Header
                as = 'h1'
                textAlign = 'center'
                inverted
                style = {{
                  marginTop: '1em',
                }}
              >
                Welcome
              </Header>
            </Container>
          </Sidebar.Pusher>

        </Sidebar.Pushable>
      </Tab.Pane>
    )
  }
}

export default HomeTab
