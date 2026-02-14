import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { LoadingStatus } from '@/src/lib/types/tokens/types';
import React from 'react';

type SimpleBackdropProps = {
    status: LoadingStatus
};

export default function SimpleBackdrop({ status }: SimpleBackdropProps): React.ReactNode {

    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={(status === "pending")}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};