export function assertIsDefined<T>(data: T | null | undefined): boolean {
  return data !== null && data !== undefined;
}
