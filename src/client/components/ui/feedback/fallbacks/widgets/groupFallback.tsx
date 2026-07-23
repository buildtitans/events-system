import FadeInOutBox from "@/src/client/components/ui/box/motionboxes/fadeInOutBox";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import WatchLaterRoundedIcon from "@mui/icons-material/WatchLaterRounded";
import {
  noGroupHistoryDescriptionSx,
  noGroupHistoryEyebrowSx,
  noGroupHistoryHintSx,
  noGroupHistoryIconSx,
  noGroupHistoryIconWrapSx,
  noGroupHistoryPanelSx,
  noGroupHistoryRootSx,
  noGroupHistoryTitleSx,
} from "@/src/client/styles/sx/noGroupHistoryFallback";
import { RootState } from "@/src/lib/store";
import { useSelector } from "react-redux";
import { groupFallbackCopy } from "../groupFallbackCopy";

export default function OpenedGroupFallback() {
  const displayed = useSelector((s: RootState) => s.openGroup.activeSection);

  const { eyeBrow, fallbackTitle, fallbackDescription, fallbackCaption } =
    groupFallbackCopy[displayed];

  return (
    <FadeInOutBox>
      <Box sx={noGroupHistoryRootSx}>
        <Stack
          justifyContent="center"
          alignItems="center"
          spacing={0}
          sx={noGroupHistoryPanelSx}
        >
          <Box component="header" sx={noGroupHistoryIconWrapSx}>
            <WatchLaterRoundedIcon sx={noGroupHistoryIconSx} />
          </Box>

          <Typography variant="overline" sx={noGroupHistoryEyebrowSx}>
            {eyeBrow}
          </Typography>

          <Typography component="h3" variant="h4" sx={noGroupHistoryTitleSx}>
            {fallbackTitle}
          </Typography>

          <Typography variant="body1" sx={noGroupHistoryDescriptionSx}>
            {fallbackDescription}
          </Typography>

          <Typography variant="body2" sx={noGroupHistoryHintSx}>
            {fallbackCaption}
          </Typography>
        </Stack>
      </Box>
    </FadeInOutBox>
  );
}
