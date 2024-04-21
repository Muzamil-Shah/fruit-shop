import { ConvexError, v } from 'convex/values'
import {MutationCtx, QueryCtx, internalMutation, mutation, query} from './_generated/server'
import { getUser } from './users';
import { Id } from './_generated/dataModel';
import { access } from 'fs';
import { FileType } from './schema';
import { paginationOptsValidator } from 'convex/server';

export const generateUploadUrl = mutation(async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
  
    if (!identity) {
      throw new ConvexError("you must be logged in to upload a file");
    }
  
    return await ctx.storage.generateUploadUrl();
  });

export async function hasAccessToOrg(ctx: QueryCtx | MutationCtx,orgId:string) {
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

export const createProduct = mutation({
    args: {
        name: v.string(),
    category: v.string(),
    limit: v.number(),
    selectedPrice: v.array(v.object({
      price: v.number(),
      quantity: v.string(),
      buyPrice: v.number()
    })),
    status: v.boolean(),
    fileStorageId: v.id("_storage"),
    orgId: v.string(),
    description: v.string()
    },
    async handler(ctx,args){
        // throw new Error("you have no access")

        const hasAccess = await hasAccessToOrg(ctx,args.orgId)
        
        if(!hasAccess){
            throw new ConvexError("you do not have access to this org")
        }
        await ctx.db.insert('products', {
            name: args.name,
            category: args.category,
            limit: args.limit,
            selectedPrice: args.selectedPrice,
            status: args.status,
            fileStorageId: args?.fileStorageId,
            userId: hasAccess?.user?._id,
            orgId:args.orgId,
            description: args.description
        })
    }
})

export const getProducts = query({
    args: {
        orgId: v.string(),
        query: v.optional(v.string()),
        category: v.optional(v.string()),
        status: v.optional(v.boolean()),
        favorites: v.optional(v.boolean()),

    },
    async handler(ctx,args){
        
        const hasAccess = await hasAccessToOrg(ctx,args?.orgId)
        
        if(!hasAccess){
            return [];
        }
        let products = await ctx.db.query('products').collect()
        const query = args?.query;
        if(query){

            products =  products?.filter((file) => file?.name.toLowerCase().includes(query.toLowerCase()) )
        }
        if(args?.favorites){
            
            const favorites =  await ctx?.db?.query('favorites').withIndex("by_userId_orgId_fileId", q => q.eq('userId', hasAccess?.user?._id).eq('orgId', args.orgId)).collect()
            products = products.filter((file) => favorites?.some((favorite) => favorite?.fileId === file?._id))
        }
        if(args.status){
            
            products = products.filter((file) => file.status)
        }

        if(args.category){
            products = products.filter((file) => file.category === args.category)
        }
        const productsWithUrl = await Promise.all(
            products.map(async (product) => ({
              ...product,
              url: await ctx.storage.getUrl(product.fileStorageId),
            }))
          );
            return productsWithUrl;
        
    }
})

export const getProductsWithPagination = query({
    args: {
        paginationOpts: paginationOptsValidator,
        
            // query: v.optional(v.string())
        filter: v.object({
            orgId: v.string(),
            query: v.optional(v.string()),
            category: v.optional(v.string()),
            status: v.optional(v.boolean()),
            favorites: v.optional(v.boolean()),
            sortPrice: v.optional(v.union(v.literal('lowest'),v.literal('highest'))),
            sort: v.optional(v.union(v.literal('asc'),v.literal('desc')))
        }),
            
    },
    async handler(ctx,args){
        const hasAccess = await hasAccessToOrg(ctx,args?.filter?.orgId)
        
        
        
        let products = await ctx.db.query('products').order(args?.filter?.sort ?? 'desc').paginate(args?.paginationOpts)
        
        const query = args?.filter
        ?.query;
        if(query){

            products =  {...products,page:products?.page?.filter((file) => file?.name.toLowerCase().includes(query.toLowerCase()) )}
        }
        if(args?.filter?.favorites && hasAccess?.user){
            
            const favorites =  await ctx?.db?.query('favorites').withIndex("by_userId_orgId_fileId", q => q.eq('userId', hasAccess?.user?._id).eq('orgId', args?.filter?.orgId)).collect()
            products = {...products,page: products?.page?.filter((file) => favorites?.some((favorite) => favorite?.fileId === file?._id))}
        }
        if(args?.filter?.status){
            
            products = {...products,page: products?.page?.filter((file) => file.status)}
        }

        if(args?.filter?.category){
            products = {...products,page: products?.page?.filter((file) => file.category === args?.filter?.category)}
        }
        console.log({products});
        const productsWithUrl = await Promise.all(
            products?.page?.map(async (product) => ({
              ...product,
              url: await ctx.storage.getUrl(product.fileStorageId),
            }))
          );
        
            return{ ...products,page:productsWithUrl};
        
    }
})
export const deleteAllProducts = internalMutation({
    args: {},
    async handler(ctx) {
        const files = await ctx.db.query('files').withIndex('by_shouldDelete', (q) => q.eq("shouldDelete",true)).collect()

        await Promise.all(files.map(async file => {
            await ctx.storage.delete(file.fileId);
            return await ctx.db.delete(file?._id)
        }))
    },
})
export const deleteProduct = mutation({
    args: {fileId: v.id('products'),fileStorageId:v.id("_storage")},
    async handler(ctx, args) {
        const access = await hasProductsAccess(ctx, args.fileId)

        if(!access){
            throw new ConvexError('no access to file')
        }

        const canDelete = access?.product?.userId === access?.user?._id || access?.user?.role === 'admin';

        if(!canDelete){
            throw new ConvexError("you have no admin access to delete")
        }

        await ctx.storage.delete(args?.fileStorageId)
        await ctx?.db?.delete(args?.fileId)
    },
})
export const updateProduct = mutation({
    args: {
        fileId: v.id('products')
    , name: v.optional(v.string()),
    category: v.optional(v.string()),
    limit:v.optional(v.number()),
    selectedPrice: v.optional(v.array(v.object({
      price: v.number(),
      quantity: v.string(),
      buyPrice: v.number()
    }))),
    status: v.optional(v.boolean()),
    fileStorageId: v.optional(v.id("_storage")),
    description: v.optional(v.string()),
    orgId: v.optional(v.string())},
    async handler(ctx, args) {
        const access = await hasProductsAccess(ctx, args.fileId)

        if(!access){
            throw new ConvexError('no access to file')
        }

        const canRestore = access?.product?.userId === access?.user?._id || access?.user?.role === 'admin';

        if(!canRestore){
            throw new ConvexError("you have no admin access to delete")
        }
        console.log('status',args?.status);
        console.log('this',args?.fileId, access?.product);
        

        await ctx?.db?.patch(access?.product?._id,{
            name: args.name ?? access.product.name,
            category: args.category ?? access.product.category,
            status: args.status ?? access.product.status,
            fileStorageId: args.fileStorageId ?? access.product.fileStorageId,
            limit: args.limit ?? access.product.limit,
            selectedPrice: args.selectedPrice ?? access.product.selectedPrice,
            orgId: args.orgId ?? access.product.orgId,
            description: args.description ?? access.product.description
        })
    },
})
export const getProductDetails = query({
    args: {
        productId: v.id('products')},
    async handler(ctx, args) {
        const access = await hasProductsAccess(ctx, args.productId)

        if(!access){
            throw new ConvexError('no access to file')
        }

        const canRestore = access?.product?.userId === access?.user?._id || access?.user?.role === 'admin';

        if(!canRestore){
            throw new ConvexError("you have no admin access to delete")
        }
        
        

       const productDetails = await ctx?.db?.get(access?.product?._id)
       const productWithUrl = productDetails ? {
          ...productDetails,
          url: await ctx.storage.getUrl(productDetails.fileStorageId),
        } : null
        return productWithUrl;
    },
})
export const toggleFavorite = mutation({
    args: {fileId: v.id('products'),orgId: v.string()},
    async handler(ctx, args) {
        const hasAccess = await hasAccessToOrg(ctx,args?.orgId)
        
        if(!hasAccess){
            return [];
        }

        const product = await ctx.db.get(args.fileId)

        if(!product){
            return null
        }
        const favorite = await ctx.db.query("favorites").withIndex('by_userId_orgId_fileId', q => q.eq('userId',hasAccess?.user?._id).eq('orgId',args.orgId).eq('fileId',product?._id)).first();

        if(!favorite){
            await ctx.db.insert('favorites', {
                fileId: product?._id,
                orgId: args.orgId,
                userId: hasAccess?.user?._id
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
const hasProductsAccess = async(ctx:QueryCtx | MutationCtx,productId: Id<'products'>) =>{
    

        const product = await ctx.db.get(productId)

        if(!product){
            return null
        }

        const hasAccess = await hasAccessToOrg(ctx,product?.orgId)
        
        if(!hasAccess){
            return null;
        }

        
        return {user:hasAccess?.user, product}
}