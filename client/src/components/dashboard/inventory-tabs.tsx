import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import StatusBadge from "@/components/ui/status-badge";
import { InventoryItemWithStatus } from "@shared/schema";
import { calculateStatus } from "@/lib/utils";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default function InventoryTabs() {
  const [activeTab, setActiveTab] = useState("food");
  
  const { data: foodItems, isLoading: isLoadingFood } = useQuery<InventoryItemWithStatus[]>({
    queryKey: ["/api/inventory/category/food"],
  });
  
  const { data: drinkItems, isLoading: isLoadingDrinks } = useQuery<InventoryItemWithStatus[]>({
    queryKey: ["/api/inventory/category/drink"],
  });
  
  const { data: merchItems, isLoading: isLoadingMerch } = useQuery<InventoryItemWithStatus[]>({
    queryKey: ["/api/inventory/category/merchandise"],
  });

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6">
      <Tabs defaultValue="food" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="border-b border-neutral-200 w-full justify-start">
          <TabsTrigger value="food" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
            Food Inventory
          </TabsTrigger>
          <TabsTrigger value="drinks" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
            Drinks Inventory
          </TabsTrigger>
          <TabsTrigger value="merchandise" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
            Merchandise
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="food" className="p-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>In Stock</TableHead>
                  <TableHead>Reorder Level</TableHead>
                  <TableHead>Last Purchased</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingFood ? (
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
                ) : !foodItems || foodItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-neutral-300">
                      No food items found
                    </TableCell>
                  </TableRow>
                ) : (
                  foodItems.slice(0, 4).map((item) => (
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
                      <TableCell className="text-sm text-secondary">04/15/2023</TableCell>
                      <TableCell>
                        <StatusBadge status={calculateStatus(item.stockQuantity, item.reorderLevel)} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="p-4 border-t border-neutral-200">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </TabsContent>
        
        <TabsContent value="drinks" className="p-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>In Stock</TableHead>
                  <TableHead>Reorder Level</TableHead>
                  <TableHead>Last Purchased</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingDrinks ? (
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
                ) : !drinkItems || drinkItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-neutral-300">
                      No drink items found
                    </TableCell>
                  </TableRow>
                ) : (
                  drinkItems.slice(0, 4).map((item) => (
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
                      <TableCell className="text-sm text-secondary">04/15/2023</TableCell>
                      <TableCell>
                        <StatusBadge status={calculateStatus(item.stockQuantity, item.reorderLevel)} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="p-4 border-t border-neutral-200">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </TabsContent>
        
        <TabsContent value="merchandise" className="p-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>In Stock</TableHead>
                  <TableHead>Reorder Level</TableHead>
                  <TableHead>Last Purchased</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingMerch ? (
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
                ) : !merchItems || merchItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-neutral-300">
                      No merchandise items found
                    </TableCell>
                  </TableRow>
                ) : (
                  merchItems.slice(0, 4).map((item) => (
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
                      <TableCell className="text-sm text-secondary">04/15/2023</TableCell>
                      <TableCell>
                        <StatusBadge status={calculateStatus(item.stockQuantity, item.reorderLevel)} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="p-4 border-t border-neutral-200">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
