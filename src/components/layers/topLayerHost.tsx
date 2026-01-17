import { useSelector } from 'react-redux';
import { snackbarPipeline } from '../pipelines/snackbars/snackbarPipeline';
import { modalPipeline } from '../pipelines/modals/modalPipeline';
import type { RootState } from '@/src/lib/store';
import React from 'react';


export default function TopLayerHost(): React.ReactNode {
    const snackbar = useSelector((s: RootState) => s.rendering.snackbar);
    const modal = useSelector((s: RootState) => s.rendering.modal);
    return (
        <>
            {modalPipeline(modal)}
            {snackbarPipeline(snackbar.kind, snackbar.status)}
        </>
    )

}