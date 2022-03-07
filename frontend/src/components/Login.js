import React from 'react'
import { Form, Grid, Header, Segment, Button, Message } from 'semantic-ui-react'
import axios from '../axiosConfig'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      usernameErr: null,
      password: '',
      passwordErr: null,
    }
  }

  handleChange(e, { name, value }) {
    this.setState({ [name]: value })
  }

  handleSubmit() {
    if (this.state.username === '') {
      this.setState({
        usernameErr: 'This field may not be blank.',
      })
    } else {
      this.setState({
        usernameErr: null,
      })
    }
    if (this.state.password === '') {
      this.setState({
        passwordErr: 'This field may not be blank.',
      })
    } else {
      this.setState({
        passwordErr: null,
      })
    }
    if (this.state.password !== '' && this.state.username !== '') {
      axios
        .post('api/login/', {
          username: this.state.username,
          password: this.state.password,
        })
        .then(res => {
          this.props.checkLogin()
        })
        .catch(err => {
          this.setState({
            usernameErr: err.response.data.detail,
            passwordErr: err.response.data.detail,
          })
        })
    }
  }

  render() {
    return (
      <Grid
        textAlign='center'
        style={{
          height: '110vh',
          background: '#202225',
        }}
        verticalAlign='middle'
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h1' inverted textAlign='center'>
            Log In
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
                error={
                  this.state.usernameErr && {
                    content: this.state.usernameErr,
                    pointing: 'below',
                  }
                }
              />
              <Form.Input
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                name='password'
                type='password'
                onChange={this.handleChange.bind(this)}
                value={this.state.password}
                error={
                  this.state.passwordErr && {
                    content: this.state.passwordErr,
                    pointing: 'below',
                  }
                }
              />
              <Button color='teal' fluid size='large' onClick={this.handleSubmit.bind(this)}>
                Log In
              </Button>
            </Segment>
          </Form>
          <Message>
            Don't have an account?{' '}
            <button className='link-button' onClick={this.props.onChangePage.bind(this)}>
              Sign Up
            </button>
          </Message>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Login
