"use client";
import Box from "@mui/material/Box";
import HomeButton from "../../../ui/buttons/homeButton";
import { Search } from "@/src/features/search/search";
import { navBarClusterSx } from "@/src/styles/sx/nav";

export default function NavBar() {
  return (
    <Box sx={navBarClusterSx}>
      <HomeButton />
      <Search />
    </Box>
  );
}
