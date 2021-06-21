import axios from "axios"

const backendURIs = {
  development: 'http://localhost:8000/',
  production: 'http://stock-app-cs-ia.herokuapp.com/',
}

axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.baseURL = backendURIs[process.env.NODE_ENV]
axios.defaults.withCredentials = true

export default axios
