"use client";
import type { JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/lib/store";
import { capitalizeFirstLetter } from "@/src/lib/utils/helpers/capitalizeFirstLetter";
import type { UserAccountViewType } from "@/src/lib/store/slices/user/types";
import { changeAccountTab } from "@/src/lib/store/slices/user/userSlice";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import AccountDetailsHeader from "../../sections/user/userAccountMenuHeader";
import { ValueErrorIterator } from "@sinclair/typebox/errors";

type ViewOptionsType = { label: string, value: UserAccountViewType}

type AccountPresentationOptions = Array<ViewOptionsType>;

const opts = [{ label: "My Groups", value: "my groups"}, {label: "Memberships", value: "memberships"}, { label: "RSVPs", value: "rsvps"}] satisfies AccountPresentationOptions

const options: UserAccountViewType[] = [
  "my groups",
  "memberships",
  "rsvps",
  "settings",
];

export default function UserAccountMenu({ email }: { email: string}): JSX.Element {
  const displayed = useSelector((s: RootState) => s.user.view);
  const dispatch = useDispatch<AppDispatch>();

  const handleSelect = (option: UserAccountViewType) => {
    dispatch(changeAccountTab(option));
  };

  return (
    <Box
    sx={{
      width: "100%",
      height: "85%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "start",
      alignItems: "center",
      gap: 12
    }}
    >
      <AccountDetailsHeader 
      email={email}
      />

      <Toolbar
        disableGutters
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "auto",
        }}
      >
        <Stack
          sx={{
            width: "95%",
            height: "100%",
            marginX: "auto",
          }}
          direction={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          spacing={2}
          divider={<Divider orientation="horizontal" flexItem />}
        >
          <Paper
            component={"nav"}
            variant="outlined"
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: "paper.background",
              border: "none",
            }}
          >
            <MenuList variant="menu">
              {opts.map((option) => {

                return (
                  <MenuItem
                    onClick={() => handleSelect(option.value)}
                    key={option.value}
                    value={option.value}
                    sx={{
                      borderRadius: 2,
                      backgroundColor:
                        displayed === option.value
                          ? "rgba(255, 255, 255, 0.2)"
                          : "transparent",
                    }}
                  >
                    {option.label}
                  </MenuItem>
                );
              })}
            </MenuList>
          </Paper>
        </Stack>
      </Toolbar>
    </Box>
  );
}
