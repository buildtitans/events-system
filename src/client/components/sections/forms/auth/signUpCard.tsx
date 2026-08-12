"use client";
import AuthDrawerShell from "@/src/client/components/ui/drawers/authDrawerShell";
import {
  authCheckboxLabelSx,
  authCheckboxSx,
  authDrawerFormSx,
  authFieldControlSx,
  authFieldLabelSx,
  authPrimaryButtonSx,
  authTextFieldSx,
} from "@/src/client/styles/sx/authDrawer";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import { useSignUpForm } from "@/src/lib/hooks/auth/credentials/useSignUpForm";

export default function SignUpCard() {
  const { fields, errors, authError, isPending, onSubmit } = useSignUpForm();

  return (
    <AuthDrawerShell
      eyebrow="Get Started"
      title="Sign up"
      description="Create an account to RSVP, join communities, and manage your event activity in one place."
    >
      <Box
        component="form"
        method="POST"
        noValidate
        onSubmit={onSubmit}
        sx={authDrawerFormSx}
      >
        <FormControl fullWidth sx={authFieldControlSx}>
          <FormLabel htmlFor="signup-email" sx={authFieldLabelSx}>
            Email
          </FormLabel>
          <TextField
            {...fields.email}
            inputRef={fields.email.inputRef}
            id="signup-email"
            type="email"
            placeholder="your@email.com"
            autoComplete="email"
            autoFocus
            required
            fullWidth
            variant="outlined"
            sx={authTextFieldSx}
            error={Boolean(errors.email) || Boolean(authError)}
            helperText={errors.email?.message ?? authError}
          />
        </FormControl>

        <FormControl fullWidth sx={authFieldControlSx}>
          <FormLabel htmlFor="signup-password" sx={authFieldLabelSx}>
            Create Password
          </FormLabel>
          <TextField
            {...fields.password}
            inputRef={fields.password.inputRef}
            id="signup-password"
            type="password"
            placeholder="Create a password"
            autoComplete="new-password"
            required
            fullWidth
            variant="outlined"
            sx={authTextFieldSx}
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
          />
        </FormControl>

        <FormControl fullWidth sx={authFieldControlSx}>
          <FormLabel htmlFor="confirm-password" sx={authFieldLabelSx}>
            Confirm Password
          </FormLabel>
          <TextField
            {...fields.confirmation}
            inputRef={fields.confirmation.inputRef}
            id="confirm-password"
            type="password"
            placeholder="Confirm your password"
            autoComplete="new-password"
            required
            fullWidth
            variant="outlined"
            sx={authTextFieldSx}
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword?.message}
          />
        </FormControl>

        <FormControlLabel
          sx={authCheckboxLabelSx}
          control={<Checkbox value="remember" sx={authCheckboxSx} />}
          label="Remember me"
        />
        <Button
          type="submit"
          fullWidth
          sx={authPrimaryButtonSx}
          variant="contained"
          loading={isPending}
        >
          Sign up
        </Button>
      </Box>
    </AuthDrawerShell>
  );
}
