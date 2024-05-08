import logo from './logo.svg';
import './App.css';
import Home from './app/Home';
import { StyledEngineProvider } from '@mui/material';


function App() {

  return (
    <StyledEngineProvider injectFirst>
      <div className="App">
        <header className="App-header">
          <Home />
        </header>
      </div>
    </StyledEngineProvider>

  );
}

export default App;
