import { RootState } from "@/src/lib/store";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { JSX } from "react";
import { useSelector } from "react-redux";
import ShimmerText from "@/src/components/ui/feedback/pending/shimmerText";
import { useFilterGroups } from "@/src/lib/hooks/filters/useFilterGroups";
import { createGroupFilterPendingMessage } from "@/src/lib/utils/helpers/messages/createGroupFilterPendingMessage";
import { options } from "@/src/lib/tokens/groupFilterTokens";
import {
  getGroupsFilterChipSx,
  groupsFilterPendingWrapSx,
  groupsFilterRootSx,
  groupsFilterSurfaceSx,
} from "@/src/styles/sx/groupFilter";

export default function SelectActiveGroupsFilter(): JSX.Element {
  const status = useSelector((s: RootState) => s.groups.landingGroupsTab.status);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { handleFilterSelect, filter } = useFilterGroups();

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={groupsFilterRootSx}
    >
      <Stack direction="row" sx={groupsFilterSurfaceSx}>
        {options.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            variant="filled"
            size={isMobile ? "small" : "medium"}
            component="button"
            onClick={() => handleFilterSelect(option.value)}
            sx={getGroupsFilterChipSx(filter === option.value, isMobile)}
          />
        ))}
      </Stack>

      {status === "pending" && (
        <Stack sx={groupsFilterPendingWrapSx}>
          <ShimmerText
            pendingMessage={createGroupFilterPendingMessage(filter, options)}
          />
        </Stack>
      )}
    </Stack>
  );
}
