'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppAppBar from '../components/layout/nav/AppBar';
import { StyledEngineProvider } from "@mui/material/styles";


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
    return (
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <StyledEngineProvider injectFirst
            >
                <ThemeProvider theme={theme}>
                    <CssBaseline enableColorScheme />
                    <AppAppBar />
                    <Container
                        maxWidth="lg"
                        component="main"
                        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
                    >
                        {children}

                    </Container>
                </ThemeProvider>

            </StyledEngineProvider>
        </AppRouterCacheProvider>
    );
}
