import React from 'react'
import TabSystem from './components/TabSystem'
import Accounts from './components/Accounts'
import axios from './axiosConfig';
import './App.css'

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loggedIn: false
    }
  }

  componentDidMount() {
    this.checkLogin()
  }

  checkLogin() {
    axios
      .get("api/login-set-cookie/")
    axios
      .get("api/user-profile/")
      .then((res) => {this.setState({loggedIn: true})})
      .catch((err) => {this.setState({loggedIn: false})})
  }

  render() {
    if (this.state.loggedIn) {
      return (
        <TabSystem
          checkLogin = {this.checkLogin.bind(this)}
        />
      )
    }
    else {
      return (
        <Accounts
          checkLogin = {this.checkLogin.bind(this)}
        />
      )
    }
  }
}

export default App
