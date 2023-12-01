import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const updatePresence = mutation({
  args: {
    userId: v.string(),
    lastActive: v.number(),
    location: v.optional(v.string()),
    userName: v.optional(v.string()),
    userPicture: v.optional(v.string()),
  },
  handler: async (ctx, { userId, location, userName, userPicture }) => {
    const existing = await ctx.db
      .query("presence")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    let presence;
    if (existing) {
      await ctx.db.patch(existing._id, {
        lastActive: Date.now(),
        location: location,
      });
      presence = await ctx.db.get(existing._id);
    } else {
      const newId = await ctx.db.insert("presence", {
        userId: userId,
        lastActive: Date.now(),
        location: location,
        userName: userName,
        userPicture: userPicture,
      });
      presence = await ctx.db.get(newId);
    }

    return presence;
  },
});

export const getHomePresence = query({
  args: { location: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    // if (args.userId !== userId) {
    //   throw new Error("Unauthorized");
    // }

    const presence = await ctx.db
      .query("presence")
      .withIndex("by_location", (q) => q.eq("location", args.location))
      // .filter((q) => q.eq(q.field("location"), "documents"))
      .collect();

    return presence;
  },
});


// export const updateLocation = mutation({
//   args: {
//     userId: v.id("users"),
//     location: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();

//     if (!identity) {
//       throw new Error("Not authenticated");
//     }

//     const userId = identity.subject;

//     if (args.userId !== userId) {
//       throw new Error("Unauthorized");
//     }

//     const presence = await ctx.db
//       .query("presence")
//       .withIndex("by_user", (q) => q.eq("userId", userId))
//       .unique();

//     if (presence) {
//       await ctx.db.patch(presence._id, {
//         lastActive: Date.now(),
//         location: args.location,
//       });
//     }

//     return presence;
//   },
// });
