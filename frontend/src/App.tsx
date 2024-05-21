import logo from './logo.svg';
import './App.css';
import Home from './app/Home';
import { StyledEngineProvider, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark'
  }
});

function App() {

  return (
    <ThemeProvider theme={theme}>
      {/* <StyledEngineProvider injectFirst> */}
      <div className="App">
        <header className="App-header">
          <Home />
        </header>
      </div>
      {/* </StyledEngineProvider> */}
    </ThemeProvider>
  );
}

export default App;
