import { useSelector } from 'react-redux';
import { snackbarPipeline } from '../pipelines/snackbars/snackbarPipeline';
import { modalPipeline } from '../pipelines/modals/modalPipeline';
import type { RootState } from '@/src/lib/store';
import React from 'react';
import { alertsPipeline } from '../pipelines/alerts/alertsPipeline';
import { AnimatePresence } from 'framer-motion';
import CreateEventDrawer from '../ui/drawers/createEventDrawer';

export default function TopLayerHost(): React.ReactNode {
    const snackbar = useSelector((s: RootState) => s.rendering.snackbar);
    const modal = useSelector((s: RootState) => s.rendering.modal);
    const alert = useSelector((s: RootState) => s.rendering.alert);
    const drawer = useSelector((s: RootState) => s.rendering.drawer);

    return (
        <>
            <CreateEventDrawer open={drawer === "create event"} />
            {modalPipeline(modal)}
            <AnimatePresence mode='wait'>
                {(alert.action !== null) && alertsPipeline(alert)}
                {snackbarPipeline(snackbar.kind, snackbar.status)}
            </AnimatePresence>
        </>
    )
}