import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const eventRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.interestingEvent.findMany({
      orderBy: [{ month: "asc" }, { day: "asc" }, { date: "asc" }],
    });
  }),

  filtered: publicProcedure
    .input(
      z.object({
        month: z.number(),
        day: z.number(),
        searchString: z.string().optional(),
      })
    )
    .query(({ ctx, input }) => {
      let where = {};
      if (input.month) Object.assign(where, { month: input.month });
      if (input.day) Object.assign(where, { day: input.day });
      if (!!input.searchString) Object.assign(where, { OR: [{ title: { contains: input.searchString } }, { description: { contains: input.searchString } }] });

      return ctx.prisma.interestingEvent.findMany({
        where,
        orderBy: [{ month: "asc" }, { day: "asc" }, { date: "asc" }],
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        date: z.date(),
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log("herew++++++++++++++++++");
      console.log(input.tags);
      const r = await ctx.prisma.interestingEvent.create({
        data: {
          date: input.date,
          month: input.date.getUTCMonth() + 1,
          day: input.date.getUTCDate(),
          title: input.title,
          description: input.description,
        },
      });
      console.log(r);
      return r;
    }),

  patchById: publicProcedure
    .input(
      z.object({
        id: z.string(),
        date: z.date(),
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log("herew++++++++++++++++++");
      console.log(input.tags);
      const r = await ctx.prisma.interestingEvent.update({
        where: { id: input.id },
        data: {
          date: input.date,
          month: input.date.getUTCMonth() + 1,
          day: input.date.getUTCDate(),
          title: input.title,
          description: input.description,
        },
      });
      console.log(r);
      return r;
    }),

  deleteById: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.interestingEvent.delete({ where: { id: input } });
    }),
});
