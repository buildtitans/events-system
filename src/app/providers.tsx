"use client"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider } from "@mui/material/styles";
import { ReduxProvider } from '@/src/lib/store';
import { SyncDomainsResult } from '@/src/lib/types/server/types';
import type { PropsWithChildren } from 'react';
import { AppMountPipeline } from '../components/pipelines/mount/appMountPipeline';

const theme = createTheme({
    palette: {
        info: {
            main: '#FFF'
        },
        mode: 'dark'
    }
});

type ProvidersProps = PropsWithChildren<{
    domains: SyncDomainsResult
}>;

export default function Providers({
    children,
    domains
}: ProvidersProps) {

    return (
        <ReduxProvider>
            <StyledEngineProvider >
                <ThemeProvider
                    theme={theme}
                >
                    <CssBaseline enableColorScheme />
                    <AppMountPipeline

                        domains={domains}
                    >
                        {children}
                    </AppMountPipeline>
                </ThemeProvider>
            </StyledEngineProvider>
        </ReduxProvider>
    );
}
