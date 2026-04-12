import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { JSX } from "react";
import { UserMembershipSchemaType } from "@/src/schemas/groups/userMembershipSchema";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";


type MembershipListItemContentProps = {
    membership: UserMembershipSchemaType,
    nextEvent?: EventSchemaType["starts_at"]
};

export default function MembershipListItemBody({ membership }: MembershipListItemContentProps): JSX.Element {
  return (
    <Box>
      <ListItemText
        primary={
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 1 }}>
            <Typography
              variant="caption"
              fontWeight={"light"}
              sx={{
                fontSize: {
                  xs: "12px",
                  md: "16px"
                }
              }}
            >
              {membership.group_description}
            </Typography>
          </Box>
        }
      />
    </Box>
  );
}