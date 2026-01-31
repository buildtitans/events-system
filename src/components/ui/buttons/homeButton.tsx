import Button from "@mui/material/Button";
import Link from "next/link";
import { HomeIcon } from "../icons/CustomIcons";
import type { JSX } from "react";

export default function HomeButton(): JSX.Element {

    return (
        <Link href={'/'}>
            <Button
                startIcon={<HomeIcon />}
                variant="contained"
                sx={{
                    flexGrow: 1,
                    backgroundColor: 'rgb(255, 255, 255, 0.95)',
                    borderRadius: 999,
                    ':hover': {
                        backgroundColor: 'white',
                    }
                }}>
                Home
            </Button>
        </Link>
    );
};