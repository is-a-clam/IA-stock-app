import React from "react"
import axios from "../axiosConfig"
import { Tab, Grid } from 'semantic-ui-react'

class Dashboard extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      dash: {},
    }
  }

  componentDidMount() {
    this.setState({loading: true})
    axios
      .get("api/user-dash/")
      .then((res) => {
        console.log(res.data.dash)
        this.setState({dash: res.data.dash})
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

      </Tab.Pane>
    )
  }
}

export default Dashboard
