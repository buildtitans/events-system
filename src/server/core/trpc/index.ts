import {
    router,
} from "./trpc";
import { eventsRouter } from "./routers/events";

const appRouter = router({
    events: eventsRouter
});

type TrpcAppRouter = typeof appRouter;

export { appRouter }

export type { TrpcAppRouter };