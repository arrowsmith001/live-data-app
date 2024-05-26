import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../styles/theme";
import InputBase from "@mui/material/InputBase";
import { NotificationsOutlined, PersonOutlined, Search, SettingsOutlined, FiberManualRecord, FiberSmartRecord } from "@mui/icons-material";
import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";
import { useLatestData } from "../data/useServer";

const Topbar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);

    const latestData = useLatestData();

    return (
        <Box
            display='grid'
            flexDirection="column"
            gridTemplateColumns="repeat(12, 1fr)"
            gridAutoRows="140px"
            gap="20px"
            p={2}
            sx={{
                // backgroundColor: colors.primary[400],
                color: colors.grey[100],
                height: '60px',
                width: '100%',
                // boxShadow: '0px 2px 5px 0px rgba(0,0,0,0.75)',
                display: 'flex',
                justifyContent: 'space-between',
                alignContent: 'center',
                alignItems: 'center',
            }}>


            <Box gridColumn={0} gridRow={0} display="flex"
                width={'100%'}
                alignItems={'end'}
                justifyContent={'flex-end'}
            >
                <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === "dark" ? (
                        <DarkModeOutlined />
                    ) : (
                        <LightModeOutlined />
                    )}
                </IconButton>
                <IconButton>
                    <NotificationsOutlined />
                </IconButton>
                <IconButton>
                    <SettingsOutlined />
                </IconButton>
                <IconButton>
                    <PersonOutlined />
                </IconButton>
            </Box>

            <Box gridColumn={0} gridRow={1} display="flex"
                width={'100%'}
                alignItems={'end'}
                justifyContent={'flex-start'}>

            </Box>


            <Box
                gridRow={1}
                p={1}
                sx={{
                    backgroundColor: colors.primary[400],
                    width: '50%'
                }}
                display="flex"
                borderRadius="3px"
            >
                <FiberManualRecord color="error" />
                <Typography>{latestData?.data}</Typography>
                <Box
                    p={1}
                    sx={{
                        backgroundColor: colors.primary[400],
                        width: '25%'
                    }}
                    display="flex"
                    borderRadius="3px">
                    {latestData && <Typography>{new Date(latestData?.server_timestamp * 1000).toLocaleTimeString()}</Typography>}
                </Box>
            </Box>

        </Box>
    );
};

export default Topbar;