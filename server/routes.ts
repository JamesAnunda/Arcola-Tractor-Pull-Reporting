import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertInventoryItemSchema,
  insertPurchaseHistorySchema,
  insertApiSyncLogSchema,
  type DateRange 
} from "@shared/schema";
import { syncWithSquare } from "./square-service";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // API Routes - prefix all routes with /api
  
  // Inventory routes
  app.get("/api/inventory", async (_req: Request, res: Response) => {
    try {
      const items = await storage.getInventoryItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory items" });
    }
  });
  
  app.get("/api/inventory/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getInventoryItemById(id);
      if (!item) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory item" });
    }
  });
  
  app.get("/api/inventory/category/:category", async (req: Request, res: Response) => {
    try {
      const category = req.params.category;
      const items = await storage.getInventoryItemsByCategory(category);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory items by category" });
    }
  });
  
  app.get("/api/inventory/low-stock", async (_req: Request, res: Response) => {
    try {
      const items = await storage.getLowStockItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch low stock items" });
    }
  });
  
  app.post("/api/inventory", async (req: Request, res: Response) => {
    try {
      const validatedData = insertInventoryItemSchema.parse(req.body);
      const newItem = await storage.createInventoryItem(validatedData);
      res.status(201).json(newItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid inventory item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create inventory item" });
    }
  });
  
  app.put("/api/inventory/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      // Only validate the fields that are present
      const validatedData = insertInventoryItemSchema.partial().parse(req.body);
      const updatedItem = await storage.updateInventoryItem(id, validatedData);
      if (!updatedItem) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      res.json(updatedItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid inventory item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update inventory item" });
    }
  });
  
  app.delete("/api/inventory/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteInventoryItem(id);
      if (!success) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete inventory item" });
    }
  });
  
  // Purchase history routes
  app.get("/api/purchases", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const purchases = await storage.getPurchaseHistory(limit);
      res.json(purchases);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch purchase history" });
    }
  });
  
  app.get("/api/purchases/date-range", async (req: Request, res: Response) => {
    try {
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(0);
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();
      
      const purchases = await storage.getPurchaseHistoryByDate(startDate, endDate);
      res.json(purchases);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch purchase history by date range" });
    }
  });
  
  app.get("/api/purchases/item/:itemId", async (req: Request, res: Response) => {
    try {
      const itemId = parseInt(req.params.itemId);
      const purchases = await storage.getPurchaseHistoryByItemId(itemId);
      res.json(purchases);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch purchase history by item ID" });
    }
  });
  
  app.post("/api/purchases", async (req: Request, res: Response) => {
    try {
      const validatedData = insertPurchaseHistorySchema.parse(req.body);
      const newPurchase = await storage.createPurchaseHistory(validatedData);
      res.status(201).json(newPurchase);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid purchase data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create purchase history" });
    }
  });
  
  // Sync logs routes
  app.get("/api/sync/latest", async (_req: Request, res: Response) => {
    try {
      const latestSync = await storage.getLatestSyncLog();
      res.json(latestSync || { message: "No sync logs found" });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest sync log" });
    }
  });
  
  // Trigger a sync with Square API
  app.post("/api/sync", async (_req: Request, res: Response) => {
    try {
      const result = await syncWithSquare();
      
      // Create a sync log
      const syncLog = await storage.createSyncLog({
        status: result.success ? 'success' : 'failed',
        errorMessage: result.message,
        syncDate: new Date()
      });
      
      res.json({ 
        success: result.success, 
        message: result.message,
        syncLog 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      // Log the error
      await storage.createSyncLog({
        status: 'failed',
        errorMessage,
        syncDate: new Date()
      });
      
      res.status(500).json({ 
        success: false,
        message: "Failed to sync with Square API",
        error: errorMessage
      });
    }
  });
  
  // Dashboard metrics
  app.get("/api/metrics", async (_req: Request, res: Response) => {
    try {
      const metrics = await storage.getCategoryMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });
  
  return httpServer;
}

// Square sync service (stub)
export const syncWithSquare = async () => {
  try {
    // This would actually connect to Square API and sync data
    // For now, we'll return a success response
    return {
      success: true,
      message: "Sync completed successfully"
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to sync with Square API"
    };
  }
};
