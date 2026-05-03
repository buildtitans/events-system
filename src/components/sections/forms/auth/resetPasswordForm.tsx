"use client";
import { useResetPassword } from "@/src/lib/hooks/auth/useResetPassword";
import Password from "@/src/components/sections/inputs/auth/Password";
import ConfirmPassword from "@/src/components/sections/inputs/auth/ConfirmPassword";
import { RootState } from "@/src/lib/store";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";

type ResetPasswordFormProps = {
  token: string | null;
};

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const resetState = useSelector((s: RootState) => s.user.pwReset);
  const { getInput, submitPwReset, errors, isSubmittable } = useResetPassword(
    token ?? "",
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submitPwReset();
  };

  const isPending = resetState.status === "pending";
  const isReady = resetState.status === "ready";

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 8, md: 12 } }}>
      <Stack spacing={3}>
        <Box>
          <Typography component="h1" variant="h3" fontWeight="light" gutterBottom>
            Reset your password
          </Typography>
          <Typography color="text.secondary">
            Enter a new password for your account. This reset link expires after
            15 minutes.
          </Typography>
        </Box>

        {!token && (
          <Alert severity="error">
            This password reset link is missing a token. Request a new reset email
            and try again.
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Password
            handlePassword={(e) => getInput("password", e)}
            passwordError={errors.invalidPassword !== ""}
            passwordErrorMessage={errors.invalidPassword}
          />

          <ConfirmPassword
            handleConfirmingPassword={(e) => getInput("confirmPassword", e)}
            passwordError={errors.confirmPassword !== ""}
            passwordErrorMessage={errors.confirmPassword}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={!isSubmittable || isPending || isReady}
            loading={isPending}
          >
            {isPending ? "Resetting password..." : "Reset password"}
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}
