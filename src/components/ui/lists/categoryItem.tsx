import "use client"
import React from "react";
import MenuItem from "@mui/material/MenuItem";
import type { CreateNewGroupHook } from "@/src/lib/hooks/useCreateNewGroup";

type CategoryItemProps = {
    id: string,
    name: string,
    handleGroupCategory: CreateNewGroupHook["handleGroupCategory"]
}

function CategoryItem({ id, name, handleGroupCategory }: CategoryItemProps) {

    return (
        <MenuItem
            onClick={handleGroupCategory(id)}
            value={id}
        >
            {name}
        </MenuItem>
    )
}

export default React.memo(CategoryItem);