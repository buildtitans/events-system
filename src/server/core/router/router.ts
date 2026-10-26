import { router } from "@/src/server/core/context/init";
import { authRouter } from "./routes/auth/authRouter";
import { hydrationRouter } from "./routes/hydration/hydrationRouter";
import { discoveryRoute } from "./routes/discovery/discoveryRoute";
import { entitiesRoute } from "./routes/entities/entitiesRoute";

export const appRouter = router({
  auth: authRouter,
  entities: entitiesRoute,
  discovery: discoveryRoute,
  hydrate: hydrationRouter,
});

export type AppRouter = typeof appRouter;
