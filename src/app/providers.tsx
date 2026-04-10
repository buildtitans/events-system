"use client"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider } from "@mui/material/styles";
import { ReduxProvider } from '@/src/lib/store';
import type { PropsWithChildren } from 'react';
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

type ProvidersProps = PropsWithChildren

export default function Providers({
    children,
}: ProvidersProps) {

    return (
        <ReduxProvider >
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
