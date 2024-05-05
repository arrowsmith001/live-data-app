import React from 'react';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import logo from './logo.svg';
import './App.css';

const API_BASE_URL = 'http://localhost:5000';
const WS_URL = 'ws://localhost:5000/ws';

function App() {

  const { sendMessage, lastMessage, readyState } = useWebSocket(WS_URL);


  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          ${connectionStatus} ${lastMessage ? lastMessage.data : '...'}
        </a>
      </header>
    </div>
  );
}

export default App;
