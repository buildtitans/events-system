"use client";
import { motion } from "framer-motion";
import { fadeInOut } from "@/src/styles/motion/variants";
import Snackbar from "@mui/material/Snackbar";
import { JSX, useEffect } from "react";
import type { RequestStatus, SnackbarMessages } from "@/src/lib/types/tokens/types";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/src/lib/store";
import { createSnackbarMessages } from "@/src/lib/utils/helpers/createSnackbarMessage";
import { enqueueSnackbar } from "@/src/lib/store/slices/rendering/RenderingSlice";

const MotionSnackbar = motion(Snackbar);

type AuthenticatonSnackbarProps = {
    status: RequestStatus;
    statusKind: keyof SnackbarMessages;
};

function AuthenticatonSnackbar({
    status,
    statusKind,
}: AuthenticatonSnackbarProps): JSX.Element {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (status === "pending") return;

        const timer = window.setTimeout(() => {
            dispatch(enqueueSnackbar({ kind: null, status: "idle" }));
        }, 2500);

        return () => clearTimeout(timer);
    }, [status, dispatch]);

    return (
        <MotionSnackbar
            variants={fadeInOut}
            open={status !== "idle"}
            initial="initial"
            animate="animate"
            exit="exit"
            message={createSnackbarMessages(statusKind, status)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        />
    );
}

export default AuthenticatonSnackbar;
