"use client"
import Button from "@mui/material/Button";
import Link from "next/link";
import { HomeIcon } from "../icons/CustomIcons";
import type { JSX } from "react";

export default function HomeButton(): JSX.Element {

    return (
        <Button
            LinkComponent={Link}
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