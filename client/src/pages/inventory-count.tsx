import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";

import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle2, Clipboard, Save } from "lucide-react";
import { InventoryItemWithStatus } from "@shared/schema";
import { calculateStatus } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function InventoryCountPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Query all inventory items
  const { data: inventoryItems, isLoading } = useQuery<InventoryItemWithStatus[]>({
    queryKey: ["/api/inventory"],
  });

  // Group items by their categories
  const itemsByCategory = inventoryItems?.reduce((acc, item) => {
    const category = item.category.toLowerCase();
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, InventoryItemWithStatus[]>) || {};

  // Filter items based on the search query and active tab
  const filteredItems = inventoryItems?.filter(item => {
    const matchesSearch = searchQuery
      ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesTab = activeTab === "all" || 
      item.category.toLowerCase() === activeTab.toLowerCase();
    
    return matchesSearch && matchesTab;
  });

  // Handle updating the count for an item
  const handleCountChange = (id: number, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setCounts(prev => ({ ...prev, [id]: numValue }));
      setHasChanges(true);
    }
  };

  // Initialize counts from the current inventory
  const initializeCounts = () => {
    if (inventoryItems) {
      const initialCounts = inventoryItems.reduce((acc, item) => {
        acc[item.id] = item.stockQuantity;
        return acc;
      }, {} as Record<number, number>);
      
      setCounts(initialCounts);
      setHasChanges(false);
      
      toast({
        title: "Counts initialized",
        description: "All counts have been set to current inventory levels."
      });
    }
  };

  // Save inventory count mutation
  const saveCountsMutation = useMutation({
    mutationFn: async () => {
      const updates = Object.entries(counts).map(([id, quantity]) => ({
        id: parseInt(id),
        stockQuantity: quantity
      }));
      
      const response = await apiRequest("POST", "/api/inventory/update-counts", { updates });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory/category"] });
      queryClient.invalidateQueries({ queryKey: ["/api/metrics"] });
      
      setHasChanges(false);
      
      toast({
        title: "Inventory Updated",
        description: "Your inventory count has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error instanceof Error ? error.message : "An error occurred during the update.",
      });
    },
  });

  // Calculate total items and items with count changes
  const totalItems = filteredItems?.length || 0;
  const itemsWithChanges = Object.entries(counts).filter(
    ([id, count]) => {
      const item = inventoryItems?.find(i => i.id === parseInt(id));
      return item && item.stockQuantity !== count;
    }
  ).length;

  return (
    <>
      <Helmet>
        <title>Inventory Count | Arcola Tractor Pull Invenotry Mangement</title>
      </Helmet>
      
      <div className="flex flex-col h-screen">
        <Header />
        
        <div className="flex flex-1 overflow-hidden">
          <Sidebar activeRoute="inventory-count" />
          
          <main className="flex-1 overflow-y-auto p-6 bg-neutral-100">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-secondary">Inventory Count</h2>
                  <p className="text-neutral-600">Count and update your inventory levels</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={initializeCounts}
                    disabled={isLoading}
                  >
                    <Clipboard className="mr-2 h-4 w-4" />
                    Initialize Counts
                  </Button>
                  <Button 
                    disabled={!hasChanges || saveCountsMutation.isPending} 
                    onClick={() => saveCountsMutation.mutate()}
                  >
                    {saveCountsMutation.isPending ? 
                      <Skeleton className="h-4 w-4 mr-2 rounded-full" /> : 
                      <Save className="mr-2 h-4 w-4" />
                    }
                    Save Changes
                  </Button>
                </div>
              </div>
              
              {hasChanges && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-center text-amber-800">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>You have {itemsWithChanges} item(s) with unsaved count changes.</span>
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>Inventory Items</CardTitle>
                    <div>
                      <Input
                        type="search"
                        placeholder="Search items..."
                        className="w-[250px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                    <div className="border-b px-4">
                      <TabsList className="w-full justify-start">
                        <TabsTrigger value="all" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                          All Items
                        </TabsTrigger>
                        <TabsTrigger value="food" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                          Food
                        </TabsTrigger>
                        <TabsTrigger value="drink" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                          Drinks
                        </TabsTrigger>
                        <TabsTrigger value="merchandise" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                          Merchandise
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <div className="p-4">
                      {isLoading ? (
                        <div className="space-y-4">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-4">
                              <Skeleton className="h-12 w-12 rounded-md" />
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : filteredItems?.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-neutral-500">No items found matching your criteria.</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>Current Count</TableHead>
                                <TableHead>New Count</TableHead>
                                <TableHead>Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredItems?.map((item) => {
                                const currentCount = counts[item.id] !== undefined ? counts[item.id] : item.stockQuantity;
                                const hasChanged = currentCount !== item.stockQuantity;
                                
                                return (
                                  <TableRow key={item.id} className={hasChanged ? "bg-blue-50" : ""}>
                                    <TableCell>
                                      <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0 bg-neutral-200 rounded-md flex items-center justify-center">
                                          {item.imageUrl ? (
                                            <img 
                                              src={item.imageUrl} 
                                              alt={item.name} 
                                              className="h-10 w-10 rounded-md object-cover"
                                            />
                                          ) : (
                                            <span className="text-neutral-400 text-xs">No image</span>
                                          )}
                                        </div>
                                        <div className="ml-4">
                                          <div className="text-sm font-medium text-secondary">{item.name}</div>
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-secondary">{item.category}</TableCell>
                                    <TableCell className="text-sm text-secondary">{item.sku}</TableCell>
                                    <TableCell className="text-sm text-secondary">{item.stockQuantity}</TableCell>
                                    <TableCell>
                                      <Input 
                                        type="number"
                                        min="0"
                                        className={`w-24 ${hasChanged ? 'border-primary' : ''}`}
                                        value={currentCount}
                                        onChange={(e) => handleCountChange(item.id, e.target.value)}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      {hasChanged ? (
                                        <Badge className="bg-blue-100 text-blue-800 border border-blue-300">
                                          Changed
                                        </Badge>
                                      ) : (
                                        <Badge className="bg-green-100 text-green-800 border border-green-300">
                                          <CheckCircle2 className="h-3 w-3 mr-1" />
                                          Verified
                                        </Badge>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </div>
                  </Tabs>
                </CardContent>
                <CardFooter className="border-t p-4">
                  <div className="text-sm text-neutral-500">
                    Total Items: <span className="font-medium text-secondary">{totalItems}</span>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}