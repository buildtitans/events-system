import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import AddIcon from "@mui/icons-material/Add";
import type { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { useLeaveGroup } from "@/src/lib/hooks/auth/useLeaveGroup";

type MembersOnlyActionsMenuProps = {
  group_id: GroupMemberSchemaType["group_id"];
};

export default function MembersOnlyActionMenu({
  group_id,
}: MembersOnlyActionsMenuProps): React.JSX.Element {
  const { removeUserFromGroup } = useLeaveGroup();
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <List
      sx={{
        width: "100%",
        marginTop: 2,
        bgcolor: "background.paper",
        borderRadius: 2,
      }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <SpaceDashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Actions" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton
            onClick={() => removeUserFromGroup(group_id)}
            sx={{
              pl: 2,
            }}
          >
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText sx={{}} primary="leave group" />
          </ListItemButton>
        </List>
      </Collapse>
    </List>
  );
}

//
//subheader={
//  <ListSubheader
//  component="div"
//  sx={{
//      borderRadius: 2
//  }}
//  id="nested-list-subheader">
//  Actions
//  </ListSubheader>
//}
