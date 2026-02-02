import { layoutSlotValidator } from "@/src/lib/utils/validation/validateSchema";
import type { Selectable } from "kysely";
import type { Events } from "@/src/server/db";
import { PaginatedLayoutSchemaType } from "@/src/schemas/layoutSlotSchema";
import { formatRawEvents, buildLayoutSlots } from "@/src/server/layout/utils";

function compileEventsLayout(rows: Selectable<Events>[]): PaginatedLayoutSchemaType {

    const raw = formatRawEvents(rows);
    const layout = buildLayoutSlots(raw);
    const validLayout = layoutSlotValidator(layout);

    return validLayout;
};

export { compileEventsLayout };