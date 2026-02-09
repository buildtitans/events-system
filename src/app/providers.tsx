"use client"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider } from "@mui/material/styles";
import { useEffect, useState } from 'react';
import type { MountStatus } from '@/src/lib/types/tokens/types';
import { ReduxProvider } from '@/src/lib/store';
import { DomainStateType } from '../lib/store/sync/syncDomains';
import type { PropsWithChildren } from 'react';
import { AppMountedPipeline } from '../components/pipelines/mount/appMountedPipeline';
import Spinner from '../components/ui/feedback/pending/spinner';

const theme = createTheme({
    palette: {

        info: {
            main: '#FFF'
        },
        mode: 'dark'
    }
});

type ProvidersProps = PropsWithChildren<{
    domains: DomainStateType
}>;

export default function Providers({
    children,
    domains
}: ProvidersProps) {
    const [status, setStatus] = useState<MountStatus>('idle');

    useEffect(() => setStatus('active'), []);

    return (
        <ReduxProvider>
            <StyledEngineProvider injectFirst>
                <ThemeProvider
                    theme={theme}
                >
                    <CssBaseline enableColorScheme />
                    {AppMountedPipeline(status, children, domains)}
                    {(status === "idle") && <Spinner />}
                </ThemeProvider>
            </StyledEngineProvider>
        </ReduxProvider>
    );
}
