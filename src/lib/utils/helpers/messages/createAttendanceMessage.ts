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
    return "Nobody RSVP'd";
  }

  if (markedAttending === 1) {
    `${markedAttending} Person RSVP'd`;
  }

  return `${markedAttending} People RSVP'd`;
}
