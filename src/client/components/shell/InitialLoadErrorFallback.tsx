"use client";

import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

type InitialLoadErrorFallbackProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export function InitialLoadErrorFallback({
  title = "Unable to load the app",
  message = "The initial app data could not be loaded. This is usually temporary, but the app needs a fresh attempt before it can continue.",
  onRetry,
}: InitialLoadErrorFallbackProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
      return;
    }

    window.location.reload();
  };

  return (
    <Box
      component="main"
      sx={(theme) => ({
        alignItems: "center",
        background:
          theme.palette.mode === "dark"
            ? `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.error.main, 0.18)} 100%)`
            : `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.error.main, 0.1)} 100%)`,
        display: "flex",
        minHeight: "100dvh",
        py: { xs: 6, md: 10 },
      })}
    >
      <Container maxWidth="sm">
        <Stack
          spacing={3}
          sx={(theme) => ({
            border: `1px solid ${theme.palette.error.main}`,
            borderRadius: 1,
            boxShadow:
              theme.palette.mode === "dark"
                ? `0 18px 60px ${alpha(theme.palette.common.black, 0.4)}`
                : `0 18px 60px ${alpha(theme.palette.error.main, 0.2)}`,
            overflow: "hidden",
          })}
        >
          <Box
            sx={(theme) => ({
              backgroundColor:
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.error.main, 0.22)
                  : alpha(theme.palette.error.main, 0.12),
              borderBottom: `1px solid ${theme.palette.error.main}`,
              height: 8,
            })}
          />

          <Stack spacing={2.25} sx={{ p: { xs: 3, sm: 4 } }}>
            <Stack spacing={1}>
              <Typography color="error" fontWeight={800} variant="overline">
                Startup error
              </Typography>

              <Typography component="h1" fontWeight={800} variant="h4">
                {title}
              </Typography>
            </Stack>

            <Typography color="text.secondary" variant="body1">
              {message}
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ pt: 1 }}
            >
              <Button
                color="error"
                onClick={handleRetry}
                size="large"
                variant="contained"
              >
                Try again
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
