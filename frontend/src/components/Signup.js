import React from "react"
import { Form, Grid, Header, Segment, Button, Message } from 'semantic-ui-react'
import axios from "../axiosConfig";

class Signup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: "",
      usernameErr: null,
      email: "",
      emailErr: null,
      password: "",
      passwordErr: null,
    }
  }

  handleChange(e, {name, value}) {
    this.setState({[name]: value})
  }

  handleSubmit() {
    axios
      .post("api/register/", {
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
      })
      .then((res) => {
        axios
          .post("api/login/", {
            username: this.state.username,
            password: this.state.password,
          })
          .then((res) => {
            this.props.checkLogin()
          })
          .catch((err) => {console.log(err.response)})
      })
      .catch((err) => {
        var message = err.response.data
        this.setState({
          usernameErr: message.username?.[0],
          emailErr: message.email?.[0],
          passwordErr: message.password?.[0],
        })
      })
  }

  render() {
    return (
      <Grid
        textAlign = 'center'
        style={{
          height: '110vh',
          background: '#202225',
        }}
        verticalAlign='middle'
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as = 'h1' inverted textAlign='center'>
            Sign Up
          </Header>
          <Form size='large'>
            <Segment>
              <Form.Input
                fluid
                icon='user'
                iconPosition='left'
                placeholder='Username'
                name='username'
                onChange={this.handleChange.bind(this)}
                value={this.state.username}
                error={this.state.usernameErr && {
                  content: this.state.usernameErr,
                  pointing: 'below',
                }}
              />
              <Form.Input
                fluid
                icon='mail'
                iconPosition='left'
                placeholder='Email'
                name='email'
                onChange={this.handleChange.bind(this)}
                value={this.state.email}
                error={this.state.emailErr && {
                  content: this.state.emailErr,
                  pointing: 'below',
                }}
              />
              <Form.Input
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                type='password'
                name='password'
                onChange={this.handleChange.bind(this)}
                value={this.state.password}
                error={this.state.passwordErr && {
                  content: this.state.passwordErr,
                  pointing: 'below',
                }}
              />
              <Button
                color='teal'
                fluid
                size='large'
                onClick = {this.handleSubmit.bind(this)}
              >
                Create Account
              </Button>
            </Segment>
          </Form>
          <Message>
            Already have an account? <button
              className = "link-button"
              onClick = {this.props.onChangePage.bind(this)}
            >
              Log In
            </button>
          </Message>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Signup
