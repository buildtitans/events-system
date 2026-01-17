"use client"
import { motion } from "framer-motion";
import { fadeInOut } from "@/src/styles/motion/variants";
import Snackbar from "@mui/material/Snackbar";
import { JSX, useEffect } from "react";
import type { RequestStatus, SnackbarMessages } from "@/src/lib/types/types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/lib/store";
import { createSnackbarMessages } from "@/src/lib/utils/createSnackbarMessage";
<<<<<<< HEAD
import { ActionCreatorWithPayload, PayloadActionCreator } from "@reduxjs/toolkit";
=======
import { enqueueSnackbar } from "@/src/lib/store/slices/RenderingSlice";
>>>>>>> 97a54ef (rendering pipeline for snackbars + modals in <TopLayerHost/>)
const MotionSnackbar = motion(Snackbar);

type AuthenticatonSnackbarProps = {
    status: RequestStatus,
    statusKind: keyof SnackbarMessages,
<<<<<<< HEAD
    action: ActionCreatorWithPayload<RequestStatus>
}

function AuthenticatonSnackbar({ status, statusKind, action }: AuthenticatonSnackbarProps): JSX.Element {
=======
}

function AuthenticatonSnackbar({ status, statusKind }: AuthenticatonSnackbarProps): JSX.Element | null {

>>>>>>> 97a54ef (rendering pipeline for snackbars + modals in <TopLayerHost/>)
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (status === "pending") return;

        const timer = window.setTimeout(() => {
<<<<<<< HEAD
            dispatch(action("idle"));
=======
            dispatch(enqueueSnackbar({ kind: null, status: 'idle' }));
>>>>>>> 97a54ef (rendering pipeline for snackbars + modals in <TopLayerHost/>)

        }, 2500);

        return () => clearTimeout(timer);

    }, [status])


    return (
        <MotionSnackbar

            variants={fadeInOut}
            open={(status !== "idle")}
            initial="initial"
            animate="animate"
            exit="exit"
<<<<<<< HEAD
            autoHideDuration={6000}

=======
>>>>>>> 97a54ef (rendering pipeline for snackbars + modals in <TopLayerHost/>)
            message={createSnackbarMessages(statusKind, status)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} />
    )
}


export default AuthenticatonSnackbar;