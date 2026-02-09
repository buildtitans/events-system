import type { JSX } from 'react';
import RightAnchoredDrawerHost from "@/src/components/hosts/rightAnchoredDrawerHost";
import AlertsAndSnackbarsHost from "@/src/components/hosts/alertsAndSnackbarsHost";

export default function TopLayerHost(): JSX.Element {

    return (
        <>
            <RightAnchoredDrawerHost />
            <AlertsAndSnackbarsHost />
        </>
    )
}