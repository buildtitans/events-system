function isPastEvent(date: Date): boolean {
  return date < new Date();
}

export { isPastEvent };
