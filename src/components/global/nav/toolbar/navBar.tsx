"use client";
import { alpha, styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import HomeButton from "../../../ui/buttons/homeButton";
import { Search } from "@/src/features/search/search";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: 999,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: "8px 12px",
}));



export default function NavBar() {
  return (
    <StyledToolbar
      variant="dense"
      disableGutters
      sx={{
        ml: 0,
        padding: 0.8,
        mr: "auto",
        minWidth: { xs: "400px", md: "600px" },
      }}
    >
      <HomeButton />

      <Search />
    </StyledToolbar>
  );
}
