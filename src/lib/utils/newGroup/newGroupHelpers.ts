import type { NewGroupInputType } from "../../types/hooks/types";
import type { NewGroupInputSchemaType } from "@/src/schemas/groups/groupSchema";

function hasNonEmptyText(value: string | null): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeOptionalText(value: string | null): string | null {
  if (!hasNonEmptyText(value)) {
    return null;
  }

  return value.trim();
}

function isNewGroupSubmittable(newGroup: NewGroupInputType): boolean {
  return (
    hasNonEmptyText(newGroup.name) && hasNonEmptyText(newGroup.category_id)
  );
}

function normalizeNewGroupInput(
  newGroup: NewGroupInputType,
): NewGroupInputSchemaType {
  return {
    name: newGroup.name.trim(),
    description: normalizeOptionalText(newGroup.description),
    location: normalizeOptionalText(newGroup.location),
    category_id: hasNonEmptyText(newGroup.category_id)
      ? newGroup.category_id.trim()
      : null,
  };
}

export { normalizeNewGroupInput, isNewGroupSubmittable, normalizeOptionalText };
