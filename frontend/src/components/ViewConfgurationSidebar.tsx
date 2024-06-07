import { useState } from "react";
import { Sidebar as ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { tokens } from "../styles/theme";
import AddDataViewPanel from "./AddDataViewPanel";
import EditViewPanel from "./EditViewPanel";
// import "react-pro-sidebar/dist/styles";



const ViewConfigurationSidebar = ({ width, isCollapsed }: { width: number, isCollapsed: boolean  }) => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box height={'100%'}
        >
            <ProSidebar
                rootStyles={{
                    height: '100%',
                }}
                
                width={width + "px"}
                backgroundColor={colors.primary[400]}
                collapsed={false}
                collapsedWidth="0"
                >
<Box >

{!isCollapsed &&  <EditViewPanel  />}
</Box>
<Box >
                   <AddDataViewPanel orientation={'vertical'} />
</Box>
                
            </ProSidebar>
        </Box>
    );
};

export default ViewConfigurationSidebar;