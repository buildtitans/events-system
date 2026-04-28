import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import type { JSX } from "react";
import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import {
  openedGroupHeroDescriptionGridSx,
  openedGroupHeroLeadLabelSx,
  openedGroupHeroLeadSx,
  openedGroupHeroLeadTextSx,
  openedGroupHeroMetaCardSx,
  openedGroupHeroMetaContentSx,
  openedGroupHeroMetaGridSx,
  openedGroupHeroMetaIconWrapSx,
  openedGroupHeroMetaLabelSx,
  openedGroupHeroMetaValueSx,
  openedGroupHeroWideMetaCardSx,
} from "@/src/styles/sx/openedGroupHero";

type GroupDescriptionProps = {
  group: GroupSchemaType;
};

export default function GroupDescription({
  group,
}: GroupDescriptionProps): JSX.Element {
  const memberCount = useSelector((s: RootState) => s.openGroup.numMembers);
  const organizerEmail = useSelector((s: RootState) => s.openGroup.organizerEmail);
  const normalizedDescription =
    group.description?.trim() || "This community is still building out its story.";
  const locationValue =
    group.location === "Online"
      ? "Hosts events online"
      : group.location?.trim() || "Location coming soon";
  const memberValue = `${memberCount} ${memberCount === 1 ? "member" : "members"}`;
  const organizerValue = organizerEmail || "Organizer details coming soon";

  return (
    <Box sx={openedGroupHeroDescriptionGridSx}>
      <Stack sx={openedGroupHeroLeadSx}>
        <Typography sx={openedGroupHeroLeadLabelSx}>Community Details</Typography>
        <Typography sx={openedGroupHeroLeadTextSx}>
          {normalizedDescription}
        </Typography>
      </Stack>

      <Box sx={openedGroupHeroMetaGridSx}>
        <Box sx={openedGroupHeroMetaCardSx}>
          <Box sx={openedGroupHeroMetaIconWrapSx}>
            <PlaceRoundedIcon fontSize="small" />
          </Box>
          <Box sx={openedGroupHeroMetaContentSx}>
            <Typography sx={openedGroupHeroMetaLabelSx}>Location</Typography>
            <Typography sx={openedGroupHeroMetaValueSx}>{locationValue}</Typography>
          </Box>
        </Box>

        <Box sx={openedGroupHeroMetaCardSx}>
          <Box sx={openedGroupHeroMetaIconWrapSx}>
            <Groups2RoundedIcon fontSize="small" />
          </Box>
          <Box sx={openedGroupHeroMetaContentSx}>
            <Typography sx={openedGroupHeroMetaLabelSx}>Members</Typography>
            <Typography sx={openedGroupHeroMetaValueSx}>{memberValue}</Typography>
          </Box>
        </Box>

        <Box sx={{ ...openedGroupHeroMetaCardSx, ...openedGroupHeroWideMetaCardSx }}>
          <Box sx={openedGroupHeroMetaIconWrapSx}>
            <AlternateEmailRoundedIcon fontSize="small" />
          </Box>
          <Box sx={openedGroupHeroMetaContentSx}>
            <Typography sx={openedGroupHeroMetaLabelSx}>Organizer</Typography>
            <Typography sx={openedGroupHeroMetaValueSx}>
              {organizerValue}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
