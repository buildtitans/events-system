export type AsyncState<T, TEmptyMessage extends string = "No data found"> =
  | { status: "initial" }
  | { status: "pending" }
  | { status: "ready"; data: T }
  | { status: "n/a"; message: TEmptyMessage }
  | { status: "failed"; error: string };
