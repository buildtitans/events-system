export type AsyncState<T, TEmptyMessage extends string = "No data found"> =
  | { status: "initial" }
  | { status: "pending" }
  | { status: "ready"; data: T }
  | { status: "n/a"; message: TEmptyMessage }
  | { status: "failed"; error: string };

export type AppBootState =
  | { status: "initial" }
  | { status: "pending" }
  | { status: "ready" }
  | {
      status: "n/a";
      message: "The app is temporarily unavailable";
    }
  | {
      status: "failed";
      error: "INITIAL_DOMAIN_SYNC_FAILED";
      message: "The app could not load its required startup data";
    };
