"use client";

import type { SelectChangeEvent } from "@mui/material/Select";
import type { JSX } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { RootState } from "@/src/lib/store";
import { useFilterGroups } from "@/src/lib/hooks/filters/useFilterGroups";
import { FILTER_OPTIONS } from "@/src/lib/tokens/categoryTokens";
import type { GroupsFilter } from "@/src/lib/store/slices/groups/types";
import type { CategorySchemaType } from "@/src/schemas/groups/categoriesSchema";
import { createGroupPrimaryButtonSx } from "@/src/client/styles/sx/createGroupDrawer";
import {
  filterGroupsDrawerDescriptionSx,
  filterGroupsDrawerEyebrowSx,
  filterGroupsDrawerFieldSx,
  filterGroupsDrawerHeaderSx,
  filterGroupsDrawerIconSx,
  filterGroupsDrawerMenuPaperSx,
  filterGroupsDrawerRootSx,
  filterGroupsDrawerSelectLabelSx,
  filterGroupsDrawerSelectSx,
  filterGroupsDrawerTitleRowSx,
  filterGroupsDrawerTitleSx,
} from "@/src/client/styles/sx/filterGroupsDrawer";

export default function FilterGroupsOptionsDrawer(): JSX.Element {
  const categories = useSelector(
    (state: RootState) => state.categories.categories,
  );
  const filterStatus = useSelector(
    (state: RootState) => state.rendering.groupsTab.status,
  );
  const { filterArgs, selectCategoryToFilter, selectFilter, applyFilter } =
    useFilterGroups();
  const [categoryId, setCategoryId] = useState<CategorySchemaType["id"]>("");
  const requiresCategory = filterArgs.filter === "category";
  const canApply = !requiresCategory || categoryId.length > 0;

  const handleFilterChange = (event: SelectChangeEvent<GroupsFilter>) => {
    const selected = FILTER_OPTIONS.find(
      (option) => option.filter === event.target.value,
    );

    if (selected) selectFilter(selected);
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    const selectedCategoryId = event.target.value;
    setCategoryId(selectedCategoryId);
    selectCategoryToFilter(selectedCategoryId);
  };

  return (
    <Stack sx={filterGroupsDrawerRootSx}>
      <Stack sx={filterGroupsDrawerHeaderSx}>
        <Typography component="span" sx={filterGroupsDrawerEyebrowSx}>
          Discover groups
        </Typography>

        <Stack direction="row" sx={filterGroupsDrawerTitleRowSx}>
          <FilterAltRoundedIcon sx={filterGroupsDrawerIconSx} />
          <Typography component="h1" sx={filterGroupsDrawerTitleSx}>
            Filter Groups
          </Typography>
        </Stack>

        <Typography component="p" sx={filterGroupsDrawerDescriptionSx}>
          Choose how you would like to browse the communities available to you.
        </Typography>
      </Stack>

      <Stack sx={filterGroupsDrawerFieldSx}>
        <FormControl fullWidth>
          <InputLabel
            id="group-filter-label"
            sx={filterGroupsDrawerSelectLabelSx}
          >
            Show groups
          </InputLabel>
          <Select<GroupsFilter>
            labelId="group-filter-label"
            value={filterArgs.filter}
            label="Show groups"
            onChange={handleFilterChange}
            sx={filterGroupsDrawerSelectSx}
            MenuProps={{
              slotProps: { paper: { sx: filterGroupsDrawerMenuPaperSx } },
            }}
          >
            {FILTER_OPTIONS.map((option) => (
              <MenuItem key={option.filter} value={option.filter}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={filterArgs.filter !== "category"}>
          <InputLabel
            id="group-category-filter-label"
            sx={filterGroupsDrawerSelectLabelSx}
          >
            Category
          </InputLabel>
          <Select
            labelId="group-category-filter-label"
            value={categoryId}
            label="Category"
            onChange={handleCategoryChange}
            sx={filterGroupsDrawerSelectSx}
            MenuProps={{
              slotProps: { paper: { sx: filterGroupsDrawerMenuPaperSx } },
            }}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          type="button"
          variant="contained"
          fullWidth
          disabled={!canApply || filterStatus === "pending"}
          onClick={() => void applyFilter()}
          sx={createGroupPrimaryButtonSx}
        >
          {filterStatus === "pending" ? "Applying Filter..." : "Apply Filter"}
        </Button>
      </Stack>
    </Stack>
  );
}
