"use client"
import { motion } from "framer-motion";
import { fadeInOut } from "@/src/styles/motion/variants";
import Snackbar from "@mui/material/Snackbar";
import { JSX, SetStateAction, useEffect } from "react";
import { UseLoginHook } from "@/src/lib/types/types";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
const MotionSnackbar = motion(Snackbar);

type LoginSnackbarProps = {
    handleClose: () => void,
    status: UseLoginHook["loginStatus"],
    setLoginStatus: React.Dispatch<SetStateAction<UseLoginHook["loginStatus"]>>
}

function createLoginSnackbarMessage(loginStatus: UseLoginHook["loginStatus"]): string | null {

    switch (loginStatus) {
        case "success":
            return "Logged in successfully"
        case "pending":
            return "Logging in..."
        case "failed":
            return "Login failed"

        default:
            return null
    }
}

function LoginSnackbar({ handleClose, status, setLoginStatus }: LoginSnackbarProps): JSX.Element {
    const userKind = useSelector((s: RootState) => s.auth.userKind);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setLoginStatus("idle")
        }, 3000)

        return () => {
            clearTimeout(timer);;
        }

    }, [userKind])

    return (
        <MotionSnackbar
            variants={fadeInOut}
            open={(status !== "idle")}
            initial="initial"
            animate="animate"
            exit="exit"
            autoHideDuration={6000}

            message={createLoginSnackbarMessage(status)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        />
    );
};

export default LoginSnackbar;