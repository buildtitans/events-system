import { useSelector } from 'react-redux';
import { snackbarPipeline } from '../pipelines/snackbars/snackbarPipeline';
import { ModalPipeline } from '../pipelines/modals/modalPipeline';
import type { RootState } from '@/src/lib/store';
import React from 'react';
import { alertsPipeline } from '../pipelines/alerts/alertsPipeline';
import { AnimatePresence } from 'framer-motion';
import RightAnchoredDrawer from '../ui/drawers/rightAnchoredDrawer';

export default function TopLayerHost(): React.ReactNode {
    const snackbar = useSelector((s: RootState) => s.rendering.snackbar);
    const modal = useSelector((s: RootState) => s.rendering.modal);
    const alert = useSelector((s: RootState) => s.rendering.alert);

    return (
        <>
            <RightAnchoredDrawer />

            {ModalPipeline(modal)}
            <AnimatePresence mode='wait'>
                {(alert.action !== null) && alertsPipeline(alert)}
                {snackbarPipeline(snackbar.kind, snackbar.status)}
            </AnimatePresence>
        </>
    )
}