import { Add, HelpOutlineOutlined } from "@mui/icons-material";
import { Box, Typography, Card, colors, useTheme, Grid, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardInfo } from "../../api/model";
import { tokens } from "../../styles/theme";

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
        <Box p={8}>

        <Typography variant="h2">Dashboards</Typography>


        <Grid container spacing={4} p={4}>

        {dashboards.length === 0 && (
            
            <Grid item>
                {/* border: '0.5px solid', borderColor: colors.grey['100'],  */}
                <Card
                sx={{ 
                    backgroundColor: 'transparent', color: colors.primary['100'], 
                    borderRadius: '16px',
                    padding: 2, height: '200px', width: '200px', alignItems: 'center', justifyItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    cursor: 'pointer', '&:hover': {backgroundColor: colors.primary['400']}}}
                elevation={6}
                onClick={() => {
                    navigate('add');
                }}
                 >
                <Typography variant="h3" align="center">Add dashboard</Typography>
                <Add sx={{height: '30px', width: '30px'}} />
                </Card>
            </Grid>
        
    )}

    {dashboards.map((dashboard, index) => (
            <Grid item>
            <Card
                sx={{ backgroundColor: colors.primary['400'], color: colors.grey['100'], padding: 2, height: '200px', width: '200px'}}
                onClick={() => {
                    console.log('Edit dashboard: ' + dashboard.id);
                }}
            >
                <Typography variant="h5">{dashboard.name}</Typography>
            </Card>
            </Grid>
    ))}

        </Grid>

        </Box>
    );
    };

export default BrowseDashboards;