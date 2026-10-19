import { router } from "@/src/server/core/context/init";
import { authRouter } from "./routes/authRouter";
import { hydrationRouter } from "./routes/hydrationRouter";
import { discoveryRoute } from "./routes/discoveryRoute";
import { entitiesRoute } from "./routes/entitiesRoute";

export const appRouter = router({
  entities: entitiesRoute,
  hydrate: hydrationRouter,
  auth: authRouter,
  discovery: discoveryRoute,
});

export type AppRouter = typeof appRouter;
