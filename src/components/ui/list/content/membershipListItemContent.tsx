import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { JSX } from "react";
import { UserMembershipSchemaType } from "@/src/schemas/groups/userMembershipSchema";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import Chip from "@mui/material/Chip";


type MembershipListItemContentProps = {
    membership: UserMembershipSchemaType,
    nextEvent?: EventSchemaType["starts_at"]
};

export default function MembershipListItemBody({ membership, nextEvent }: MembershipListItemContentProps): JSX.Element {
  return (
    <Box>
      <ListItemText
        primary={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="caption"
              fontWeight={"light"}
              fontSize={"16px"}
            >
              {membership.group_description}
            </Typography>
          </Box>
        }
      />
      <Chip 
      variant="outlined"
      label={`Next Event: ${nextEvent}`}
      />

      {/* <Typography
      color="textSecondary"
      variant="caption"
      >Next Event: {nextEvent}</Typography> */}
    </Box>
  );
}