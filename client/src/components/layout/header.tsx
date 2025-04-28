import { Bell, Download, Search, FolderSync } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Header() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get latest sync log
  const { data: latestSync } = useQuery({
    queryKey: ["/api/sync/latest"],
  });

  // Calculate time since last sync
  const getTimeSinceLastSync = () => {
    if (!latestSync || !latestSync.syncDate) return "Never";
    
    const lastSyncDate = new Date(latestSync.syncDate);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - lastSyncDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    return lastSyncDate.toLocaleDateString();
  };

  // Trigger sync mutation
  const syncMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/sync", {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sync/latest"] });
      toast({
        title: "Sync successful",
        description: "Your inventory has been synced with Square.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Sync failed",
        description: error instanceof Error ? error.message : "An error occurred during sync.",
      });
    },
  });

  return (
    <header className="bg-white shadow-md">
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-medium text-secondary ml-12 lg:ml-0">Inventory Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <span className="flex h-3 w-3">
              <span className={`${syncMutation.isPending ? 'animate-ping' : ''} absolute inline-flex h-full w-full rounded-full ${latestSync?.status === 'failed' ? 'bg-destructive' : 'bg-success'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${latestSync?.status === 'failed' ? 'bg-destructive' : 'bg-success'}`}></span>
            </span>
          </div>
          <span className="text-sm text-neutral-300 hidden md:inline-block">Last sync: {getTimeSinceLastSync()}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => syncMutation.mutate()}
            disabled={syncMutation.isPending}
          >
            <FolderSync className={`h-5 w-5 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Avatar>
            <AvatarFallback className="bg-primary text-white">JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
