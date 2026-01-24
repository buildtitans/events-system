import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { JSX } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { EventSchemaType } from "@/src/schemas/eventSchema";




export default function OpenedGroup({ group_id }: { group_id: EventSchemaType["group_id"] }): JSX.Element {
    const layoutSlots = useSelector((s: RootState) => s.events.eventPages);



    return (
        <Stack>

        </Stack>
    )
}