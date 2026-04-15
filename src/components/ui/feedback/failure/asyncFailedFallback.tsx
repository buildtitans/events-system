import RefreshIcon from "@mui/icons-material/Refresh";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";

type AsyncFailedFallbackProps = {
  title?: string;
  message?: string;
  error?: string | null;
  onRetry?: () => void;
  retryLabel?: string;
  minHeight?: number | string;
};

export default function AsyncFailedFallback({
  title = "Something went wrong",
  message = "We couldn't load this content right now.",
  error,
  onRetry,
  retryLabel = "Try again",
  minHeight = 400,
}: AsyncFailedFallbackProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        minHeight,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
        py: 4,
        
      }}
    >
      <Stack
        spacing={2}
        alignItems="center"
        textAlign="center"
        maxWidth={480}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            backgroundColor: "action.hover",
          }}
        >
          <ErrorOutlineIcon color="error" />
        </Box>

        <Stack spacing={0.75}>
          <Typography variant="h6" fontWeight={700}>
            {title}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>

          {error ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 1,
                px: 1,
                wordBreak: "break-word",
              }}
            >
              {error}
            </Typography>
          ) : null}
        </Stack>

        {onRetry ? (
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={onRetry}
          >
            {retryLabel}
          </Button>
        ) : null}
      </Stack>
    </Paper>
  );
}