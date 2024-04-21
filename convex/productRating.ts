import { ConvexError, v } from "convex/values";
import { internalQuery, mutation, query } from "./_generated/server";
import { hasAccessToOrg } from "./products";

export const createProductRacting = mutation({
    args:{
        productId: v.id('products'),
        // userId: v.id('users'),
        rating: v.number(),
        orgId: v.string()
    },
    async handler(ctx, args) {
        const hasAccess = await hasAccessToOrg(ctx,args.orgId);

        if(!hasAccess){
            throw new ConvexError("you do not have access to this org")
        }

        await ctx?.db?.insert('productRating',{
            userId: hasAccess?.user?._id,
            productId: args.productId,
            rating: args.rating
        })
    },
})

export const getProductRating = query({
    args:{
        productId: v.id('products'),
        orgId: v.string()
    },
    async handler(ctx, args) {
        const hasAccess = await hasAccessToOrg(ctx,args.orgId);

        if(!hasAccess){
            throw new ConvexError("you do not have access to this org")
        }

        const productRaitngs = await ctx.db.query('productRating').withIndex('by_productId',q => q.eq('productId',args.productId)).collect()

        return productRaitngs
    },
})

export const userRatingExist = query({
    args:{
        productId: v.id('products'),
        orgId: v.string()
    },
    async handler(ctx, args) {
        const hasAccess = await hasAccessToOrg(ctx,args.orgId);

        if(!hasAccess){
            throw new ConvexError("you do not have access to this org")
        }

        const productRaitngsExist = await ctx.db.query('productRating').withIndex('by_productId_userId',q => q.eq('productId',args.productId).eq('userId',hasAccess?.user?._id)).first()

        return productRaitngsExist
    },
})



export const calculateAverageRating = query({
    args: {
        productId: v.id('products')
    },
    async handler(ctx, args) {
     const productRaitngs = await ctx.db.query('productRating').withIndex('by_productId',q => q.eq('productId',args.productId)).collect()
    const totalRatings = productRaitngs?.length;
    if(totalRatings === 0){
        return 0
    }
    const sum = productRaitngs.reduce((acc,curr) => acc + curr?.rating, 0);
    return sum / totalRatings
    },
})