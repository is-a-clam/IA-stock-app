import styled from 'styled-components';
import { Grid, Container } from 'semantic-ui-react';

export const StockListingRow = styled(Grid.Row) ({
  paddingTop: '0em !important',
  paddingBottom: '0.5em !important'
})

export const MyStocksContainer = styled(Container) ({
  width: '550px !important',
  height: '450px',
  margin: 'auto',
  borderRadius: '25px',
  borderStyle: 'solid',
  borderWidth: '2px',
  borderColor: '#202225',
  background: '#313131',
})
