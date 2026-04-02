import { layoutSlotValidator } from "@/src/lib/utils/validation/validateSchema";
import type { Selectable } from "kysely";
import type { Events } from "@/src/server/core/db";
import { PaginatedLayoutSchemaType } from "@/src/schemas/events/layoutSlotSchema";
import {
  formatRawEvents,
  buildLayoutSlots,
} from "@/src/server/core/layout/utils";

function compileEventsLayout(
  rows: Selectable<Events>[],
): PaginatedLayoutSchemaType {
  const raw = formatRawEvents(rows);
  const layout = buildLayoutSlots(raw);

  return layoutSlotValidator(layout);
}

export { compileEventsLayout };
