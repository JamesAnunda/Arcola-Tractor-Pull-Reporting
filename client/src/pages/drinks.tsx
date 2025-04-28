import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";

import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import DateFilter from "@/components/dashboard/date-filter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/ui/status-badge";
import { DateRange, InventoryItemWithStatus } from "@shared/schema";
import { calculateStatus } from "@/lib/utils";

export default function DrinksPage() {
  const [dateRange, setDateRange] = useState<DateRange>("last7days");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: drinkItems, isLoading, isError } = useQuery<InventoryItemWithStatus[]>({
    queryKey: ["/api/inventory/category/drink"],
  });

  // Filter items based on search query
  const filteredItems = drinkItems?.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Drinks Inventory | Square Inventory Manager</title>
      </Helmet>
      
      <div className="flex flex-col h-screen">
        <Header />
        
        <div className="flex flex-1 overflow-hidden">
          <Sidebar activeRoute="drinks" />
          
          <main className="flex-1 overflow-y-auto p-6 bg-neutral-100">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-secondary">Drinks Inventory</h2>
              <p className="text-neutral-300">Manage and track your beverage items</p>
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
                  There was an error loading the drinks inventory.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="bg-white rounded-lg shadow-sm mb-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>In Stock</TableHead>
                        <TableHead>Reorder Level</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        [...Array(4)].map((_, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <div className="flex items-center">
                                <Skeleton className="h-10 w-10 rounded-md mr-4" />
                                <div>
                                  <Skeleton className="h-4 w-32 mb-1" />
                                  <Skeleton className="h-3 w-16" />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                          </TableRow>
                        ))
                      ) : filteredItems?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <p className="text-neutral-300">No drink items found</p>
                            {searchQuery && (
                              <p className="text-sm text-muted-foreground mt-2">
                                Try adjusting your search query
                              </p>
                            )}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredItems?.map((item) => (
                          <TableRow key={item.id} className="hover:bg-neutral-100">
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
                                  <div className="text-sm text-neutral-300">#{item.sku}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-secondary">{item.subcategory || 'General'}</TableCell>
                            <TableCell className="text-sm text-secondary">{item.stockQuantity} units</TableCell>
                            <TableCell className="text-sm text-secondary">{item.reorderLevel} units</TableCell>
                            <TableCell className="text-sm text-secondary">${item.price.toFixed(2)}</TableCell>
                            <TableCell>
                              <StatusBadge status={calculateStatus(item.stockQuantity, item.reorderLevel)} />
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
