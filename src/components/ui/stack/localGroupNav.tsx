import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { PropsWithChildren, type JSX } from "react";

type LocalGroupNavProps = PropsWithChildren<{ children: React.ReactNode }>;

export default function LocalGroupNav({
  children,
}: LocalGroupNavProps): JSX.Element {
  return (
    <Stack
      direction={"column"}
      spacing={2}
      divider={<Divider orientation="horizontal" flexItem />}
    >
      <Paper
        component={"nav"}
        variant="outlined"
        sx={{
          width: "100%",
          height: "auto",
          backgroundColor: "transparent",
          border: "none",
        }}
      >
        <MenuList variant="menu">
          <MenuItem
            sx={{
              borderRadius: 1.5,
            }}
          >
            Overview
          </MenuItem>
          <MenuItem
            sx={{
              borderRadius: 1.5,
            }}
          >
            Group History
          </MenuItem>
          <MenuItem
            sx={{
              borderRadius: 1.5,
            }}
          >
            View Event
          </MenuItem>
        </MenuList>
      </Paper>
      {children}
    </Stack>
  );
}
