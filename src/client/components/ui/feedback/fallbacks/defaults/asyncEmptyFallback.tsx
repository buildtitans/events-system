import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import { Box, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

type AsyncEmptyFallbackProps = {
  message: ReactNode;
  title?: ReactNode;
  icon?: ReactNode;
  minHeight?: number | string;
};

export default function AsyncEmptyFallback({
  message,
  title = "Nothing here yet",
  icon = <InboxOutlinedIcon />,
  minHeight = 160,
}: AsyncEmptyFallbackProps) {
  return (
    <Box
      role="status"
      sx={{
        width: "100%",
        minHeight,
        display: "grid",
        placeItems: "center",
        px: 3,
        py: 4,
      }}
    >
      <Stack spacing={1} alignItems="center" textAlign="center" maxWidth={420}>
        <Box
          aria-hidden
          sx={{
            width: 48,
            height: 48,
            display: "grid",
            placeItems: "center",
            borderRadius: "50%",
            color: "text.secondary",
            backgroundColor: "action.hover",
            "& svg": {
              fontSize: 26,
            },
          }}
        >
          {icon}
        </Box>

        <Typography variant="subtitle1" fontWeight={600}>
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </Stack>
    </Box>
  );
}
