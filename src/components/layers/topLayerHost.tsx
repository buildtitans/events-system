import type { JSX } from 'react';
import RightAnchoredDrawerHost from "@/src/components/hosts/rightAnchoredDrawerHost";
import AlertsAndSnackbarsHost from '../hosts/AlertsAndSnackbarsHost';
import ModalHost from '../hosts/modalHost';

export default function TopLayerHost(): JSX.Element {

    return (
        <>
            <RightAnchoredDrawerHost />
            <AlertsAndSnackbarsHost />
            <ModalHost />
        </>
    )
}