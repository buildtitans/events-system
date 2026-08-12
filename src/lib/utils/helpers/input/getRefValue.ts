import type { RefObject } from "react";

export function getRefValue(
  ref: RefObject<HTMLInputElement | null>,
): string | null {
  const refState = ref.current;
  if (refState !== null) return refState.value;
  return null;
}
