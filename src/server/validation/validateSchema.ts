import { TypeSystem } from "@sinclair/typebox/system";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import type { TSchema } from "@sinclair/typebox";
import type { Static } from "@sinclair/typebox";
import type { ValueError } from "@sinclair/typebox/compiler";
import { EventsArraySchema } from "@/src/schemas/eventSchema";
import { CardVariantTypeSchema, PaginatedLayoutSchema } from "@/src/schemas/layoutSlotSchema";
import { AuthorsSchema } from "@/src/schemas/eventSchema";
import { GroupSchema } from "@/src/schemas/groupSchema";
import { NewGroupInputSchema } from "@/src/schemas/groupSchema";

TypeSystem.Format("date-time", (value) => {
    if (typeof value !== "string") return false;
    const t = Date.parse(value);
    if (!Number.isFinite(t)) return false;

    return /(?:Z|[+-]\d{2}:\d{2})$/.test(value);
});


function preview(value: unknown, max = 160) {
    if (value == null) return String(value);
    try {
        const s = typeof value === "string" ? value : JSON.stringify(value);
        return s.length > max ? s.slice(0, max) + "…(truncated)" : s;
    } catch {
        return "[unserializable]";
    }
}

function formatErrors(errors: ValueError[]) {
    return errors
        .map((e, i) => {
            const path = e.path || "(root)";
            return [
                `#${i + 1} ${path}`,
                `  message: ${e.message}`,
                `  value:   ${preview(e.value)}`,
            ].join("\n");
        })
        .join("\n");
}

export function createValidator<T extends TSchema>(schema: T, schemaName = "Schema") {
    const compiled = TypeCompiler.Compile(schema);

    return (data: unknown): Static<T> => {
        if (!compiled.Check(data)) {
            const errs = [...compiled.Errors(data)];

            console.error(
                `\n❌ ${schemaName} validation failed (${errs.length} errors)\n${formatErrors(errs)}\n`
            );

            throw new Error(
                `${schemaName} validation failed (${errs.length} errors). See console for details.`
            );
        }

        return data as Static<T>;
    };
}


const eventsValidator = createValidator(EventsArraySchema, "EventsArraySchema");

const layoutSlotValidator = createValidator(PaginatedLayoutSchema, "PaginatedLayoutSchema");

const AuthorsValidator = TypeCompiler.Compile(AuthorsSchema);

const GroupSchemaValidator = createValidator(GroupSchema, "GroupsSchema");


export { AuthorsValidator, eventsValidator, layoutSlotValidator, GroupSchemaValidator };
