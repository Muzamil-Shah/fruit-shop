import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { hasAccessToOrg } from "./products";

export const createNotification = internalMutation({args: {
    userId: v.id('users'),
    notification: v.object({
        title: v.string(),
        description: v.string()
    }),
    orgId: v.string()
},
async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx,args.orgId)
        
        if(!hasAccess){
            throw new ConvexError("you do not have access to this org")
        }

        await ctx.db.insert('notifications', {
            userId: args.userId,
            notification: args.notification,
            seen: false
        })
},
})

export const getNotification = query({
    args: {
        userId: v.string(),
        orgId: v.string()
    },
    async handler(ctx, args) {
        const hasAccess = await hasAccessToOrg(ctx,args.orgId)
        
        if(!hasAccess){
            return []
        }

       

            const notifications = await ctx?.db?.query('notifications').withIndex('by_userId',q => q.eq('userId',args.userId)).order('desc').collect();
            
            return notifications
        
    },
})

export const updateNotification = mutation({args: {
    orgId: v.string(),
    userId: v.string()
},
async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx,args.orgId)
        
    if(!hasAccess){
        throw new ConvexError("you do not have access to this org")
    }

    const notifications = await ctx.db.query('notifications').withIndex('by_userId', q => q.eq('userId', args.userId)).collect()

    await Promise.all(notifications?.map(async noti => {
        return await ctx.db.patch(noti?._id, {
            seen: true
        })
    }))
},
})

export const deleteALlFiles = internalMutation({
    args: {},
    async handler(ctx) {
        const notifications = await ctx.db.query('notifications').withIndex('by_seen', (q) => q.eq("seen",true)).collect()

        await Promise.all(notifications.map(async noti => {
            return await ctx.db.delete(noti?._id)
        }))
    },
})