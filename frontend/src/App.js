import React from 'react'
import TabSystem from './components/TabSystem'
import Accounts from './components/Accounts'
import axios from './axiosConfig'
import './App.css'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: false,
    }
  }

  componentDidMount() {
    this.checkLogin()
  }

  checkLogin() {
    const list = ['AAPL', 'MSFT', 'GOOG', 'GOOGL', 'AMZN', 'TSLA', 'BRK.B', 'NVDA', 'FB', 'UNH', 'JNJ', 'V', 'WMT', 'JPM', 'XOM', 'PG', 'CVX', 'HD', 'BAC', 'MA', 'PFE', 'ABBV', 'LLY', 'KO', 'DIS', 'AVGO', 'COST', 'CSCO', 'VZ', 'PEP', 'ORCL', 'TMO', 'ACN', 'CMCSA', 'ABT', 'MRK', 'ADBE', 'CRM', 'NKE', 'DHR', 'INTC', 'WFC', 'UPS', 'QCOM', 'MCD', 'UNP', 'T', 'TXN', 'TMUS', 'NEE', 'MS', 'SCHW', 'NFLX', 'BMY', 'LOW', 'RTX', 'LIN', 'MDT', 'PM', 'CVS', 'AMGN', 'COP', 'AXP', 'AMD', 'HON', 'INTU', 'LMT', 'DE', 'CAT', 'ANTM', 'PYPL', 'IBM', 'GS', 'PLD', 'AMAT', 'C', 'AMT', 'BLK', 'BA', 'NOW', 'GE', 'CHTR', 'ISRG', 'TGT', 'EL', 'SBUX', 'SYK', 'MO', 'SPGI', 'ZTS', 'ADP', 'CB', 'BKNG', 'MDLZ', 'DUK', 'MU', 'CME', 'HCA', 'MMM', 'USB', 'ADI', 'PNC', 'CSX', 'TFC', 'MMC', 'CCI', 'TJX', 'SO', 'CI', 'GILD', 'BDX', 'ICE', 'EOG', 'FCX', 'NOC', 'REGN', 'NSC', 'LRCX', 'D', 'AON', 'EW', 'GD', 'PSA', 'ITW', 'F', 'EQIX', 'WM', 'ATVI', 'FISV', 'CL', 'PGR', 'NEM', 'SHW', 'SLB', 'GM', 'VRTX', 'BSX', 'ETN', 'FDX', 'PXD', 'MCO', 'MRNA', 'COF', 'EMR', 'FIS', 'OXY', 'HUM', 'MET', 'MAR', 'SRE', 'KLAC', 'APD', 'CNC', 'LHX', 'AEP', 'ILMN', 'DG', 'AIG', 'ADM', 'NXPI', 'CTSH', 'KHC', 'ROP', 'ECL', 'SNPS', 'ORLY', 'FTNT', 'DOW', 'APH', 'MPC', 'PAYX', 'SPG', 'EXC', 'HSY', 'JCI', 'ADSK', 'MCK', 'IDXX', 'TRV', 'TEL', 'CMG', 'KR', 'KMI', 'WBA', 'WELL', 'IQV', 'BK', 'CDNS', 'RSG', 'STZ', 'SYY', 'PRU', 'KMB', 'HLT', 'A', 'CTVA', 'BKR', 'AFL', 'DVN', 'WMB', 'MNST', 'O', 'DLR', 'BAX', 'AZO', 'MCHP', 'CTAS', 'XEL', 'HPQ', 'DXCM', 'GIS', 'VLO', 'MSI', 'DD', 'MSCI', 'ANET', 'CARR', 'NUE', 'GPN', 'PSX', 'ODFL', 'PH', 'RMD', 'TT', 'SBAC', 'TDG', 'EA', 'ALL', 'LYB', 'AVB', 'HAL', 'YUM', 'DLTR', 'PEG', 'EQR', 'AJG', 'TSN', 'ED', 'ALGN', 'SIVB', 'TROW', 'FAST', 'ROST', 'GLW', 'OTIS', 'ABC', 'ARE', 'AMP', 'IFF', 'FITB', 'STT', 'MTD', 'ROK', 'DFS', 'PCAR', 'WEC', 'WY', 'OKE', 'EBAY', 'VRSK', 'HES', 'AME', 'BF.B', 'CBRE', 'BIIB', 'ES', 'APTV', 'DHI', 'PPG', 'LVS', 'CMI', 'FRC', 'AWK', 'HRL', 'BLL', 'CPRT', 'CERN', 'EFX', 'NDAQ', 'WST', 'EXPE', 'KEYS', 'TWTR', 'EXR', 'WTW', 'MKC', 'ANSS', 'TSCO', 'LEN', 'MTCH', 'FE', 'ZBH', 'LH', 'EIX', 'DTE', 'LYV', 'GWW', 'MAA', 'SWK', 'LUV', 'VTR', 'URI', 'VMC', 'MLM', 'CHD', 'IT', 'FANG', 'CDW', 'ENPH', 'MOS', 'BBY', 'AEE', 'VRSN', 'MTB', 'HIG', 'STE', 'ESS', 'NTRS', 'ETR', 'DOV', 'ALB', 'HPE', 'FOX', 'FOXA', 'PARA', 'HBAN', 'KEY', 'GRMN', 'PKI', 'SWKS', 'CTRA', 'JBHT', 'VFC', 'RF', 'DRE', 'DAL', 'ZBRA', 'K', 'COO', 'FTV', 'RJF', 'ULTA', 'CF', 'TDY', 'CFG', 'CINF', 'IR', 'PPL', 'BXP', 'STX', 'CMS', 'WAT', 'CCL', 'NTAP', 'MPWR', 'MOH', 'SYF', 'PAYC', 'UDR', 'GNRC', 'CNP', 'FLT', 'POOL', 'TTWO', 'BRO', 'AKAM', 'MGM', 'PWR', 'SBNY', 'PEAK', 'RCL', 'TER', 'HOLX', 'GPC', 'CTLT', 'PFG', 'MRO', 'BR', 'EXPD', 'SEDG', 'WRB', 'AMCR', 'WAB', 'DRI', 'TYL', 'TRMB', 'INCY', 'DGX', 'OMC', 'J', 'CEG', 'NVR', 'NLOK', 'KMX', 'CZR', 'BIO', 'CLX', 'IP', 'ROL', 'DISH', 'TFX', 'TECH', 'FMC', 'FDS', 'ATO', 'ETSY', 'L', 'LNT', 'XYL', 'TXT', 'CE', 'AES', 'EVRG', 'IRM', 'KIM', 'CAH', 'CAG', 'IEX', 'HWM', 'LDOS', 'PKG', 'WDC', 'SJM', 'DPZ', 'BEN', 'EMN', 'APA', 'QRVO', 'AVY', 'JKHY', 'CHRW', 'CRL', 'ABMD', 'IPG', 'MKTX', 'MAS', 'HST', 'UHS', 'CPB', 'CTXS', 'LKQ', 'AAP', 'NDSN', 'NWS', 'NWSA', 'PTC', 'DISCA', 'DISCK', 'CBOE', 'VTRS', 'NI', 'BBWI', 'RHI', 'HAS', 'FFIV', 'HSIC', 'CMA', 'PHM', 'REG', 'WRK', 'EPAM', 'UAL', 'FBHS', 'TAP', 'SNA', 'LUMN', 'WHR', 'JNPR', 'RE', 'AOS', 'XRAY', 'DVA', 'LNC', 'ALLE', 'ZION', 'AIZ', 'GL', 'SEE', 'CDAY', 'NRG', 'FRT', 'IVZ', 'NWL', 'AAL', 'OGN', 'TPR', 'PNR', 'VNO', 'PBCT', 'BWA', 'MHK', 'WYNN', 'PNW', 'HII', 'RL', 'DXC', 'LW', 'PENN', 'UA', 'UAA', 'NLSN', 'ALK', 'IPGP', 'PVH', 'NCLH'];
    axios.get('api/login-set-cookie/')
    axios
      .get('api/user-profile/')
      .then(res => {
        this.setState({ loggedIn: true })
      })
      .catch(err => {
        this.setState({ loggedIn: false })
      })
    for (const symbol of list) {
      axios.post('api/add-stock/', {
        symbol: symbol
      })
    }
  }

  render() {
    if (this.state.loggedIn) {
      return <TabSystem checkLogin={this.checkLogin.bind(this)} />
    } else {
      return <Accounts checkLogin={this.checkLogin.bind(this)} />
    }
  }
}

export default App
