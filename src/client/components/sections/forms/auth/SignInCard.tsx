"use client";
import * as React from "react";
import type { UseLoginHook } from "@/src/lib/types/hooks/types";
import {
  authCheckboxLabelSx,
  authCheckboxSx,
  authDrawerFormSx,
  authFieldControlSx,
  authFieldLabelSx,
  authLinkSx,
  authPrimaryButtonSx,
  authTextFieldSx,
} from "@/src/client/styles/sx/authDrawer";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import ForgotPassword from "@/src/client/features/auth/ForgotPassword";
import AuthDrawerShell from "@/src/client/components/ui/drawers/authDrawerShell";
import { useSignInForm } from "@/src/lib/hooks/auth/credentials/useSignInForm";

type SignInCardProps = {
  login: UseLoginHook["login"];
};

export default function SignInCard({ login }: SignInCardProps) {
  const [forgotPasswordOpen, setForgotPasswordOpen] = React.useState(false);
  const { fields, errors, authError, handleSubmit, isPending } =
    useSignInForm();

  return (
    <AuthDrawerShell
      eyebrow="Welcome Back"
      title="Sign in"
      description="Jump back into your groups, events, and dashboard with the account you already use."
    >
      <Box
        component="form"
        method="POST"
        noValidate
        onSubmit={handleSubmit(login)}
        sx={authDrawerFormSx}
      >
        <FormControl fullWidth sx={authFieldControlSx}>
          <FormLabel htmlFor="email" sx={authFieldLabelSx}>
            Email
          </FormLabel>
          <TextField
            {...fields.email}
            inputRef={fields.email.inputRef}
            id="email"
            type="email"
            placeholder="your@email.com"
            autoComplete="email"
            autoFocus
            required
            fullWidth
            variant="outlined"
            sx={authTextFieldSx}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
          />
        </FormControl>

        <FormControl fullWidth sx={authFieldControlSx}>
          <FormLabel htmlFor="password" sx={authFieldLabelSx}>
            Password
          </FormLabel>
          <TextField
            {...fields.password}
            inputRef={fields.password.inputRef}
            id="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            fullWidth
            variant="outlined"
            sx={authTextFieldSx}
            error={Boolean(errors.password) || Boolean(authError)}
            helperText={errors.password?.message ?? authError}
          />
          <Box sx={{ display: "flex", justifyContent: "end", pt: 1 }}>
            <Link
              component="button"
              type="button"
              onClick={() => setForgotPasswordOpen(true)}
              variant="body2"
              sx={{ ...authLinkSx, alignSelf: "baseline" }}
            >
              Forgot your password?
            </Link>
          </Box>
        </FormControl>

        <FormControlLabel
          sx={authCheckboxLabelSx}
          control={<Checkbox value="remember" sx={authCheckboxSx} />}
          label="Remember me"
        />
        <ForgotPassword
          open={forgotPasswordOpen}
          handleClose={() => setForgotPasswordOpen(false)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={authPrimaryButtonSx}
          loading={isPending}
        >
          Sign in
        </Button>
      </Box>
    </AuthDrawerShell>
  );
}
