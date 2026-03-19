import type { JSX } from "react";
import Typography from "@mui/material/Typography";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { clipEmail } from "@/src/lib/utils/parsing/clipEmail";

type AccountDetailsHeaderProps = {
  email: string;
};

export default function UserAccountMenuHeader({
  email,
}: AccountDetailsHeaderProps): JSX.Element {
  const clippedEmail = clipEmail(email);

  return (
    <Paper
    elevation={0}
    sx={{
          backgroundColor: "paper.background",
        width: "100%",
        height: "auto"  
    }}
    >
<MenuList
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <MenuItem
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "start",
        borderRadius: 2,
        gap: 1
      }}
      >
      
 <AccountCircleIcon htmlColor="white" color="primary" />
      <Typography component={"p"} color="textSecondary">
        {clippedEmail}
      </Typography>
     
      </MenuItem>
      
    </MenuList>
    </Paper>
    
  );
}
