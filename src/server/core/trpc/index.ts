import {
    router,
    publicProcedure
} from "./trpc";

const appRouter = router({
    //public procedure code will go here
});

type AppRouter = typeof appRouter;

export type { AppRouter };