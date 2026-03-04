import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { PropsWithChildren, type JSX } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/src/lib/store";
import { CurrentDisplay, displaySection } from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import { capitalizeFirstLetter } from "@/src/lib/utils/helpers/capitalizeFirstLetter";

const options: CurrentDisplay[] = ["overview", "group history", "expanded event"];

type LocalGroupNavProps = PropsWithChildren<{ children?: React.ReactNode }>;

export default function LocalGroupNav({
  children,
}: LocalGroupNavProps): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  const handleClick = (option: CurrentDisplay) => {

      dispatch(displaySection(option));
  };


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
          {options.map((option) => {
              const label = capitalizeFirstLetter(option);

              return (
                  <MenuItem
                  onClick={() => handleClick(option)}
                  key={option}
                  value={option}
            sx={{
              borderRadius: 1.5,
            }}
          >
            {label}
          </MenuItem>      
              )
          })}
        </MenuList>
      </Paper>
      {children}
    </Stack>
  );
}
