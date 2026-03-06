import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { PropsWithChildren, type JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/lib/store";
import { CurrentDisplay, displaySection } from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import { capitalizeFirstLetter } from "@/src/lib/utils/helpers/capitalizeFirstLetter";

const options: CurrentDisplay[] = ["overview", "group history", "calandar"];

type LocalGroupNavProps = PropsWithChildren<{ children?: React.ReactNode }>;

export default function LocalGroupNav({
  children,
}: LocalGroupNavProps): JSX.Element {
  const displayed = useSelector((s: RootState) => s.openGroup.activeSection);
  const dispatch = useDispatch<AppDispatch>();

  const handleClick = (option: CurrentDisplay) => {

      dispatch(displaySection(option));
  };


  return (
    <Stack
      sx={{
        width: "95%",
        height: "100%",
          marginX: 'auto',
      }}
      direction={"column"}
      alignItems={"center"}
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
          {options.map((option) => {
              const label = capitalizeFirstLetter(option);

              return (
                  <MenuItem
                  onClick={() => handleClick(option)}
                  key={option}
                  value={option}
            sx={{
              borderRadius: 2,
              backgroundColor: (displayed === option) ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
            }}
          >
            {label}
          </MenuItem>      
              )
          })}
          {children}
        </MenuList>
      </Paper>
    </Stack>
  );
}
