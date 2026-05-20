import type { JSX } from "react";
import Typography from "@mui/material/Typography";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { clipEmail } from "@/src/lib/utils/parsing/clipEmail";
import { Box, Stack } from "@mui/material";
import {
  accountMenuAvatarSx,
  accountMenuHeaderSx,
} from "@/src/client/styles/sx/accountMenu";

type AccountDetailsHeaderProps = {
  email: string;
};

export default function UserAccountMenuHeader({
  email,
}: AccountDetailsHeaderProps): JSX.Element {
  const clippedEmail = clipEmail(email);

  return (
    <Box sx={accountMenuHeaderSx}>
      <Stack direction={"row"} alignItems={"center"} gap={1.25}>
        <Box sx={accountMenuAvatarSx}>
          <AccountCircleIcon />
        </Box>
        <Stack spacing={0.25} minWidth={0}>
          <Typography
            variant="caption"
            sx={{
              color: "rgba(124, 198, 255, 0.78)",
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            Account
          </Typography>
          <Typography
            component={"p"}
            sx={{
              color: "rgba(255, 255, 255, 0.9)",
              fontWeight: 600,
              lineHeight: 1.35,
              wordBreak: "break-word",
            }}
          >
            {clippedEmail}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
