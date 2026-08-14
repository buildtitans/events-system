"use client";

import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Skeleton from "@mui/material/Skeleton";
import { navMenuListSx, navMenuPaperSx } from "@/src/client/styles/sx/nav";
import type { NotificationsListProps } from "./notificationsList";

type NotificationsListSkeletonProps = {
  props: Pick<NotificationsListProps, "anchorEl" | "handleClose" | "open">;
};

export default function NotificationsListSkeleton({
  props,
}: NotificationsListSkeletonProps) {
  const { open, handleClose, anchorEl } = props;

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      elevation={4}
      slotProps={{
        list: {
          "aria-label": "Loading notifications",
          sx: {
            ...navMenuListSx,
            width: 320,
            minHeight: 180,
            borderRadius: 3,
          },
        },
        paper: {
          sx: {
            ...navMenuPaperSx,
            width: 320,
            maxHeight: 320,
            overflow: "hidden",
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      {[0, 1, 2].map((item) => (
        <MenuItem
          key={item}
          disabled
          divider
          sx={{
            minHeight: 82,
            px: 1.25,
            py: 1.25,
            gap: 1.25,
            borderRadius: 2,
            opacity: 1,
          }}
        >
          <Skeleton
            variant="circular"
            width={24}
            height={24}
            sx={{
              flexShrink: 0,
              bgcolor: "rgba(33, 150, 243, 0.2)",
              "&::after": {
                background:
                  "linear-gradient(90deg, transparent, rgba(124, 198, 255, 0.2), transparent)",
              },
            }}
          />

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Skeleton
              variant="text"
              width={item === 1 ? "58%" : "70%"}
              height={24}
              sx={{ bgcolor: "rgba(255, 255, 255, 0.12)" }}
            />
            <Skeleton
              variant="text"
              width="96%"
              height={20}
              sx={{ bgcolor: "rgba(255, 255, 255, 0.08)" }}
            />
            <Skeleton
              variant="text"
              width={item === 2 ? "54%" : "76%"}
              height={20}
              sx={{ bgcolor: "rgba(255, 255, 255, 0.08)" }}
            />
          </Box>
        </MenuItem>
      ))}
    </Menu>
  );
}
