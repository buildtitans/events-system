import type { JSX } from 'react';
import RightAnchoredDrawer from '../ui/drawers/rightAnchoredDrawer';
import AlertsAndSnackbarsShell from '../shell/AlertsAndSnackbarsShell';

export default function TopLayerHost(): JSX.Element {

    return (
        <>
            <RightAnchoredDrawer />
            <AlertsAndSnackbarsShell />
        </>
    )
}