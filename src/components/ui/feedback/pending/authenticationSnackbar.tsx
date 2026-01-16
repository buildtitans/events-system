"use client"
import { motion } from "framer-motion";
import { fadeInOut } from "@/src/styles/motion/variants";
import Snackbar from "@mui/material/Snackbar";
import { JSX, useEffect } from "react";
import type { RequestStatus, SnackbarMessages } from "@/src/lib/types/types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/lib/store";
import { createSnackbarMessages } from "@/src/lib/utils/createSnackbarMessage";
import { ActionCreatorWithPayload, PayloadActionCreator } from "@reduxjs/toolkit";
const MotionSnackbar = motion(Snackbar);

type AuthenticatonSnackbarProps = {
    status: RequestStatus,
    statusKind: keyof SnackbarMessages,
    action: ActionCreatorWithPayload<RequestStatus>
}

function AuthenticatonSnackbar({ status, statusKind, action }: AuthenticatonSnackbarProps): JSX.Element {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (status === "pending") return;

        const timer = window.setTimeout(() => {
            dispatch(action("idle"));

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
            autoHideDuration={6000}

            message={createSnackbarMessages(statusKind, status)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} />
    )
}


export default AuthenticatonSnackbar;