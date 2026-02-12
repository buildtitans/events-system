import { LayoutSlotSchemaType } from "@/src/schemas/events/layoutSlotSchema";
import { RenderEventsLayout } from "../../pipelines/events/renderEventsLayout";
import Box from "@mui/material/Box";

export default function ScheduledEvents({ layout }: { layout: LayoutSlotSchemaType[] }) {
    const focusedCardIndex = 0;
    const handleBlur = () => { }
    const handleFocus = () => { }


    return (
        <Box
        >
            {RenderEventsLayout(layout, handleBlur, handleFocus, focusedCardIndex)}
        </Box>
    )
}