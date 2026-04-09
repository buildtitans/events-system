"use client"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider } from "@mui/material/styles";
import { ReduxProvider } from '@/src/lib/store';
import {type PropsWithChildren } from 'react';
import { AppMountPipeline } from '../components/pipelines/mount/appMountPipeline';
import AppBootstrapHydrator from '../components/hydration/AppBootstrapHydrator';

const theme = createTheme({
    palette: {
        info: {
            main: '#FFF'
        },
        mode: 'dark'
    }
});

type ProvidersProps = PropsWithChildren

export default function Providers({
    children
}: ProvidersProps) {

    return (
        <ReduxProvider>
            <StyledEngineProvider >
                <ThemeProvider
                    theme={theme}
                >
                    <CssBaseline enableColorScheme />
                    <AppBootstrapHydrator
            />
                    <AppMountPipeline
                    >
                        {children}
                    </AppMountPipeline>
                </ThemeProvider>
            </StyledEngineProvider>
        </ReduxProvider>
    );
}
