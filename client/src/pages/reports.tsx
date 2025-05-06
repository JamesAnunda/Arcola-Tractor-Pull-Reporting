import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";

import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import DateFilter from "@/components/dashboard/date-filter";
import ChartSection from "@/components/dashboard/chart-section";
import { DateRange } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange>("last30days");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: metrics, isLoading: isLoadingMetrics, isError: isMetricsError } = useQuery({
    queryKey: ["/api/metrics"],
  });

  return (
    <>
      <Helmet>
        <title>Reports | Arcola Tractor Pull Invenotry Mangement</title>
      </Helmet>
      
      <div className="flex flex-col h-screen">
        <Header />
        
        <div className="flex flex-1 overflow-hidden">
          <Sidebar activeRoute="reports" />
          
          <main className="flex-1 overflow-y-auto p-6 bg-neutral-100">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-secondary">Reports</h2>
              <p className="text-neutral-300">Analyze your sales and inventory data</p>
            </div>
            
            <DateFilter 
              dateRange={dateRange} 
              onDateRangeChange={setDateRange}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
            />
            
            <Tabs defaultValue="sales" className="mb-6">
              <TabsList className="mb-4">
                <TabsTrigger value="sales">Sales Reports</TabsTrigger>
                <TabsTrigger value="inventory">Inventory Reports</TabsTrigger>
                <TabsTrigger value="category">Category Analysis</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sales">
                <ChartSection dateRange={dateRange} />
                
                {isMetricsError ? (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      There was an error loading the sales metrics.
                    </AlertDescription>
                  </Alert>
                ) : isLoadingMetrics ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                      <Card key={i}>
                        <CardHeader>
                          <Skeleton className="h-5 w-32" />
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-8 w-24 mb-2" />
                          <Skeleton className="h-4 w-40" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Total Revenue</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">
                          ${(metrics.foodRevenue + metrics.drinkRevenue + metrics.merchRevenue).toFixed(2)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          For the selected period
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Highest Performing Category</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {metrics.foodRevenue > metrics.drinkRevenue && metrics.foodRevenue > metrics.merchRevenue
                            ? 'Food'
                            : metrics.drinkRevenue > metrics.merchRevenue
                            ? 'Drinks'
                            : 'Merchandise'}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Based on total revenue
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Low Stock Items</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-warning">
                          {metrics.lowStockCount}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Items need attention
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="inventory">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Detailed inventory reports coming soon
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="category">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Category analysis reports coming soon
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </>
  );
}
