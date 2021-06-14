import React from "react"
import { Tab, Sidebar, Icon, Container, Header, Grid, Button } from 'semantic-ui-react'

class HomeTab extends React.Component {

  handleSettingsOpenClose(state) {
    this.props.onOpenCloseSettings(state)
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
                  <Button negative>
                    Logout
                  </Button>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Button negative>
                    Change Password
                  </Button>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Button negative>
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
                Your Stocks
              </Header>
            </Container>
          </Sidebar.Pusher>

        </Sidebar.Pushable>
      </Tab.Pane>
    )
  }
}

export default HomeTab
