import { useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Topbar from "./app/Topbar";
import Sidebar from "./app/Sidebar";
import Dashboard from "./app/Dashboard";
import { CssBaseline, Theme, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./styles/theme";
import { WebSocketProvider } from "./data/WebSocketContext";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode as { toggleColorMode: () => void; }}>
      <ThemeProvider theme={theme as Theme}>
        <CssBaseline />
        <WebSocketProvider>
          <BrowserRouter>
            <div className="app">
              <Sidebar />
              <main className="content">
                <Topbar />
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </WebSocketProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;