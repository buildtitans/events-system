"use client"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppAppBar from '@/src/components/ui/nav/AppBar';
import { StyledEngineProvider } from "@mui/material/styles";
import { useEffect, useState } from 'react';
import type { MountStatus } from '@/src/lib/types/types';
import { ReduxProvider } from '@/src/lib/store';
import TopLayerHost from '../components/layers/topLayerHost';
import { stat } from 'fs';
import CreateEventDrawer from '../components/ui/drawers/createEventDrawer';

const theme = createTheme({
    palette: {

        info: {
            main: '#FFF'
        },
        mode: 'dark'
    }
});

export default function Providers({
    children,
}: {
    children: React.ReactNode;
}) {
    const [status, setStatus] = useState<MountStatus>('idle');

    useEffect(() => setStatus('active'), []);

    return (
        <ReduxProvider>
            <StyledEngineProvider injectFirst>
                <ThemeProvider
                    theme={theme}
                >
                    <CssBaseline enableColorScheme />
                    {(status === 'active') &&
                        <AppAppBar
                            key="navigation_bar"
                        />
                    }
                    {(status === "active") && <TopLayerHost />}

                    {(status === 'active') &&
                        <Container
                            key="content_container"
                            maxWidth="lg"
                            component="main"
                            sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
                        >
                            {children}
                        </Container>
                    }
                </ThemeProvider>
            </StyledEngineProvider>
        </ReduxProvider>
    );
}
