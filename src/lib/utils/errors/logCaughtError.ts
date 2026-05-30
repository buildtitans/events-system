export function logCaughtError(context: string, error: unknown): void {
  console.error(`${context}`);

  if (error instanceof Error) {
    const toPrint = error.stack ?? error.message;
    console.error(toPrint);
    return;
  }

  console.dir(error, { depth: null });
}
