"use client";
import type { JSX } from "react";
import type { RootState } from "@/src/lib/store";
import Container from "@mui/material/Container";
import { useSelector } from "react-redux";



export default function MyMemberships(): JSX.Element | null {
const participations = useSelector((s: RootState) => s.user.participations);

    console.log(participations);

    if(participations.status !== "ready") return null;

    return (
        <Container>
            
        </Container>
    )
}