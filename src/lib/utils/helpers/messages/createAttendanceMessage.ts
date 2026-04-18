export function createAttendanceMessage(attended: number): string {
  if (attended === 0) {
    return "Nobody attended";
  }

  if (attended === 1) {
    return `${attended} Person attended`;
  }

  return `${attended} People attended`;
}
