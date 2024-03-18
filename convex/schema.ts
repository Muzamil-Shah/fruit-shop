import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  files: defineTable({ name: v.string() ,
    type: v.union(v.literal("image"), v.literal('csv'), v.literal('pdf')), orgId: v.string(), fileId: v.id("_storage"),}).index("by_orgId",['orgId']),
  favorites: defineTable({
    fileId: v.id('files'),
    orgId: v.string(),
    userId: v.id('users')
  }).index("by_userId_orgId_fileId", ["userId",'orgId','fileId']),
  users: defineTable({
    tokenIdentifier: v.string(),
    orgIds: v.array(v.string()),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),
});