import type { JSX } from "react";
import type { DashboardFallbackProps } from "@/src/client/components/ui/feedback/fallbacks/widgets/dashboardFallback";
import { noGroupsFallbackActionButtonSx } from "@/src/client/styles/sx/noGroupsFallback";
import Button from "@mui/material/Button";

type DashboardFallbackActionButtonProps = Pick<
  DashboardFallbackProps,
  "actionTitle" | "startIcon" | "handleClick"
>;

export default function DashboardFallbackActionButton({
  handleClick,
  actionTitle,
  startIcon,
}: DashboardFallbackActionButtonProps): JSX.Element | null {
  if (!handleClick || !actionTitle) return null;

  return (
    <Button
      onClick={handleClick}
      sx={noGroupsFallbackActionButtonSx}
      variant={"contained"}
      startIcon={startIcon}
    >
      {actionTitle}
    </Button>
  );
}
