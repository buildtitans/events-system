"use client";

import { useResetPassword } from "@/src/lib/hooks/auth/credentials/useResetPassword";
import { authTextFieldSx } from "@/src/client/styles/sx/authDrawer";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

type ResetPasswordFormProps = {
  token: string | null;
};

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const { fields, errors, isPending, isComplete, onSubmit } =
    useResetPassword(token ?? "");

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 8, md: 12 } }}>
      <Stack spacing={3}>
        <Box>
          <Typography
            component="h1"
            variant="h3"
            fontWeight="light"
            gutterBottom
          >
            Reset your password
          </Typography>
          <Typography color="text.secondary">
            Enter a new password for your account. This reset link expires after
            15 minutes.
          </Typography>
        </Box>

        {!token && (
          <Alert severity="error">
            This password reset link is missing a token. Request a new reset
            email and try again.
          </Alert>
        )}

        <Box
          component="form"
          noValidate
          onSubmit={onSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            {...fields.password}
            inputRef={fields.password.inputRef}
            id="reset-password"
            label="New password"
            placeholder="Enter a new password"
            type="password"
            autoComplete="new-password"
            required
            fullWidth
            sx={authTextFieldSx}
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
          />

          <TextField
            {...fields.confirmation}
            inputRef={fields.confirmation.inputRef}
            id="confirm-reset-password"
            label="Confirm password"
            placeholder="Confirm your new password"
            type="password"
            autoComplete="new-password"
            required
            fullWidth
            sx={authTextFieldSx}
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword?.message}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={!token || isComplete}
            loading={isPending}
          >
            {isPending ? "Resetting password..." : "Reset password"}
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}
