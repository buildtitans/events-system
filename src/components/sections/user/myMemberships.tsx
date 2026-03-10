"use client";
import type { JSX } from "react";
import type { RootState } from "@/src/lib/store";
import type { AttendanceDictionaryType } from "@/src/server/src/lib/utils/mapAttendanceDictionary";
import { useHydrateMyRsvps } from "@/src/lib/hooks/hydration/useHydrateMyRSVPs";
import Container from "@mui/material/Container";



export default function MyMemberships(): JSX.Element {
const { rsvpdEvents } = useHydrateMyRsvps();

    return (
        <Container>
            
        </Container>
    )
}