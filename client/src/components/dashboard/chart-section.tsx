import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { DateRange } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ChartSectionProps = {
  dateRange: DateRange;
}

export default function ChartSection({ dateRange }: ChartSectionProps) {
  const [salesPeriod, setSalesPeriod] = useState<DateRange>(dateRange);
  
  // Sample data for sales trend chart
  const salesData = [
    { name: "Mon", food: 1200, drinks: 900, merch: 400 },
    { name: "Tue", food: 1400, drinks: 1000, merch: 450 },
    { name: "Wed", food: 1300, drinks: 850, merch: 500 },
    { name: "Thu", food: 1500, drinks: 1100, merch: 520 },
    { name: "Fri", food: 2000, drinks: 1400, merch: 600 },
    { name: "Sat", food: 2200, drinks: 1600, merch: 700 },
    { name: "Sun", food: 1800, drinks: 1200, merch: 550 },
  ];
  
  // Sample data for inventory distribution pie chart
  const distributionData = [
    { name: "Food", value: 45, color: "#1976d2" },
    { name: "Drinks", value: 30, color: "#ff9800" },
    { name: "Merch", value: 25, color: "#424242" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-medium">Sales Trend by Category</CardTitle>
          <Select
            value={salesPeriod}
            onValueChange={(value) => setSalesPeriod(value as DateRange)}
          >
            <SelectTrigger className="w-[180px] h-8 text-xs">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">Last 7 days</SelectItem>
              <SelectItem value="last30days">Last 30 days</SelectItem>
              <SelectItem value="last90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="food"
                  stackId="1"
                  stroke="#1976d2"
                  fill="#1976d2"
                />
                <Area
                  type="monotone"
                  dataKey="drinks"
                  stackId="1"
                  stroke="#ff9800"
                  fill="#ff9800"
                />
                <Area
                  type="monotone"
                  dataKey="merch"
                  stackId="1"
                  stroke="#424242"
                  fill="#424242"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-medium">Inventory Distribution</CardTitle>
          <div className="flex space-x-2">
            {distributionData.map((entry, index) => (
              <div key={`legend-${index}`} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-1"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs">{entry.name}</span>
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
