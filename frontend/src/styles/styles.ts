import { SxProps, useTheme } from "@mui/material";
import { tokens } from "./theme";


export const rowStyle : SxProps = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
}

export const columnStyle : SxProps = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%'
}


export const useColors = () => {
    return tokens(useTheme().palette.mode);
}