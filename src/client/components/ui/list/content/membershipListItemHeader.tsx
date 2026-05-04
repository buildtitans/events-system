import { JSX } from "react";
import { UserMembershipSchemaType } from "@/src/schemas/groups/userMembershipSchema";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { TitleTypography } from "../../box/cards/group";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import {
  getMembershipMetaChipSx,
  getMembershipMetaIconSx,
  getMembershipRoleChipSx,
  membershipHeaderSx,
  membershipMetaRowSx,
  membershipTitleRowSx,
  membershipTitleSx,
} from "@/src/client/styles/sx/membershipListItem";

type MembershipListItemHeaderProps = {
  membership: UserMembershipSchemaType;
  handleClick: (slug: UserMembershipSchemaType["group_slug"]) => void;
};

export default function MembershipListItemHeader({
  membership,
  handleClick,
}: MembershipListItemHeaderProps): JSX.Element {
  const roleLabel =
    membership.roleInGroup.charAt(0).toUpperCase() +
    membership.roleInGroup.slice(1);

  return (
    <Box sx={membershipHeaderSx}>
      <Box sx={membershipTitleRowSx}>
        <Box
          component="div"
          onClick={() => handleClick(membership.group_slug)}
          sx={{ cursor: "pointer", minWidth: 0 }}
        >
          <TitleTypography variant="h6" sx={membershipTitleSx}>
            {membership.group_name}
          </TitleTypography>
        </Box>
        <Chip
          size="small"
          variant="filled"
          label={roleLabel}
          icon={
            membership.roleInGroup === "organizer" ? (
              <WorkspacePremiumRoundedIcon fontSize="small" />
            ) : (
              <PersonRoundedIcon fontSize="small" />
            )
          }
          sx={getMembershipRoleChipSx(membership.roleInGroup)}
        />
      </Box>

      <Stack direction="row" sx={membershipMetaRowSx}>
        <Box sx={getMembershipMetaChipSx(true)}>
          <GroupsRoundedIcon sx={getMembershipMetaIconSx(true)} />
          <Typography variant="caption" sx={{ fontWeight: 700 }}>
            {membership.member_count} {getGroupHeadcountDetails(membership.member_count)}
          </Typography>
        </Box>

        {membership.location && (
          <Box sx={getMembershipMetaChipSx()}>
            <LocationOnRoundedIcon sx={getMembershipMetaIconSx()} />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {membership.location}
            </Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
}

function getGroupHeadcountDetails(count: number): string {

  if(count >= 2) return "members";

  return "member";
};