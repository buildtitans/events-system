import { RootState } from "@/src/lib/store";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import  { JSX } from "react";
import { useSelector } from "react-redux";
import { useFilterGroups } from "@/src/lib/hooks/filters/useFilterGroups";
import ShimmerText from "@/src/components/ui/feedback/pending/shimmerText";
import { createGroupFilterPendingMessage } from "@/src/lib/utils/helpers/messages/createGroupFilterPendingMessage";
import { getChipColor } from "@/src/lib/utils/helpers/rendering/getChipColor";
import { options } from "@/src/lib/tokens/groupFilterTokens";

export default function SelectActiveGroupsFilter(): JSX.Element {
const status = useSelector((s:RootState) => s.groups.landingGroupsTab.status);
const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
const { handleFilterSelect, filter } = useFilterGroups();

    return (
        <Stack 
        direction={'row'}
        alignItems={"center"}
        justifyContent={"center"}
        gap={2}
        >
        {options.map((option) => (
            <Chip 
            key={option.value}
            label={option.label}
            variant="filled"
            color={getChipColor({condition: filter === option.value})}
            size={(isMobile) ? "small" : "medium"}
            component={"button"}
            onClick={() => handleFilterSelect(option.value)}
            />
        ))}

        {status === "pending" && 
        <ShimmerText 
        pendingMessage={createGroupFilterPendingMessage(filter, options)} 
        />
        }
        </Stack>
    )

 }