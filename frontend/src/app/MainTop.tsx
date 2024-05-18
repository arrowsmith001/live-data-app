import { AppBar, Icon, IconButton, Toolbar, Typography, Theme } from "@mui/material";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import clsx from "clsx";
import { useStyles } from "./useStyles";


interface MainTopProps {
    open: boolean;
    handleDrawerOpen: () => void;
}

export const drawerWidth = 400;

function MainTop({ ...props }: MainTopProps) {

    const styles = useStyles(props);


    return <AppBar
        position="fixed"
        className={clsx(styles.appBar)}
        sx={{ marginLeft: props.open ? drawerWidth : 0, width: `calc(100% - ${props.open ? drawerWidth : 0}px)` }}
    >
        <Toolbar>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={props.handleDrawerOpen}
                edge="start"
                className={styles.menuButton}
            >
                <Icon />
            </IconButton>
            <Typography variant="h6" noWrap>
                Dashboard
            </Typography>
        </Toolbar>
    </AppBar>
}

export default MainTop;