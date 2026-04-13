import { RootState } from "@/src/lib/store";
import { GroupsFilter } from "@/src/lib/store/slices/groups/GroupsSlice";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { JSX, SetStateAction } from "react";
import { useSelector } from "react-redux";

type SelectActiveGroupsFilterProps = {
    setFilter: React.Dispatch<SetStateAction<GroupsFilter>>
}

type FilterOption = {
    value: GroupsFilter,
    label: string
}

export default function SelectActiveGroupsFilter({
    setFilter
 }: SelectActiveGroupsFilterProps): JSX.Element {
const active = useSelector((s:RootState) => s.groups.groupsDisplayed);
const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


const options: FilterOption[] = [
{ 
    label: "All Groups", 
    value: "all"
},
    {
    label: 'Popular Groups', 
    value: "popular"
} 
];

    return (
        <Stack 
        direction={'row'}
        alignItems={"center"}
        justifyContent={"center"}
        gap={2}
        >
        {options.map((option) => (
            <Chip 
            key={option.value}
            label={option.label}
            variant="filled"
            color={(active === option.value) ? "primary" : "default"}
            size={(isMobile) ? "small" : "medium"}
            component={"button"}
            onClick={() => setFilter(option.value)}
            />
        ))}

        </Stack>
    )

 }