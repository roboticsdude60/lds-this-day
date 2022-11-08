import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod"

export const eventRouter = router({
    all: publicProcedure.query(( { ctx }) => {
        return ctx.prisma.interestingEvent.findMany();
    }),
    create: publicProcedure
    .input(z.object({ date: z.date(), title: z.string(), description: z.string(), tags: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
        console.log('herew++++++++++++++++++');
        console.log(input.tags);
        const r = await ctx.prisma.interestingEvent.create({ data: {
            date: input.date, 
            month: input.date.getUTCMonth(),
            day: input.date.getUTCDay(),
            title: input.title,
            description: input.description,
        } });
        console.log(r);
        return r;
    }),
    deleteById: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
        return ctx.prisma.interestingEvent.delete({ where: { id: input } })
    }),
});