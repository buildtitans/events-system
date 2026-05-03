"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/lib/store";
import { CreateNewGroupHook } from "@/src/lib/types/hooks/types";
import type { SelectChangeEvent } from "@mui/material/Select";
import {
  createGroupFieldControlSx,
  createGroupMenuPaperSx,
  createGroupSelectLabelSx,
  createGroupSelectSx,
} from "@/src/styles/sx/createGroupDrawer";

type SelectCategoryProps = {
  handleGroupCategory: CreateNewGroupHook["handleGroupCategory"];
  chosen: CreateNewGroupHook["newGroup"]["category_id"];
};

export default function SelectCategory({
  handleGroupCategory,
  chosen,
}: SelectCategoryProps): React.JSX.Element {
  const [displayed, setDisplayed] = React.useState<string | null>(chosen ?? "");
  const categories = useSelector((s: RootState) => s.categories.categories);

  const handleChange = (e: SelectChangeEvent<string | null>) => {
    const value = e.target.value;
    handleGroupCategory(value);
    setDisplayed(value);
  };

  return (
    <Box sx={{ width: "100%", height: "auto" }}>
      <FormControl fullWidth sx={createGroupFieldControlSx}>
        <InputLabel id="category-label" sx={createGroupSelectLabelSx}>
          Categories
        </InputLabel>
        <Select
          sx={createGroupSelectSx}
          onChange={(e) => handleChange(e)}
          labelId="category-label"
          id="demo-simple-select"
          value={displayed}
          label="Categories"
          MenuProps={{
            PaperProps: {
              sx: createGroupMenuPaperSx,
            },
          }}
        >
          {Array.isArray(categories) &&
            categories.length > 0 &&
            categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </Box>
  );
}
