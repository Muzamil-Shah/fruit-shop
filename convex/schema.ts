import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const roles = v.union(v.literal('admin'), v.literal('member'));
export const FileType = v.union(v.literal("image"), v.literal('csv'), v.literal('pdf'))
export const DeliveryStatus = v.union(v.literal('ordered'),v.literal('accepted'),v.literal('ready'),v.literal('pickup'),v.literal('completed'),v.literal('cancelled'),v.literal('returned'))
export const ShippingInformation = v.object({
  save_as: v.union(v.literal("Home"), v.literal("Work"), v.literal("Hotel"),v.literal("Other")),
receiver_name: v.string(),
receiver_contact: v.string(),
building: v.string(),
address: v.string(),
near_by: v.optional(v.string()),
})

export const PaymentMethod = v.union(v.literal('cash'), v.literal('online'))

export const AmountSummary = v.object({
  itemTotal: v.number(),
  shopChargesAndGST: v.number(),
  deliveryPartnerFee: v.number(),
  platformFee: v.number(),
  feedingIndiaDonation: v.optional(v.number()),
  grandTotal: v.number(),
  cashRoundOff: v.number(),
  toPay: v.number()
})
export default defineSchema({
  files: defineTable({ name: v.string() ,
    type: FileType, 
    orgId: v.string(), 
    fileId: v.id("_storage"),
    shouldDelete: v.optional(v.boolean()),
    userId: v.id('users')
  }).index("by_orgId",['orgId']).index("by_shouldDelete",["shouldDelete"]),
  favorites: defineTable({
    fileId: v.union(v.id('products'), v.id('files')),
    orgId: v.string(),
    userId: v.id('users')
  }).index("by_userId_orgId_fileId", ["userId",'orgId','fileId']),
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    shippingInformation: v.optional(v.array(ShippingInformation)),
    role: roles
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),
  payments: defineTable({
    userId: v.id("users"),
        orderId: v.string(),
        razorpayId: v.string(),
        signature: v.string(),
      success: v.boolean(),
      amount: v.number(),
      isRefunded: v.optional(v.boolean())
  }).index('razorpayId',['razorpayId']).index('by_orderId',['orderId']),
  products: defineTable({
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
    userId: v.id('users'),
    orgId: v.string(),
    description: v.string()
  }).index("by_orgId",['orgId']),
  notifications: defineTable({
    userId: v.string(),
    notification: v.object({title: v.string(),description: v.string()}),
    seen: v.boolean()
  }).index('by_userId',['userId']).index("by_seen",["seen"]),
  productRating: defineTable({
    productId: v.id('products'),
    userId: v.id('users'),
    rating: v.number()
  }).index('by_productId',['productId']).index('by_productId_userId',['productId','userId']),
  orders: defineTable({
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
    url: v.string()
    })),
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
    isRefunded:v.optional(v.boolean())
  }).index("by_userId",['userId']),
});