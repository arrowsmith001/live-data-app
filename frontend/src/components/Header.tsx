import { Typography, Box, useTheme, Grid } from "@mui/material";
import { tokens } from "../styles/theme";

const Header = ({ title, subtitle, icon }: { title: string, subtitle: string, icon?: JSX.Element }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <Grid container spacing={2} alignItems="start">

            <Grid m={1} item>
                {icon}
            </Grid>

            <Grid item xs>
                <Grid container direction="column">
                    <Typography
                        variant="h2"
                        color={colors.grey[100]}
                        fontWeight="bold"
                        sx={{ m: "0 0 5px 0" }}
                    >
                        {title}
                    </Typography>

                    <Typography variant="h5" color={colors.greenAccent[400]}>
                        {subtitle}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Header;