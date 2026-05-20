import type { JSX } from 'react';
import RightAnchoredDrawerHost from "@/src/client/components/hosts/rightAnchoredDrawerHost";
import AlertsAndSnackbarsHost from "@/src/client/components/hosts/alertsAndSnackbarsHost";
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