import { Add } from "@mui/icons-material";
import { Box, IconButton, colors, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { DashboardContext } from "../data/DashboardContextProvider";
import { tokens } from "../styles/theme";

// TODO: Implement adding views to the dashboard
const AddViewButton = () => {
    const { dashboard } = useContext(DashboardContext);

    const colors = tokens(useTheme().palette.mode);
    
    return (
        <Box
                    position="fixed"
                    bottom={16}
                    right={16}
                >
                    <IconButton
                    sx={{ backgroundColor: colors.primary['400'] }}
                        onClick={() => {
                            console.log('Add view');
                        }}>
                    
                        <Add />
                    </IconButton>
                </Box>
    );
}

export default AddViewButton;