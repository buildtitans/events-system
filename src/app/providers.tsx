"use client"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider } from "@mui/material/styles";
import { ReduxProvider } from '@/src/lib/store';
import type { PropsWithChildren } from 'react';
import { SyncDomainsResult } from '../lib/types/server/types';
import SessionHydrator from '../components/hydration/sessionHydrator';
import ClientComponentsShell from '../components/shell/ClientComponentsShell';

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
                    <ClientComponentsShell>
                        {children}
                    </ClientComponentsShell>
                </ThemeProvider>
            </StyledEngineProvider>
        </ReduxProvider>
    );
}
