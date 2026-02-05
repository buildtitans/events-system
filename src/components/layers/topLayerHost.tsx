import { useSelector } from 'react-redux';
import { snackbarPipeline } from '../pipelines/snackbars/snackbarPipeline';
import { modalPipeline } from '../pipelines/modals/modalPipeline';
import type { RootState } from '@/src/lib/store';
import React from 'react';
import { alertsPipeline } from '../pipelines/alerts/alertsPipeline';
import { AnimatePresence } from 'framer-motion';
import CreateEventDrawer from '../ui/drawers/createEventDrawer';
import OpenedEventDrawer from '../ui/drawers/openedEventDrawer';

export default function TopLayerHost(): React.ReactNode {
    const userKind = useSelector((s: RootState) => s.auth.userKind);
    const snackbar = useSelector((s: RootState) => s.rendering.snackbar);
    const modal = useSelector((s: RootState) => s.rendering.modal);
    const alert = useSelector((s: RootState) => s.rendering.alert);
    const createEventDrawer = useSelector((s: RootState) => s.rendering.drawer);
    const openedEventDrawerStatus = useSelector((s: RootState) => s.eventDrawer.status);


    return (
        <>
            <OpenedEventDrawer
                open={(openedEventDrawerStatus === "active")}
            />
            <CreateEventDrawer
                open={createEventDrawer === "create event"}
            />

            {modalPipeline(modal)}
            <AnimatePresence mode='wait'>
                {(alert.action !== null) && alertsPipeline(alert)}
                {snackbarPipeline(snackbar.kind, snackbar.status)}
            </AnimatePresence>
        </>
    )
}