import { pgTable, text, serial, integer, boolean, timestamp, real, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema - kept from original
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Inventory item schema
export const inventoryItems = pgTable("inventory_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // 'food', 'drink', 'merchandise'
  subcategory: text("subcategory"),
  sku: text("sku").notNull().unique(),
  price: real("price").notNull(),
  stockQuantity: integer("stock_quantity").notNull().default(0),
  reorderLevel: integer("reorder_level").notNull().default(5),
  imageUrl: text("image_url"),
  squareId: text("square_id").unique(),
});

export const insertInventoryItemSchema = createInsertSchema(inventoryItems).omit({
  id: true,
});

// Purchase history schema
export const purchaseHistory = pgTable("purchase_history", {
  id: serial("id").primaryKey(),
  itemId: integer("item_id").notNull(),
  quantity: integer("quantity").notNull(),
  totalPrice: real("total_price").notNull(),
  purchaseDate: timestamp("purchase_date").notNull().defaultNow(),
  squareOrderId: text("square_order_id"),
});

export const insertPurchaseHistorySchema = createInsertSchema(purchaseHistory).omit({
  id: true,
});

// API sync log schema
export const apiSyncLogs = pgTable("api_sync_logs", {
  id: serial("id").primaryKey(),
  syncDate: timestamp("sync_date").notNull().defaultNow(),
  status: text("status").notNull(), // 'success', 'failed'
  errorMessage: text("error_message"),
});

export const insertApiSyncLogSchema = createInsertSchema(apiSyncLogs).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InventoryItem = typeof inventoryItems.$inferSelect;
export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;

export type PurchaseHistory = typeof purchaseHistory.$inferSelect;
export type InsertPurchaseHistory = z.infer<typeof insertPurchaseHistorySchema>;

export type ApiSyncLog = typeof apiSyncLogs.$inferSelect;
export type InsertApiSyncLog = z.infer<typeof insertApiSyncLogSchema>;

// Custom types for frontend use
export type InventoryItemWithStatus = InventoryItem & {
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
};

export type CategoryMetrics = {
  foodRevenue: number;
  drinkRevenue: number;
  merchRevenue: number;
  lowStockCount: number;
  foodRevenueChange: number;
  drinkRevenueChange: number;
  merchRevenueChange: number;
};

export type DateRange = 'last7days' | 'last30days' | 'last90days' | 'custom';
