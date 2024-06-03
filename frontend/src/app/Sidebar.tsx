import { useState } from "react";
import { Sidebar as ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { tokens } from "../styles/theme";
import { Add, BarChartOutlined, CalendarViewDayOutlined, ContactsOutlined, Dashboard, Delete, Edit, HelpOutlineOutlined, HomeOutlined, MenuOutlined, PeopleOutline, PeopleOutlined, PersonOutlined, ReceiptOutlined, Schema, SettingsInputAntenna } from "@mui/icons-material";
// import "react-pro-sidebar/dist/styles";

type ItemArgs = {
    title: string;
    to: string;
    icon: JSX.Element;
    selected: string;
    setSelected: (title: string) => void;
};

const Item = ({ title, to, icon, selected, setSelected }: ItemArgs) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const navigate = useNavigate();
    return (
        <MenuItem
            active={selected === title}
            style={{
                color: colors.grey[100],
            }}
            onClick={() => { setSelected(title); navigate(to); }}
            icon={icon}
        >
            <Typography>{title}</Typography>
            {/* <Link to={to} /> */}
        </MenuItem>
    );
};

const Sidebar = ({ isSidebar }: { isSidebar?: boolean }) => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selected, setSelected] = useState("Dashboard");

    return (
        <Box
        >
            <ProSidebar
                rootStyles={{
                    height: '100vh',
                }}
                width="350px"

                backgroundColor={colors.primary[400]}
                collapsed={isCollapsed}>
                <Menu
                    rootStyles={
                        { borderColor: "transparent" }
                    }
                    menuItemStyles={{
                        root: {
                            // the default style for the menu items
                            padding: "5px 35px 5px 20px",
                            [`&:hover`]: {
                                backgroundColor: '#13395e',
                                color: '#868dfb',
                                padding: "5px 35px 5px 20px"
                            }
                        },
                        button: {
                            // the active class will be added automatically by react router
                            // so we can use it to style the active menu item
                            [`&.active`]: {
                                backgroundColor: '#13395e',
                                color: '#b6c8d9',
                                padding: "5px 35px 5px 20px"
                            },
                            [`&:hover`]: {
                                backgroundColor: '#13395e',
                                color: '#868dfb',
                                padding: "5px 35px 5px 20px"
                            }
                        },
                        icon: {
                            // the default style for the icons
                            backgroundColor: "transparent",
                        },
                    }}

                >
                    <MenuItem
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        icon={isCollapsed ? <MenuOutlined /> : undefined}
                        style={{
                            margin: "10px 0 20px 0",
                            color: colors.grey[100],
                        }}
                    >
                        {!isCollapsed && (
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                ml="15px"
                            >
                                <Typography variant="h3" color={colors.grey[100]}>
                                    LIVE DATA APP
                                </Typography>
                                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                                    <MenuOutlined />
                                </IconButton>
                            </Box>
                        )}
                    </MenuItem>

                    {!isCollapsed && (
                        <Box mb="25px">
                        </Box>
                    )}

                    <Box paddingLeft={isCollapsed ? undefined : "10%"}>


                        <Item
                            title="Dashboards"
                            to="/"
                            icon={<Dashboard />}
                            selected={selected}
                            setSelected={setSelected}
                        />


                        <Item
                            title="Connections"
                            to="/connections"
                            icon={<SettingsInputAntenna />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Schemas"
                            to="/schemas"
                            icon={<Schema />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                    </Box>
                </Menu>
            </ProSidebar>
        </Box>
    );
};

export default Sidebar;