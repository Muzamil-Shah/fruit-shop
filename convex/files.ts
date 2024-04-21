import { ConvexError, v } from 'convex/values'
import {MutationCtx, QueryCtx, internalMutation, mutation, query} from './_generated/server'
import { getUser } from './users';
import { Id } from './_generated/dataModel';
import { access } from 'fs';
import { FileType } from './schema';

export const generateUploadUrl = mutation(async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            throw new ConvexError("You must be logged in to upload a file")
        }
    return await ctx.storage.generateUploadUrl();
  });

async function hasAccessToOrg(ctx: QueryCtx | MutationCtx, orgId: string) {
    const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            return null
        }
        
        
    const user = await ctx.db.query("users").withIndex("by_tokenIdentifier", q => q.eq('tokenIdentifier', identity?.tokenIdentifier)).first()
        
    if(!user){
        return null;
    }
        const hasAccess =  user?.tokenIdentifier.includes(orgId)

        if(!hasAccess){
            return null
        }
        return {user}
}

export const createFile = mutation({
    args: {
        name: v.string(),
        fileId: v.id("_storage"),
        orgId: v.string(),
        type: v.union(v.literal("image"), v.literal('csv'), v.literal('pdf')),
    },
    async handler(ctx,args){
        // throw new Error("you have no access")

        const hasAccess = await hasAccessToOrg(ctx,args?.orgId)
        
        if(!hasAccess){
            throw new ConvexError("you do not have access to this org")
        }
        await ctx.db.insert('files', {
            name: args.name,
            fileId: args?.fileId,
            orgId: args.orgId,
            type: args.type,
            userId: hasAccess?.user?._id
        })
    }
})

export const getFiles = query({
    args: {
        orgId: v.string(),
        query: v.optional(v.string()),
        favorites: v.optional(v.boolean()),
        deletedOnly: v.optional(v.boolean()),
        type: v.optional(FileType)
    },
    async handler(ctx,args){
        
        const hasAccess = await hasAccessToOrg(ctx,args?.orgId)
        
        if(!hasAccess){
            return [];
        }
        let files = await ctx.db.query('files').withIndex("by_orgId", (q) => q.eq("orgId", args.orgId)).collect()
        const query = args?.query;
        if(query){

            files =  files?.filter((file) => file?.name.toLowerCase().includes(query.toLowerCase()) )
        }
        if(args?.favorites){
            
            const favorites =  await ctx?.db?.query('favorites').withIndex("by_userId_orgId_fileId", q => q.eq('userId', hasAccess?.user?._id).eq('orgId', args.orgId)).collect()
            files = files.filter((file) => favorites?.some((favorite) => favorite?.fileId === file?._id))
        }
        if(args.deletedOnly){
            
            files = files.filter((file) => file.shouldDelete)
        }else {
            files = files.filter((file) => !file.shouldDelete)
        }

        if(args.type){
            files = files.filter((file) => file.type === args.type)
        }
            return files;
        
    }
})

export const deleteALlFiles = internalMutation({
    args: {},
    async handler(ctx) {
        const files = await ctx.db.query('files').withIndex('by_shouldDelete', (q) => q.eq("shouldDelete",true)).collect()

        await Promise.all(files.map(async file => {
            await ctx.storage.delete(file.fileId);
            return await ctx.db.delete(file?._id)
        }))
    },
})
export const deleteFile = mutation({
    args: {fileId: v.id('files')},
    async handler(ctx, args) {
        const access = await hasFileAccess(ctx, args.fileId)

        if(!access){
            throw new ConvexError('no access to file')
        }

        const canDelete =  access?.user?.role === 'admin';

        if(!canDelete){
            throw new ConvexError("you have no admin access to delete")
        }

        await ctx?.db?.patch(args?.fileId,{
            shouldDelete: true
        })
    },
})
export const restoreFile = mutation({
    args: {fileId: v.id('files')},
    async handler(ctx, args) {
        const access = await hasFileAccess(ctx, args.fileId)

        if(!access){
            throw new ConvexError('no access to file')
        }

        const canRestore =  access?.user?.role === 'admin';

        if(!canRestore){
            throw new ConvexError("you have no admin access to delete")
        }

        await ctx?.db?.patch(args?.fileId,{
            shouldDelete: false
        })
    },
})
export const toggleFavorite = mutation({
    args: {fileId: v.id('files')},
    async handler(ctx, args) {
        const access = await hasFileAccess(ctx, args.fileId)

        if(!access){
            throw new ConvexError('no access to file')
        }
        const favorite = await ctx.db.query("favorites").withIndex('by_userId_orgId_fileId', q => q.eq('userId',access?.user?._id).eq('orgId',access?.file?.orgId).eq('fileId',access?.file?._id)).first();

        if(!favorite){
            await ctx.db.insert('favorites', {
                fileId: access?.file?._id,
                orgId: access?.file?.orgId,
                userId: access?.user?._id
            })
        }else{
            await ctx.db.delete(favorite?._id)
        }
            
    },

})
export const getAllFavorites = query({
    args: {orgId: v.string()},
    async handler(ctx, args) {
        
        const hasAccess = await hasAccessToOrg(ctx,args?.orgId)
        
        

        if(!hasAccess){
            return []
        }
        const favorites = await ctx.db.query("favorites").withIndex('by_userId_orgId_fileId', (q) => q.eq('userId',hasAccess?.user?._id).eq('orgId',args?.orgId)).collect();

        return favorites;
            
    },

})
const hasFileAccess = async(ctx:QueryCtx | MutationCtx,fileId: Id<'files'>) =>{
    

        const file = await ctx.db.get(fileId)

        if(!file){
            return null
        }

        const hasAccess = await hasAccessToOrg(ctx,file?.orgId)
        
        if(!hasAccess){
            return null;
        }

        
        return {user:hasAccess?.user, file}
}