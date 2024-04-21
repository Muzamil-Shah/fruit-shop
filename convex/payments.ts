import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { internalMutation, internalQuery, query } from "./_generated/server";
import { hasOrdersAccess } from "./orders";

export const create = internalMutation({
  handler: async (ctx, { userId,
  orderId,
  razorpayId,
  signature,
success,amount }: { userId:Doc<"payments">['userId'],orderId:string,
  razorpayId:string,
  signature:string,
success :boolean,amount:number }) => {
    return await ctx.db.insert("payments", { userId,orderId,
      razorpayId,
      signature,
    success ,amount });
  },
});


export const getMessageId = query({
  args: { razorpayId: v.optional(v.string()) },
  handler: async (ctx, { razorpayId }) => {
    if (razorpayId === undefined) {
      return null;
    }
    return (await ctx.db.query('payments')
    .withIndex("razorpayId", (q) => q.eq("razorpayId", razorpayId))
    .unique())!;
  },
});


export const hasAccessForRazorPay = internalQuery({
  args: { orderId: v.id('orders') , orgId: v.string()},
  handler: async (ctx, args) => {
    // read from `ctx.db` here
    const access = await hasOrdersAccess(ctx, args.orderId,args.orgId)
return access
  },
});
export const paymentsQuery = internalQuery({
  args: { orderId: v.id('orders')},
  handler: async (ctx, args) => {
    // read from `ctx.db` here
    
return await ctx?.db?.query('payments').withIndex('by_orderId', q => q.eq('orderId',args?.orderId)).first()
  },
});
export const paymentsAndOrderMutation = internalMutation({
  args: { orderId: v.id('orders'),paymentId:v.id('payments')},
  handler: async (ctx, args) => {
    // read from `ctx.db` here
    await ctx.db.patch(args?.orderId,{
      isRefunded: true
    })
    await ctx.db.patch(args?.paymentId,{
      isRefunded: true
    })
  },
});
