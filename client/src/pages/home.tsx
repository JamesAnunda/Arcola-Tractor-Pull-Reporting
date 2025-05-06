import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";

import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import MetricsOverview from "@/components/dashboard/metrics-overview";
import ChartSection from "@/components/dashboard/chart-section";
import InventoryTabs from "@/components/dashboard/inventory-tabs";
import MerchandiseShowcase from "@/components/dashboard/merchandise-showcase";
import RecentActivity from "@/components/dashboard/recent-activity";
import DateFilter from "@/components/dashboard/date-filter";
import { DateRange } from "@shared/schema";

export default function Home() {
  const [dateRange, setDateRange] = useState<DateRange>("last7days");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: metrics, isLoading: isLoadingMetrics, isError: isMetricsError } = useQuery({
    queryKey: ["/api/metrics"],
  });

  return (
    <>
      <Helmet>
        <title>Dashboard | Arcola Tractor Pull Invenotry Mangement</title>
      </Helmet>
      
      <div className="flex flex-col h-screen">
        <Header />
        
        <div className="flex flex-1 overflow-hidden">
          <Sidebar activeRoute="dashboard" />
          
          <main className="flex-1 overflow-y-auto p-6 bg-neutral-100">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-secondary">Dashboard Overview</h2>
              <p className="text-neutral-300">Monitor your inventory across all categories</p>
            </div>
            
            <DateFilter 
              dateRange={dateRange} 
              onDateRangeChange={setDateRange}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
            />
            
            {isMetricsError ? (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  There was an error loading the dashboard metrics.
                </AlertDescription>
              </Alert>
            ) : isLoadingMetrics ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-8 w-24 mb-2" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                ))}
              </div>
            ) : (
              <MetricsOverview metrics={metrics} />
            )}
            
            <ChartSection dateRange={dateRange} />
            
            <InventoryTabs />
            
            <MerchandiseShowcase />
            
            <RecentActivity />
          </main>
        </div>
      </div>
    </>
  );
}
