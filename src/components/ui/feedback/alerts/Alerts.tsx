"use client";
import Alert from '@mui/material/Alert';
import { JSX, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fadeInOut } from '@/src/styles/motion/variants';
import { AlertProps } from '@mui/material/Alert';
import { AlertMessagesType } from '@/src/lib/types/types';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/src/lib/store';
import { enqueueAlert } from '@/src/lib/store/slices/RenderingSlice';
const MotionSuccessAlert = motion.create(Alert);

type AlertResultProperties = {
    variant: AlertProps["variant"],
    severity: AlertProps["severity"],
    message: AlertMessagesType["message"] | null
}

export function AlertResult({ variant, severity, message }: AlertResultProperties): JSX.Element {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const timer = window.setTimeout(() => {

            dispatch(enqueueAlert(
                {
                    action: null,
                    kind: null,
                }
            ));
        }, 6000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <MotionSuccessAlert
            key="alert"
            variants={fadeInOut}
            initial="initial"
            animate="animate"
            exit="exit"
            sx={{
                position: 'fixed',
                bottom: 20,
                right: 200,
                left: 200,
                zIndex: 100
            }} variant={variant} severity={severity}>
            {message}
        </MotionSuccessAlert>
    )
}