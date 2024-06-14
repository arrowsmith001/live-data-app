import { ThemeProvider, Theme } from "@emotion/react";
import { Box, Container, CssBaseline } from "@mui/material";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Topbar from "./app/Topbar";
import { WebSocketProvider } from "./deprecated/WebSocketContext";
import { useMode, ColorModeContext } from "./styles/theme";
import Sidebar from "./app/Sidebar";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DataContext, DataContextProvider } from "./data/DataContextProvider";
import Connections from "./pages/Connections";
import AddDashboard from "./pages/dashboards/AddDashboard";
import BrowseDashboards from "./pages/dashboards/BrowseDashboards";
import Dashboards from "./pages/dashboards/Dashboards";
import AddSchema from "./pages/schemas/AddSchema";
import BrowseSchemas from "./pages/schemas/BrowseSchemas";
import Schemas from "./pages/schemas/Schemas";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState('20vw'); // Set the initial sidebar width here

  return (
    <ColorModeContext.Provider value={colorMode as { toggleColorMode: () => void; }}>
      <ThemeProvider theme={theme as Theme}>
        <DndProvider backend={HTML5Backend}>
        <CssBaseline />
        <DataContextProvider>
          <BrowserRouter>
            <Box sx={{width: '100%', height:'100%', flexDirection: 'row', display: 'flex'}}>
              <Sidebar width={sidebarWidth} />


              <Box sx={{width: '100%', height:'100%', flexDirection: 'column', display: 'flex'}}>
                <Topbar />


                <Routes>
                  <Route path="dashboards" element={<Dashboards />}>
                    <Route index element={<BrowseDashboards />} />
                    <Route path="add" element={<AddDashboard/>} />

                  </Route>
                  <Route path="connections" element={<Connections />} />

                  <Route path="schemas" element={<Schemas />}>
                    <Route index element={<BrowseSchemas />} />
                    <Route path="add" element={<AddSchema/>} />

                  </Route>
                </Routes>
                
            </Box>
            </Box>
{/* <Sidebar width={sidebarWidth} /> */}
          </BrowserRouter>
          </DataContextProvider>
          </DndProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}


export default App;