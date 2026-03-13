import { JSX } from "react";
import { UserMembershipSchemaType } from "@/src/schemas/groups/userMembershipSchema";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { TitleTypography } from "../../box/cards/group";

type MembershipListItemHeaderProps = {
  membership: UserMembershipSchemaType;
  handleClick: (slug: UserMembershipSchemaType["group_slug"]) => void,
};

export default function MembershipListItemHeader({
  membership,
  handleClick
}: MembershipListItemHeaderProps): JSX.Element {
  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Stack direction={"row"} gap={4} alignItems={"center"} >
        <ListItemIcon sx={{ minWidth: 0 }}>
          <GroupRoundedIcon fontSize="medium" />
        </ListItemIcon>

        <Box>
          <ListItemText
            sx={{
              cursor: "pointer"
            }}
            primary={
              <Box 
              component={"div"}
              onClick={() => handleClick(membership.group_slug)}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TitleTypography variant="body2" sx={{ fontWeight: 600 }}>
                  {membership.group_name}
                </TitleTypography>

                <Chip
                  size="small"
                  label={membership.roleInGroup}
                  sx={{ height: 20 }}
                  color={
                    membership.roleInGroup === "organizer" ? "primary" : "info"
                  }
                />
              </Box>
            }
            secondary={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    Members: {membership.member_count}
                  
                </Typography>
              </Box>
            }
          ></ListItemText>
        </Box>
      </Stack>

       
    </Box>
  );
}