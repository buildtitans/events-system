import { layoutSlotValidator } from "@/src/server/validation/validateSchema";
import type { Selectable } from "kysely";
import type { Events } from "@/src/server/db";
import { LayoutSlotSchemaArrayType } from "@/src/schemas/layoutSlotSchema";
import { formatRawEvents, buildLayoutSlots } from "@/src/server/layout/utils";

function compileEventsLayout(rows: Selectable<Events>[]): LayoutSlotSchemaArrayType {

    const raw = formatRawEvents(rows);
    const layout = buildLayoutSlots(raw);
    const validLayout = layoutSlotValidator(layout);

    return validLayout;
};

export { compileEventsLayout };