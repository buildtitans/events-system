export function limitDescription(
  description: string,
  maxLength: number,
): string {
  return description.length > maxLength
    ? description.slice(0, maxLength) + "..."
    : description;
}
