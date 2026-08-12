"use client";

import { useRequestPasswordReset } from "@/src/lib/hooks/auth/credentials/useRequestPasswordReset";
import { authTextFieldSx } from "@/src/client/styles/sx/authDrawer";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export default function RequestPasswordReset() {
  const { emailField, emailError, isPending, onSubmit } =
    useRequestPasswordReset();

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
            Enter your account email and we&apos;ll send you a secure password
            reset link.
          </Typography>
        </Box>

        <Box
          component="form"
          noValidate
          onSubmit={onSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            {...emailField}
            inputRef={emailField.inputRef}
            id="recovery-email"
            label="Email address"
            placeholder="your@email.com"
            type="email"
            autoComplete="email"
            autoFocus
            required
            fullWidth
            sx={authTextFieldSx}
            error={Boolean(emailError)}
            helperText={emailError}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            loading={isPending}
          >
            Send reset link
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}
