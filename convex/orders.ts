import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, mutation, query } from "./_generated/server";
import { AmountSummary, DeliveryStatus, PaymentMethod, ShippingInformation } from "./schema";
import { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import { paginationOptsValidator } from "convex/server";

async function hasAccessToOrg(ctx: QueryCtx | MutationCtx,orgId:string) {
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

export const createorder = mutation({
    args: {
        items: v.array(v.object({
        productId: v.id("products"),
        name: v.string(),
      category: v.string(),
      limit: v.number(),
      selectedPrice: v.object({
        price: v.number(),
        quantity: v.string()
      }),
      status: v.boolean(),
      fileStorageId: v.id("_storage"),
      userId: v.id('users'),
      orgId: v.string(),
      description: v.string(),
      qty: v.number(),
      offer: v.optional(v.number()),
      url: v.string()})),
      shippingInformation: ShippingInformation,
    paymentMethod: PaymentMethod,
    deliveryStatus: DeliveryStatus,
    userId: v.id('users'),
    deliveryBy: v.optional(v.string()),
    isPaid: v.boolean(),
    paymentDetails: v.optional(v.object({
      paymentId: v.string(),

    })),
    amountSummary: AmountSummary,
    orgId: v.string(),
    },
    async handler(ctx,args){
        // throw new Error("you have no access")

        const hasAccess = await hasAccessToOrg(ctx,args.orgId)
        
        if(!hasAccess){
            throw new ConvexError("you do not have access to this org")
        }
        const order = await ctx.db.insert('orders', {
            items: args.items,
            shippingInformation: args.shippingInformation,
            paymentMethod: args.paymentMethod,
            paymentDetails: args.paymentDetails,
            isPaid: args.isPaid,
            deliveryStatus: args.deliveryStatus,
            deliveryBy: args.deliveryBy,
            userId: args.userId,
            amountSummary: args.amountSummary
        })
       await ctx?.db.insert('notifications',{userId: args.userId, seen: false, notification: {title: 'New Order Placed',description: 'your order with order id aksldf3k23jl is successfuly placed'}})
    }
})

export const getOrders = query({
    args: {
        orgId: v.string(),
        query: v.optional(v.string()),
        paymentMethod: v.optional(PaymentMethod),
        deliveryStatus: v.optional(DeliveryStatus),

    },
    async handler(ctx,args){
        
        const hasAccess = await hasAccessToOrg(ctx,args?.orgId)
        
        if(!hasAccess){
            return []
        }
       
        let orders = await ctx.db.query('orders').withIndex("by_userId", (q) => q.eq("userId", hasAccess?.user?._id)).order('desc').collect()
        const query = args?.query;
        if(query){

            orders =  orders?.filter((order) => order?.items.map(item => item?.name.toLowerCase().includes(query.toLowerCase())) )
        }
        if(args.deliveryStatus){
            
            orders = orders.filter((order) => order.deliveryStatus === args.deliveryStatus)
        }

        if(args.paymentMethod){
            orders = orders.filter((order) => order.paymentMethod === args.paymentMethod)
        }
        
            return orders;
        
    }
})

export const getOrdersWithPagination = query({
    args: {
        paginationOpts: paginationOptsValidator,
        
            // query: v.optional(v.string())
        filter: v.object({
            orgId: v.string(),
        query: v.optional(v.string()),
        paymentMethod: v.optional(PaymentMethod),
        deliveryStatus: v.optional(DeliveryStatus),
            sort: v.optional(v.union(v.literal('asc'),v.literal('desc')))
        }),
            
    },
    async handler(ctx,args){
        const hasAccess = await hasAccessToOrg(ctx,args?.filter?.orgId)
        
        // if(!hasAccess){
        //     return [];
        // }
        let orders = hasAccess?.user?._id ?   await ctx.db.query('orders').withIndex('by_userId',q => q.eq('userId',hasAccess?.user?._id)).order(args?.filter?.sort ?? 'desc').paginate(args?.paginationOpts) :  await ctx.db.query('orders').order(args?.filter?.sort ?? 'desc').paginate(args?.paginationOpts)
        
        const query = args?.filter
        ?.query;
        if(query){

            orders =  {...orders,page:orders?.page?.filter((order) => order?.items[0]?.name.toLowerCase().includes(query.toLowerCase()) )}
        }
        
        if(args?.filter?.deliveryStatus){
            
            orders = {...orders,page: orders?.page?.filter((order) => order.deliveryStatus === args.filter.deliveryStatus)}
        }

        if(args?.filter?.paymentMethod){
            orders = {...orders,page: orders?.page?.filter((order) => order.paymentMethod === args?.filter?.paymentMethod)}
        }
       
        const productsWithUrl = await Promise.all(
            orders?.page?.map(async (order) => ({
              ...order,
              
            }))
          );
        
            return {...orders,page:productsWithUrl }
        
    }
})

export const getAllOrders = query({
    args: {
        orgId: v.string(),
        query: v.optional(v.string()),
        paymentMethod: v.optional(PaymentMethod),
        deliveryStatus: v.optional(DeliveryStatus),

    },
    async handler(ctx,args){
        
        const hasAccess = await hasAccessToOrg(ctx,args?.orgId)
        
        if(!hasAccess){
            return [];
        }
        let orders = await ctx.db.query('orders').order('desc').collect()
        const query = args?.query;
        if(query){

            orders =  orders?.filter((order) => order?.items.map(item => item?.name.toLowerCase().includes(query.toLowerCase())) )
        }
        if(args.deliveryStatus){
            console.log(args.deliveryStatus);
            
            
            orders = orders.filter((order) => order.deliveryStatus === args.deliveryStatus)
        }

        if(args.paymentMethod){
            orders = orders.filter((order) => order.paymentMethod === args.paymentMethod)
        }
        
            return orders;
        
    }
})


export const getAllNewOrders = query({
    args: {
        orgId: v.string(),
        deliveryStatus: DeliveryStatus,

    },
    async handler(ctx,args){
        
        const hasAccess = await hasAccessToOrg(ctx,args?.orgId)
        
        if(!hasAccess){
            return [];
        }
        let orders = await ctx.db.query('orders').filter((q) => q.eq(q.field("deliveryStatus"), args.deliveryStatus)).order('desc').collect()
        
            return orders;
        
    }
})

export const updateOrder = mutation({
    args: {
        orderId: v.id('orders'),
        deliveryStatus:v.optional(DeliveryStatus),
        deliveryBy: v.optional(v.string()),
    orgId: v.string()
},
    async handler(ctx, args) {
        const access = await hasOrdersAccess(ctx, args.orderId,args.orgId)

        if(!access){
            throw new ConvexError('no access to file')
        }

        const canRestore = access?.order?.userId === access?.user?._id || access?.user?.role === 'admin';

        if(!canRestore){
            throw new ConvexError("you have no admin access to delete")
        }
        

        await ctx?.db?.patch(access?.order?._id,{
            deliveryStatus: args.deliveryStatus ?? access.order.deliveryStatus,
            deliveryBy: args?.deliveryBy ?? access.order.deliveryBy
        })

        if(args?.deliveryStatus){
            await ctx.db.insert('notifications',{userId: access?.order?.userId,seen: false, notification: {
                title: `Order ${args.deliveryStatus}`,
                description: `your order with id(${args.orderId}) ${args.deliveryStatus} from ourside, we will updated soon`
            }})
        }
    },
})

export const hasOrdersAccess = async(ctx:QueryCtx | MutationCtx,orderId: Id<'orders'>,orgId: string) =>{
    

    const order = await ctx.db.get(orderId)

    if(!order){
        return null
    }

    const hasAccess = await hasAccessToOrg(ctx,orgId)
    
    if(!hasAccess){
        return null;
    }

    
    return {user:hasAccess?.user, order}
}