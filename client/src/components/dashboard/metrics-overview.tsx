import { ArrowDown, ArrowUp, Beer, ShoppingBag, Utensils, AlertTriangle } from "lucide-react";
import { CategoryMetrics } from "@shared/schema";

type MetricsOverviewProps = {
  metrics: CategoryMetrics;
}

export default function MetricsOverview({ metrics }: MetricsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <p className="text-neutral-300 text-sm">Total Food Revenue</p>
          <Utensils className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-2xl font-bold">${metrics.foodRevenue.toFixed(2)}</h3>
        <div className="flex items-center mt-2">
          <span className={`text-sm flex items-center ${metrics.foodRevenueChange >= 0 ? 'text-success' : 'text-error'}`}>
            {metrics.foodRevenueChange >= 0 ? (
              <ArrowUp className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 mr-1" />
            )}
            {Math.abs(metrics.foodRevenueChange).toFixed(1)}%
          </span>
          <span className="text-sm text-neutral-300 ml-2">vs last period</span>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <p className="text-neutral-300 text-sm">Total Drink Revenue</p>
          <Beer className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-2xl font-bold">${metrics.drinkRevenue.toFixed(2)}</h3>
        <div className="flex items-center mt-2">
          <span className={`text-sm flex items-center ${metrics.drinkRevenueChange >= 0 ? 'text-success' : 'text-error'}`}>
            {metrics.drinkRevenueChange >= 0 ? (
              <ArrowUp className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 mr-1" />
            )}
            {Math.abs(metrics.drinkRevenueChange).toFixed(1)}%
          </span>
          <span className="text-sm text-neutral-300 ml-2">vs last period</span>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <p className="text-neutral-300 text-sm">Total Merch Revenue</p>
          <ShoppingBag className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-2xl font-bold">${metrics.merchRevenue.toFixed(2)}</h3>
        <div className="flex items-center mt-2">
          <span className={`text-sm flex items-center ${metrics.merchRevenueChange >= 0 ? 'text-success' : 'text-error'}`}>
            {metrics.merchRevenueChange >= 0 ? (
              <ArrowUp className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 mr-1" />
            )}
            {Math.abs(metrics.merchRevenueChange).toFixed(1)}%
          </span>
          <span className="text-sm text-neutral-300 ml-2">vs last period</span>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <p className="text-neutral-300 text-sm">Low Stock Items</p>
          <AlertTriangle className="h-5 w-5 text-warning" />
        </div>
        <h3 className="text-2xl font-bold">{metrics.lowStockCount}</h3>
        <div className="flex items-center mt-2">
          <button className="text-primary text-sm flex items-center">
            View details
            <ArrowUp className="h-4 w-4 ml-1 rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
}
