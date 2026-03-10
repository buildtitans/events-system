import type { JSX } from "react";
import Typography from "@mui/material/Typography";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";

type AccountDetailsHeaderProps = {
  email: string;
};

export default function UserAccountMenuHeader({
  email,
}: AccountDetailsHeaderProps): JSX.Element {
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
        justifyContent: "space-between",
        borderRadius: 2
      }}
      >
      
 <AccountCircleIcon htmlColor="white" color="primary" />
      <Typography component={"p"} color="primary.info">
        {email}
      </Typography>
     
      </MenuItem>
      
    </MenuList>
    </Paper>
    
  );
}
