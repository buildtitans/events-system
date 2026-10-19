import { router } from "@/src/server/core/context/init";
import { authRouter } from "./routes/auth/authRouter";
import { hydrationRouter } from "./routes/hydration/hydrationRouter";
import { discoveryRoute } from "./routes/discovery/discoveryRoute";
import { entitiesRoute } from "./routes/entities/entitiesRoute";

export const appRouter = router({
  entities: entitiesRoute,
  hydrate: hydrationRouter,
  auth: authRouter,
  discovery: discoveryRoute,
});

export type AppRouter = typeof appRouter;
