import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, MoveRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { InventoryItemWithStatus } from "@shared/schema";
import { calculateStatus } from "@/lib/utils";

export default function MerchandiseShowcase() {
  const { data: merchItems, isLoading, isError } = useQuery<InventoryItemWithStatus[]>({
    queryKey: ["/api/inventory/category/merchandise"],
  });

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium text-secondary">Merchandise Showcase</h3>
        <Link href="/merchandise">
          <a className="text-primary hover:underline flex items-center">
            View all merchandise
            <MoveRight className="ml-1 h-4 w-4" />
          </a>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
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
      ) : isError ? (
        <div className="text-center py-8 bg-white rounded-lg shadow-sm">
          <p className="text-neutral-300">Error loading merchandise data</p>
        </div>
      ) : !merchItems || merchItems.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow-sm">
          <p className="text-neutral-300">No merchandise items found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {merchItems.slice(0, 4).map((item) => (
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
  );
}
