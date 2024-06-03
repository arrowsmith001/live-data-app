import { useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Topbar from "./app/Topbar";
import Sidebar from "./app/Sidebar";
import { CssBaseline, Theme, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./styles/theme";
import { WebSocketProvider } from "./backlog/WebSocketContext";
import Connections from "./pages/Connections";
import Schemas from "./pages/Schemas";
import Dashboards from "./pages/Dashboards";

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
                  <Route path="/" element={<Dashboards />} />
                  <Route path="/connections" element={<Connections />} />
                  <Route path="/schemas" element={<Schemas />} />
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