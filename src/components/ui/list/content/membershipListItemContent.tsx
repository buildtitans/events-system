import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { JSX } from "react";
import { UserMembershipSchemaType } from "@/src/schemas/groups/userMembershipSchema";
import {
  membershipBodySx,
  membershipDescriptionSx,
} from "@/src/styles/sx/membershipListItem";

type MembershipListItemContentProps = {
  membership: UserMembershipSchemaType;
};

export default function MembershipListItemBody({
  membership,
}: MembershipListItemContentProps): JSX.Element {
  return (
    <Box sx={membershipBodySx}>
      <Typography variant="body2" sx={membershipDescriptionSx}>
        {membership.group_description}
      </Typography>
    </Box>
  );
}
