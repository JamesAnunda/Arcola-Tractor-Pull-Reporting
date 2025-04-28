import { useQuery } from "@tanstack/react-query";
import { PurchaseHistory } from "@shared/schema";
import { AlertTriangle, CheckCircle, ShoppingCartIcon, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type Activity = {
  id: number;
  type: 'purchase' | 'lowStock' | 'restock' | 'outOfStock';
  message: string;
  timestamp: Date;
};

export default function RecentActivity() {
  // In a real application, this would be a proper query to fetch recent activities
  // For now, we'll create some sample data
  const activities: Activity[] = [
    {
      id: 1,
      type: 'purchase',
      message: 'New order received for 12 Coffee Mugs',
      timestamp: new Date(Date.now() - 1000 * 60 * 45) // 45 minutes ago
    },
    {
      id: 2,
      type: 'lowStock',
      message: 'Chicken Breast is running low on stock',
      timestamp: new Date(Date.now() - 1000 * 60 * 120) // 2 hours ago
    },
    {
      id: 3,
      type: 'restock',
      message: 'Restocked Vegetable Salad (+20 units)',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
    },
    {
      id: 4,
      type: 'outOfStock',
      message: 'Penne Pasta is out of stock',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30) // 30 hours ago
    }
  ];

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    return "Yesterday";
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <ShoppingCartIcon className="text-primary text-sm" />;
      case 'lowStock':
        return <AlertTriangle className="text-warning text-sm" />;
      case 'restock':
        return <CheckCircle className="text-success text-sm" />;
      case 'outOfStock':
        return <XCircle className="text-error text-sm" />;
      default:
        return <ShoppingCartIcon className="text-primary text-sm" />;
    }
  };

  const getActivityClass = (type: string) => {
    switch (type) {
      case 'purchase':
        return 'bg-primary/10';
      case 'lowStock':
        return 'bg-warning/10';
      case 'restock':
        return 'bg-success/10';
      case 'outOfStock':
        return 'bg-error/10';
      default:
        return 'bg-primary/10';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium text-secondary">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start">
            <div className={`h-8 w-8 rounded-full ${getActivityClass(activity.type)} flex items-center justify-center mr-3`}>
              {getActivityIcon(activity.type)}
            </div>
            <div>
              <p className="text-sm text-secondary">{activity.message}</p>
              <p className="text-xs text-neutral-300">{formatTimestamp(activity.timestamp)}</p>
            </div>
          </div>
        ))}
        
        <div className="mt-4 text-center">
          <Button variant="link" className="text-primary hover:underline text-sm">
            View all activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
