"use client";
import MenuItem from "@mui/material/MenuItem";
import { JSX } from "react";
import Skeleton from "@mui/material/Skeleton";

export default function ListItemSkeleton(): JSX.Element {

    return (
        <MenuItem divider sx={{
            paddingY: 2
        }}>
            <Skeleton variant="rectangular" animation="wave" />
        </MenuItem>
    )
}