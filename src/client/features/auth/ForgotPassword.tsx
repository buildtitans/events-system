import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useRequestPasswordReset } from "@/src/lib/hooks/auth/credentials/useRequestPasswordReset";
import {
  authDialogActionsSx,
  authDialogContentSx,
  authDialogInputSx,
  authDialogPaperSx,
  authDialogTextSx,
  authDialogTitleSx,
  authPrimaryButtonSx,
  authSecondaryButtonSx,
} from "@/src/client/styles/sx/authDrawer";

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export default function ForgotPassword({
  open,
  handleClose,
}: ForgotPasswordProps) {
  const { emailField, emailError, isPending, onSubmit } =
    useRequestPasswordReset({ onSuccess: handleClose });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: "form",
          onSubmit,
          sx: authDialogPaperSx,
        },
      }}
    >
      <DialogTitle sx={authDialogTitleSx}>Reset password</DialogTitle>
      <DialogContent sx={authDialogContentSx}>
        <DialogContentText sx={authDialogTextSx}>
          Enter your account&apos;s email address, and we&apos;ll send you a
          link to reset your password.
        </DialogContentText>
        <FormControl error={Boolean(emailError)} fullWidth>
          <OutlinedInput
            {...emailField}
            inputRef={emailField.inputRef}
            autoFocus
            required
            margin="dense"
            id="reset-email"
            label="Email address"
            placeholder="Email address"
            type="email"
            autoComplete="email"
            fullWidth
            sx={authDialogInputSx}
          />
          {emailError && <FormHelperText>{emailError}</FormHelperText>}
        </FormControl>
      </DialogContent>
      <DialogActions sx={authDialogActionsSx}>
        <Button
          onClick={handleClose}
          sx={authSecondaryButtonSx}
          type="button"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={authPrimaryButtonSx}
          type="submit"
          loading={isPending}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
