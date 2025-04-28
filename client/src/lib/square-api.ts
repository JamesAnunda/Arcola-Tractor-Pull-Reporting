import { apiRequest } from "@/lib/queryClient";
import { InventoryItem, PurchaseHistory } from "@shared/schema";

// Square API configuration
const SQUARE_API_URL = process.env.SQUARE_API_URL || "https://connect.squareup.com/v2";

// Function to process and transform Square API responses
const processSquareData = {
  // Convert Square catalog items to our inventory schema
  inventoryItems: (squareItems: any[]): Partial<InventoryItem>[] => {
    return squareItems.map(item => {
      const { id, name, description, category, variation_data, item_data } = item;
      const sku = variation_data?.sku || item_data?.variations?.[0]?.sku || '';
      const price = parseFloat(variation_data?.price_money?.amount || '0') / 100;
      
      return {
        name,
        description,
        category: category?.name || 'Uncategorized',
        subcategory: item_data?.category_id ? 'Subcategory' : undefined,
        sku,
        price,
        stockQuantity: 0, // This would come from inventory API
        reorderLevel: 5,
        imageUrl: item_data?.image_url,
        squareId: id
      };
    });
  },
  
  // Convert Square orders to our purchase history schema
  purchaseHistory: (squareOrders: any[]): Partial<PurchaseHistory>[] => {
    const purchases: Partial<PurchaseHistory>[] = [];
    
    squareOrders.forEach(order => {
      const { id, line_items, created_at } = order;
      
      line_items?.forEach((lineItem: any) => {
        purchases.push({
          itemId: 0, // This would be mapped to our internal item ID
          quantity: lineItem.quantity,
          totalPrice: parseFloat(lineItem.total_money.amount) / 100,
          purchaseDate: new Date(created_at),
          squareOrderId: id
        });
      });
    });
    
    return purchases;
  }
};

// Square API client
export const squareApi = {
  // Get inventory items from Square catalog
  async getInventoryItems(): Promise<Partial<InventoryItem>[]> {
    try {
      // In a real implementation, this would call Square API
      // Instead, we'll call our backend which will interact with Square
      const response = await apiRequest("GET", "/api/inventory", {});
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching inventory from Square:", error);
      throw error;
    }
  },
  
  // Get purchase history from Square orders
  async getPurchaseHistory(startDate?: Date, endDate?: Date): Promise<Partial<PurchaseHistory>[]> {
    try {
      // In a real implementation, this would call Square API
      // Instead, we'll call our backend which will interact with Square
      let url = "/api/purchases";
      if (startDate && endDate) {
        url = `/api/purchases/date-range?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
      }
      
      const response = await apiRequest("GET", url, {});
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching purchase history from Square:", error);
      throw error;
    }
  },
  
  // Sync local database with Square
  async syncWithSquare(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiRequest("POST", "/api/sync", {});
      const data = await response.json();
      return {
        success: data.success,
        message: data.message
      };
    } catch (error) {
      console.error("Error syncing with Square:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  }
};
