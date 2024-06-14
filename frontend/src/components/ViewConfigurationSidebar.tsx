import { useContext, useState } from "react";
import { Sidebar as ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { tokens } from "../styles/theme";
import AddDataViewPanel from "./AddDataViewPanel";
import EditViewPanel from "./EditViewPanel";
import { DashboardEditContext } from "../data/DashboardEditContextProvider";
// import "react-pro-sidebar/dist/styles";



const ViewConfigurationSidebar = ({ width }: { width: number }) => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const { selectedView } = useContext(DashboardEditContext);

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

{selectedView.isEditing 
&& selectedView.id !== undefined 
&& selectedView.id >= 0 
&& <EditViewPanel />}
</Box>
<Box >
                   <AddDataViewPanel orientation={'vertical'} />
</Box>
                
            </ProSidebar>
        </Box>
    );
};

export default ViewConfigurationSidebar;