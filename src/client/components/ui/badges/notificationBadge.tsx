import Badge from "@mui/material/Badge";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import IconButton from "@mui/material/IconButton";
import { JSX } from "react";
import { navBadgeSx, navIconButtonSx } from "@/src/client/styles/sx/nav";

type BadgeProps = {
  badgeContent: number;
  handleClick: (event: React.MouseEvent<HTMLElement>) => Promise<void>;
};

export default function NotificationBadge({
  badgeContent,
  handleClick,
}: BadgeProps): JSX.Element {
  return (
    <IconButton
      aria-label="Open notifications"
      sx={navIconButtonSx}
      onClick={(event) => handleClick(event)}
    >
      <Badge sx={navBadgeSx} badgeContent={badgeContent}>
        <NotificationsOutlinedIcon />
      </Badge>
    </IconButton>
  );
}
