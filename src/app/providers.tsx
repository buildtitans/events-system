"use client"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider } from "@mui/material/styles";
import { ReduxProvider } from '@/src/lib/store';
import type { PropsWithChildren } from 'react';
import { AppMountPipeline } from '../components/pipelines/mount/appMountPipeline';
import { SyncDomainsResult } from '../lib/types/server/types';
import SessionHydrator from '../components/hydration/sessionHydrator';

const theme = createTheme({
    palette: {
        info: {
            main: '#FFF'
        },
        mode: 'dark'
    }
});

type ProvidersProps = PropsWithChildren<{ domains: SyncDomainsResult}>

export default function Providers({
    children,
    domains
}: ProvidersProps) {

    return (
        <ReduxProvider domains={domains}>
            <StyledEngineProvider >
                <ThemeProvider
                    theme={theme}
                >
                    <CssBaseline enableColorScheme />
                    <SessionHydrator />
                    <AppMountPipeline
                    >
                        {children}
                    </AppMountPipeline>
                </ThemeProvider>
            </StyledEngineProvider>
        </ReduxProvider>
    );
}
