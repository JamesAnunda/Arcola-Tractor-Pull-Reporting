import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";

import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import DateFilter from "@/components/dashboard/date-filter";
import { Card, CardContent } from "@/components/ui/card";
import { DateRange, InventoryItemWithStatus } from "@shared/schema";
import { calculateStatus } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function MerchandisePage() {
  const [dateRange, setDateRange] = useState<DateRange>("last7days");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: merchItems, isLoading, isError } = useQuery<InventoryItemWithStatus[]>({
    queryKey: ["/api/inventory/category/merchandise"],
  });

  // Filter items based on search query
  const filteredItems = merchItems?.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Merchandise | Square Inventory Manager</title>
      </Helmet>
      
      <div className="flex flex-col h-screen">
        <Header />
        
        <div className="flex flex-1 overflow-hidden">
          <Sidebar activeRoute="merchandise" />
          
          <main className="flex-1 overflow-y-auto p-6 bg-neutral-100">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-secondary">Merchandise</h2>
              <p className="text-neutral-300">Manage and track your merchandise items</p>
            </div>
            
            <DateFilter 
              dateRange={dateRange} 
              onDateRangeChange={setDateRange}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
            />
            
            {isError ? (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  There was an error loading the merchandise items.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="mb-6">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                      <Card key={i}>
                        <Skeleton className="w-full h-40" />
                        <CardContent className="p-4">
                          <Skeleton className="h-5 w-32 mb-2" />
                          <div className="flex justify-between items-center mt-2">
                            <div>
                              <Skeleton className="h-4 w-24 mb-1" />
                              <Skeleton className="h-4 w-16" />
                            </div>
                            <Skeleton className="h-8 w-8 rounded-full" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : filteredItems?.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <p className="text-neutral-300">No merchandise items found</p>
                    {searchQuery && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Try adjusting your search query
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filteredItems?.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        <div className="w-full h-40 bg-neutral-200 flex items-center justify-center">
                          {item.imageUrl ? (
                            <img 
                              src={item.imageUrl} 
                              alt={item.name} 
                              className="w-full h-40 object-cover"
                            />
                          ) : (
                            <span className="text-neutral-400">No image available</span>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-medium text-secondary">{item.name}</h4>
                          <div className="flex justify-between items-center mt-2">
                            <div>
                              <p className="text-sm text-neutral-300">
                                In Stock: <span className={
                                  calculateStatus(item.stockQuantity, item.reorderLevel) === 'Out of Stock'
                                    ? 'text-error'
                                    : calculateStatus(item.stockQuantity, item.reorderLevel) === 'Low Stock'
                                    ? 'text-warning'
                                    : 'text-secondary'
                                }>{item.stockQuantity}</span>
                              </p>
                              <p className="text-sm font-medium text-primary">${item.price.toFixed(2)}</p>
                            </div>
                            <Button size="icon" variant="ghost" className="rounded-full bg-neutral-100 hover:bg-neutral-200">
                              <Eye className="h-4 w-4 text-secondary" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
