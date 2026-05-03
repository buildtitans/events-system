import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import type { JSX } from "react";
import { accountMenuFooterSx } from "@/src/styles/sx/accountMenu";

export default function UserAccountMenuFooter(): JSX.Element {
  return (
    <Box sx={accountMenuFooterSx}>
      <Typography
        variant="caption"
        sx={{
          display: "block",
          mb: 0.5,
          color: "rgba(124, 198, 255, 0.72)",
          fontWeight: 700,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
        }}
      >
        Activity Hub
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "rgba(255, 255, 255, 0.58)",
          lineHeight: 1.5,
        }}
      >
        Jump between the groups you lead, communities you follow, and events
        you&apos;ve saved.
      </Typography>
    </Box>
  );
}
