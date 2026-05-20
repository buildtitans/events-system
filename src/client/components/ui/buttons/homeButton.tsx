"use client"
import Button from "@mui/material/Button";
import Link from "next/link";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import type { JSX } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/lib/store";
import { clearOpenedGroupSlice } from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import { enqueueSidebar } from "@/src/lib/store/slices/rendering/RenderingSlice";
import { navHomeButtonSx } from "@/src/client/styles/sx/nav";

export default function HomeButton(): JSX.Element {
    const dispatch = useDispatch<AppDispatch>();

    const handleClick = () => {
        dispatch(clearOpenedGroupSlice());
        dispatch(enqueueSidebar(null));
    }

    return (
        <Button
            LinkComponent={Link}
            onClick={handleClick}
            href="/"
            size="small"
            variant="contained"
            sx={navHomeButtonSx}
            startIcon={<HomeRoundedIcon/>}
            >

            Home
        </Button>
    );
};
