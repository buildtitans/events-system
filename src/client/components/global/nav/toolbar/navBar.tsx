"use client";
import Box from "@mui/material/Box";
import HomeButton from "../../../ui/buttons/homeButton";
import { Search } from "@/src/client/features/search/search";
import { navBarClusterSx } from "@/src/client/styles/sx/nav";

export default function NavBar() {
  return (
    <Box sx={navBarClusterSx}>
      <HomeButton />
      <Search />
    </Box>
  );
}
