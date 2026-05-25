export function createAttendanceMessage(attended: number): string {
  if (attended === 0) {
    return "Nobody attended";
  }

  if (attended === 1) {
    return `${attended} Person attended`;
  }

  return `${attended} People attended`;
}

export function createArchivedEventHeadcount(markedAttending: number): string {
  if (markedAttending === 0) {
    return "Nobody was marked going";
  }

  if (markedAttending === 1) {
    return `${markedAttending} Person was going`;
  }

  return `${markedAttending} People were going`;
}
