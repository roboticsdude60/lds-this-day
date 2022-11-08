import { router } from "../trpc";
import { postRouter } from "./post";
import { authRouter } from "./auth";
import { eventRouter } from "./event";

export const appRouter = router({
  // post: postRouter,
  event: eventRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
