"use client"
import Button from "@mui/material/Button";
import Link from "next/link";
import { HomeIcon } from "../icons/CustomIcons";
import type { JSX } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/lib/store";
import { clearOpenedGroupSlice } from "@/src/lib/store/slices/groups/OpenedGroupSlice";

export default function HomeButton(): JSX.Element {
    const dispatch = useDispatch<AppDispatch>();

    const handleClick = () => {
        dispatch(clearOpenedGroupSlice());
    }

    return (
        <Button
            LinkComponent={Link}
            onClick={handleClick}
            href="/"
            startIcon={<HomeIcon />}
            variant="contained"
            sx={{
                backgroundColor: 'rgb(255, 255, 255, 0.95)',
                borderRadius: 999,
                ':hover': {
                    backgroundColor: 'white',
                }
            }}>
            Home
        </Button>
    );
};