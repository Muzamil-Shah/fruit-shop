import { ConvexError, v } from "convex/values";
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { ShippingInformation, roles } from "./schema";
import { hasAccessToOrg } from "./products";

export async function getUser(
  ctx: QueryCtx | MutationCtx,
  tokenIdentifier: string
) {
  console.log("getUser", tokenIdentifier);

  const user = await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q) =>
      q.eq("tokenIdentifier", tokenIdentifier)
    )
    .first();
  console.log("getUsers", user);

  if (!user) {
    throw new ConvexError("expected user to be defined");
  }

  return user;
}

export const createUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    name: v.string(),
    image: v.string(),
    role: roles,
  },
  async handler(ctx, args) {
    await ctx.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
      role: args.role,
      name: args.name,
      image: args.image,
    });
  },
});
export const updateUser = internalMutation({
  args: { tokenIdentifier: v.string(), name: v.string(), image: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier)
      )
      .first();

    if (!user) {
      throw new ConvexError("user is not exist");
    }

    await ctx.db.patch(user?._id, {
      name: args.name,
      image: args.image,
    });
  },
});
export const updateUserShippingInformation = mutation({
  args: {
    tokenIdentifier: v.string(),
    shippingInformation: ShippingInformation,
  },
  async handler(ctx, args) {
    console.log(args.tokenIdentifier);
    console.log(args.shippingInformation);
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier)
      )
      .first();

    if (!user) {
      throw new ConvexError("user is not exist");
    }

    await ctx.db.patch(user?._id, {
      shippingInformation:
        user?.shippingInformation && user?.shippingInformation?.length > 0
          ? [...user?.shippingInformation, args.shippingInformation]
          : [args.shippingInformation],
    });
  },
});

export const getAdminUsers = query({
  args: {
    orgId: v.string(),
    query: v.optional(v.string()),
    limit: v.number(),
    page: v.number(),
    // category: v.optional(v.string()),
    // status: v.optional(v.boolean()),
    // favorites: v.optional(v.boolean()),
    // sortPrice: v.optional(v.union(v.literal('lowest'),v.literal('highest'))),
    sort: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
  },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args?.orgId);

    if (!hasAccess) {
      return [];
    }
    let users = await ctx.db
      .query("users")
      .order(args?.sort ?? "desc")
      .take(args.limit * args.page);
    let usersAll = await ctx.db
      .query("users")
      .order(args?.sort ?? "desc")
      .collect();

    if (args.page > 1) {
      users = users.slice(args.limit * args.page - args.limit);
    }

    const query = args?.query;
    if (query) {
      users = users?.filter((user) =>
        user.name!.toLowerCase().includes(query.toLowerCase())
      );
    }

    return {
      data: users,
      pageCount: Math.ceil(usersAll?.length / args.limit),
      totalCount: usersAll?.length,
    };
  },
});
// export const addOrgIdToUser = internalMutation({
//     args: { tokenIdentifier: v.string(), orgId: v.string(), role: roles},
//     async handler(ctx, args){
//         const user = await getUser(ctx,args.tokenIdentifier)

//         await ctx.db.patch(user?._id,{
//             orgIds: [...user?.orgIds, {orgId: args.orgId, role: args.role}]
//         })
//     }
// })

// export const updateRoleInOrgForUser = internalMutation({
//     args: { tokenIdentifier: v.string(), orgId: v.string(), role: roles},
//     async handler(ctx, args){
//         const user = await getUser(ctx,args.tokenIdentifier)
//         console.log({user});

//         const org = user?.orgIds?.find(org => org.orgId === args.orgId);

//         if(!org){
//           throw new ConvexError("expected an org on the user but was not found when updating")
//         }

//         org.role = args.role;

//         await ctx.db.patch(user?._id,{
//             orgIds: user.orgIds
//         })
//     }
// })

export const getUserProile = query({
  args: { userId: v.id("users") },
  async handler(ctx, args) {
    const user = await ctx.db.get(args.userId);

    return {
      name: user?.name,
      image: user?.image,
    };
  },
});

export const getMe = query({
  args: {},
  async handler(ctx) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }

    const user = await getUser(ctx, identity?.tokenIdentifier);

    if (!user) {
      return null;
    }
    return user;
  },
});
