import { AppBar, Icon, IconButton, Toolbar, Typography, Theme } from "@mui/material";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useAppStyles } from "../styles/AppStyles";
import clsx from "clsx";


interface MainTopProps {
    open: boolean;
    handleDrawerOpen: () => void;
    left: number;
}

const useStyles = makeStyles((theme) => ({
    appBarShift: (props: MainTopProps) => ({
        width: `calc(100% - ${props.left}px)`,
        marginLeft: props.left,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
}));


function MainTop({ ...props }: MainTopProps) {

    const appStyles = useAppStyles();
    const classes = useStyles(props);

    return <AppBar
        position="fixed"
        className={clsx(appStyles.appBar, {
            [classes.appBarShift]: props.open,
        })}
    >
        <Toolbar>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={props.handleDrawerOpen}
                edge="start"
                className={classes.menuButton}
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