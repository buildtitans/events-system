"use client";

import { alpha } from "@mui/material/styles";
import { Box, Button, Container, Stack, Typography } from "@mui/material";

type AppUnavailableFallbackProps = {
  message?: string;
  detail?: string;
  onRetry?: () => void;
};

export function AppUnavailableFallback({
  message = "The app is temporarily unavailable",
  detail = "A required service could not be reached while the app was starting. Try again in a moment.",
  onRetry,
}: AppUnavailableFallbackProps) {
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
            ? `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.warning.main, 0.16)} 100%)`
            : `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.warning.main, 0.12)} 100%)`,
        display: "flex",
        minHeight: "100dvh",
        py: { xs: 6, md: 10 },
      })}
    >
      <Container maxWidth="sm">
        <Stack
          spacing={3}
          sx={(theme) => ({
            border: `1px solid ${theme.palette.warning.main}`,
            borderRadius: 1,
            boxShadow:
              theme.palette.mode === "dark"
                ? `0 18px 60px ${alpha(theme.palette.common.black, 0.4)}`
                : `0 18px 60px ${alpha(theme.palette.warning.main, 0.2)}`,
            overflow: "hidden",
          })}
        >
          <Box
            sx={(theme) => ({
              backgroundColor:
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.warning.main, 0.22)
                  : alpha(theme.palette.warning.main, 0.14),
              borderBottom: `1px solid ${theme.palette.warning.main}`,
              height: 8,
            })}
          />

          <Stack spacing={2.25} sx={{ p: { xs: 3, sm: 4 } }}>
            <Stack spacing={1}>
              <Typography color="warning.main" fontWeight={800} variant="overline">
                Service unavailable
              </Typography>

              <Typography component="h1" fontWeight={800} variant="h4">
                {message}
              </Typography>
            </Stack>

            <Typography color="text.secondary" variant="body1">
              {detail}
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ pt: 1 }}
            >
              <Button
                color="warning"
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
