"use client";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/lib/store";
import { usePathname, useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import { JSX, useMemo } from "react";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { getGroupSlugRoute } from "@/src/lib/utils/parsing/getGroupSlugRoute";
import { enqueueDrawer } from "@/src/lib/store/slices/rendering/RenderingSlice";

export default function CheckOutGroupButton({ event }: { event: EventSchemaType | null }): JSX.Element | null {
    const path = usePathname();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const groups = useSelector((s: RootState) => s.groups.communities);
    const route = useMemo(() => getGroupSlugRoute(groups, event),
        [event, groups]);

    const handleDirectToGroup = () => {
        router.push(route);
        dispatch(enqueueDrawer(null));
    };

    if (path !== "/") return null;

    return (
        <Button
            size="medium"
            variant="contained"
            onClick={handleDirectToGroup}
            sx={{
                width: '90%',
                marginX: 'auto'
            }}
        >
            Check out the group
        </Button>
    )
}