import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useValidateSignupCredentials } from '@/src/lib/hooks/auth/useValidateSignupCredentials';
import { useRequestPasswordReset } from '@/src/lib/hooks/auth/useRequestPasswordReset';
import type { SetStateAction } from 'react';
import {
    authDialogActionsSx,
    authDialogContentSx,
    authDialogInputSx,
    authDialogPaperSx,
    authDialogTextSx,
    authDialogTitleSx,
    authPrimaryButtonSx,
    authSecondaryButtonSx,
} from '@/src/styles/sx/authDrawer';

interface ForgotPasswordProps {
    open: boolean;
    setOpen: React.Dispatch<SetStateAction<boolean>>;
    handleClose: () => void;
}

export default function ForgotPassword({ open, handleClose, setOpen }: ForgotPasswordProps) {
    const { errors, handleEmailInput, email } = useValidateSignupCredentials();
    const { submitPasswordResetRequest } = useRequestPasswordReset({
        emailError: errors.invalidEmail,
        email,
        setOpen
    });


    return (
        <Dialog
            open={open}
            onClose={handleClose}
            slotProps={{
                paper: {
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        handleClose();
                    },
                    sx: authDialogPaperSx,
                },
            }}
        >
            <DialogTitle sx={authDialogTitleSx}>Reset password</DialogTitle>
            <DialogContent
                sx={authDialogContentSx}
            >
                <DialogContentText sx={authDialogTextSx}>
                    Enter your account&apos;s email address, and we&apos;ll send you a link to
                    reset your password.
                </DialogContentText>
                <OutlinedInput
                    onChange={handleEmailInput}
                    autoFocus
                    required
                    margin="dense"
                    id="email"
                    name="email"
                    label="Email address"
                    placeholder="Email address"
                    type="email"
                    fullWidth
                    sx={authDialogInputSx}
                />
            </DialogContent>
            <DialogActions sx={authDialogActionsSx}>
                <Button onClick={handleClose} sx={authSecondaryButtonSx}>Cancel</Button>
                <Button 
                onClick={submitPasswordResetRequest}
                variant="contained"
                sx={authPrimaryButtonSx}
                type="button">
                    Continue
                </Button>
            </DialogActions>
        </Dialog>
    );
}
