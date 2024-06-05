import { Add } from "@mui/icons-material";
import { Box, Typography, Card, colors, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardInfo } from "../api/model";
import { tokens } from "../styles/theme";

const BrowseDashboards = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const navigate = useNavigate();

    const [dashboards, setDashboards] = useState<DashboardInfo[]>([]);

    useEffect(() => {
        // getDashboards().then((dashboards) => {
        //     setDashboards(dashboards);
        // });
    });

    
    return (
        <Box>

        <Typography variant="h1">Dashboards</Typography>


        {dashboards.length === 0 && (
            
            <Card
                sx={{ backgroundColor: colors.primary['400'], color: colors.grey['100'], padding: 2, height: '200px', width: '200px'}}
                onClick={() => {
                    navigate('add');
                }}
            >
                <Typography variant="h5">Add dashboard</Typography>
                <Add />
            </Card>
        
    )}

    {dashboards.map((dashboard, index) => (
            <Card
                sx={{ backgroundColor: colors.primary['400'], color: colors.grey['100'], padding: 2, height: '200px', width: '200px'}}
                onClick={() => {
                    console.log('Edit dashboard: ' + dashboard.id);
                }}
            >
                <Typography variant="h5">{dashboard.name}</Typography>
            </Card>
    ))}

        </Box>
    );
    };

export default BrowseDashboards;