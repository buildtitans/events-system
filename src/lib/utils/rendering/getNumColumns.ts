export function getNumColumns(pagelength: number): number {
  if (pagelength > 1) {
    return 2;
  } else {
    return 1;
  }
}
