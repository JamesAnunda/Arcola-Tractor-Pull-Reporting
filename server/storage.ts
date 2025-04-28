import {
  users, 
  inventoryItems, 
  purchaseHistory, 
  apiSyncLogs,
  type User, 
  type InsertUser,
  type InventoryItem,
  type InsertInventoryItem,
  type PurchaseHistory,
  type InsertPurchaseHistory,
  type ApiSyncLog,
  type InsertApiSyncLog,
  type CategoryMetrics
} from "@shared/schema";

export interface IStorage {
  // User methods (kept from original)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Inventory methods
  getInventoryItems(): Promise<InventoryItem[]>;
  getInventoryItemById(id: number): Promise<InventoryItem | undefined>;
  getInventoryItemsByCategory(category: string): Promise<InventoryItem[]>;
  getLowStockItems(): Promise<InventoryItem[]>;
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: number, item: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined>;
  deleteInventoryItem(id: number): Promise<boolean>;
  
  // Purchase history methods
  getPurchaseHistory(limit?: number): Promise<PurchaseHistory[]>;
  getPurchaseHistoryByDate(startDate: Date, endDate: Date): Promise<PurchaseHistory[]>;
  getPurchaseHistoryByItemId(itemId: number): Promise<PurchaseHistory[]>;
  createPurchaseHistory(purchase: InsertPurchaseHistory): Promise<PurchaseHistory>;
  
  // Sync log methods
  getLatestSyncLog(): Promise<ApiSyncLog | undefined>;
  createSyncLog(log: InsertApiSyncLog): Promise<ApiSyncLog>;
  
  // Dashboard metrics
  getCategoryMetrics(): Promise<CategoryMetrics>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private inventory: Map<number, InventoryItem>;
  private purchases: Map<number, PurchaseHistory>;
  private syncLogs: Map<number, ApiSyncLog>;
  private userId: number;
  private inventoryId: number;
  private purchaseId: number;
  private syncLogId: number;

  constructor() {
    this.users = new Map();
    this.inventory = new Map();
    this.purchases = new Map();
    this.syncLogs = new Map();
    this.userId = 1;
    this.inventoryId = 1;
    this.purchaseId = 1;
    this.syncLogId = 1;
    
    // Initialize with some sample inventory items
    this.initializeData();
  }

  // User methods (kept from original)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Inventory methods
  async getInventoryItems(): Promise<InventoryItem[]> {
    return Array.from(this.inventory.values());
  }
  
  async getInventoryItemById(id: number): Promise<InventoryItem | undefined> {
    return this.inventory.get(id);
  }
  
  async getInventoryItemsByCategory(category: string): Promise<InventoryItem[]> {
    return Array.from(this.inventory.values()).filter(
      (item) => item.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  async getLowStockItems(): Promise<InventoryItem[]> {
    return Array.from(this.inventory.values()).filter(
      (item) => item.stockQuantity <= item.reorderLevel
    );
  }
  
  async createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem> {
    const id = this.inventoryId++;
    const newItem: InventoryItem = { ...item, id };
    this.inventory.set(id, newItem);
    return newItem;
  }
  
  async updateInventoryItem(id: number, itemUpdate: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined> {
    const existingItem = this.inventory.get(id);
    if (!existingItem) return undefined;
    
    const updatedItem: InventoryItem = { ...existingItem, ...itemUpdate };
    this.inventory.set(id, updatedItem);
    return updatedItem;
  }
  
  async deleteInventoryItem(id: number): Promise<boolean> {
    return this.inventory.delete(id);
  }
  
  // Purchase history methods
  async getPurchaseHistory(limit?: number): Promise<PurchaseHistory[]> {
    const purchases = Array.from(this.purchases.values())
      .sort((a, b) => b.purchaseDate.getTime() - a.purchaseDate.getTime());
    
    return limit ? purchases.slice(0, limit) : purchases;
  }
  
  async getPurchaseHistoryByDate(startDate: Date, endDate: Date): Promise<PurchaseHistory[]> {
    return Array.from(this.purchases.values()).filter(
      (purchase) => {
        const purchaseDate = purchase.purchaseDate;
        return purchaseDate >= startDate && purchaseDate <= endDate;
      }
    ).sort((a, b) => b.purchaseDate.getTime() - a.purchaseDate.getTime());
  }
  
  async getPurchaseHistoryByItemId(itemId: number): Promise<PurchaseHistory[]> {
    return Array.from(this.purchases.values())
      .filter((purchase) => purchase.itemId === itemId)
      .sort((a, b) => b.purchaseDate.getTime() - a.purchaseDate.getTime());
  }
  
  async createPurchaseHistory(purchase: InsertPurchaseHistory): Promise<PurchaseHistory> {
    const id = this.purchaseId++;
    const newPurchase: PurchaseHistory = { ...purchase, id };
    this.purchases.set(id, newPurchase);
    return newPurchase;
  }
  
  // Sync log methods
  async getLatestSyncLog(): Promise<ApiSyncLog | undefined> {
    const logs = Array.from(this.syncLogs.values())
      .sort((a, b) => b.syncDate.getTime() - a.syncDate.getTime());
    
    return logs.length > 0 ? logs[0] : undefined;
  }
  
  async createSyncLog(log: InsertApiSyncLog): Promise<ApiSyncLog> {
    const id = this.syncLogId++;
    const newLog: ApiSyncLog = { ...log, id };
    this.syncLogs.set(id, newLog);
    return newLog;
  }
  
  // Dashboard metrics
  async getCategoryMetrics(): Promise<CategoryMetrics> {
    // Calculate revenue by category
    const allPurchases = await this.getPurchaseHistory();
    
    let foodRevenue = 0;
    let drinkRevenue = 0;
    let merchRevenue = 0;
    
    for (const purchase of allPurchases) {
      const item = this.inventory.get(purchase.itemId);
      if (!item) continue;
      
      switch (item.category.toLowerCase()) {
        case 'food':
          foodRevenue += purchase.totalPrice;
          break;
        case 'drink':
          drinkRevenue += purchase.totalPrice;
          break;
        case 'merchandise':
          merchRevenue += purchase.totalPrice;
          break;
      }
    }
    
    // Get low stock items count
    const lowStockItems = await this.getLowStockItems();
    
    return {
      foodRevenue,
      drinkRevenue,
      merchRevenue,
      lowStockCount: lowStockItems.length,
      foodRevenueChange: 12.3, // Placeholder values for change percentage
      drinkRevenueChange: 8.7,
      merchRevenueChange: -3.2,
    };
  }
  
  // Initialize with some data for testing
  private initializeData() {
    // This will be empty in production, as data will come from Square API
    // But we'll initialize with some test data for development
  }
}

export const storage = new MemStorage();
