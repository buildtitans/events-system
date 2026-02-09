import { LayoutSlotSchemaType } from "@/src/schemas/layoutSlotSchema";
import { RenderLayout } from "../../pipelines/events/renderLayout";
import Box from "@mui/material/Box";

export default function ScheduledEvents({ layout }: { layout: LayoutSlotSchemaType[] }) {
    const focusedCardIndex = 0;
    const handleBlur = () => { }
    const handleFocus = () => { }


    return (
        <Box
        >
            {RenderLayout(layout, handleBlur, handleFocus, focusedCardIndex)}
        </Box>
    )
}