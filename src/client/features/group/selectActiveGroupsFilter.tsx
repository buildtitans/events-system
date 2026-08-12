import { RootState } from "@/src/lib/store";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { JSX } from "react";
import { useSelector } from "react-redux";
import ShimmerText from "@/src/client/components/ui/feedback/pending/shimmerText";
import { useFilterGroups } from "@/src/lib/hooks/filters/useFilterGroups";
import { createGroupFilterPendingMessage } from "@/src/lib/utils/helpers/messages/createGroupFilterPendingMessage";
import {
  getGroupsFilterChipSx,
  groupsFilterPendingWrapSx,
  groupsFilterRootSx,
  groupsFilterSurfaceSx,
} from "@/src/client/styles/sx/groupFilter";
import { useMinTimeVisible } from "@/src/lib/hooks/rendering/useMinTimeVisible";
import { FILTER_OPTIONS } from "@/src/lib/tokens/categoryTokens";

export default function SelectActiveGroupsFilter(): JSX.Element {
  const status = useSelector((s: RootState) => s.rendering.groupsTab.status);
  const visible = useMinTimeVisible(status === "pending", 200, 600);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { selectFilter, filterArgs } = useFilterGroups();

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={groupsFilterRootSx}
    >
      <Stack direction="row" sx={groupsFilterSurfaceSx}>
        {FILTER_OPTIONS.map((option) => (
          <Chip
            key={option.filter}
            label={option.label}
            variant="filled"
            size={isMobile ? "small" : "medium"}
            component="button"
            onClick={() => selectFilter(option)}
            sx={getGroupsFilterChipSx(
              filterArgs.filter === option.filter,
              isMobile,
            )}
          />
        ))}
      </Stack>

      {visible && (
        <Stack sx={groupsFilterPendingWrapSx}>
          <ShimmerText
            pendingMessage={createGroupFilterPendingMessage(filterArgs)}
          />
        </Stack>
      )}
    </Stack>
  );
}
