import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";

import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [squareApiKey, setSquareApiKey] = useState("");
  const [squareLocation, setSquareLocation] = useState("");
  const [syncFrequency, setSyncFrequency] = useState<number>(60);
  const [autoSync, setAutoSync] = useState<boolean>(true);

  // Get latest sync log
  const { data: latestSync } = useQuery({
    queryKey: ["/api/sync/latest"],
  });

  // Trigger sync mutation
  const syncMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/sync", {});
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/sync/latest"] });
      toast({
        title: "Sync successful",
        description: data.message || "Your inventory has been synced with Square.",
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

  // Save settings mutation (this would normally save to a database)
  const saveSettingsMutation = useMutation({
    mutationFn: async () => {
      // This would typically save the settings to the server
      // For now we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    },
    onSuccess: () => {
      toast({
        title: "Settings saved",
        description: "Your settings have been updated.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to save settings",
        description: "An error occurred while saving your settings.",
      });
    },
  });

  return (
    <>
      <Helmet>
        <title>Settings | Arcola Tractor Pull Invenotry Mangement</title>
      </Helmet>
      
      <div className="flex flex-col h-screen">
        <Header />
        
        <div className="flex flex-1 overflow-hidden">
          <Sidebar activeRoute="settings" />
          
          <main className="flex-1 overflow-y-auto p-6 bg-neutral-100">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-secondary">Settings</h2>
              <p className="text-neutral-300">Configure your inventory management system</p>
            </div>
            
            <Tabs defaultValue="api" className="mb-6">
              <TabsList className="mb-4">
                <TabsTrigger value="api">API Configuration</TabsTrigger>
                <TabsTrigger value="sync">Sync Settings</TabsTrigger>
                <TabsTrigger value="display">Display Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="api">
                <Card>
                  <CardHeader>
                    <CardTitle>Square API Configuration</CardTitle>
                    <CardDescription>
                      Configure your connection to the Square API
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-key">API Key</Label>
                      <Input 
                        id="api-key" 
                        type="password" 
                        placeholder="Enter your Square API key" 
                        value={squareApiKey}
                        onChange={(e) => setSquareApiKey(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        You can find your API key in the Square Developer Dashboard
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Square Location ID</Label>
                      <Input 
                        id="location" 
                        placeholder="Enter your Square Location ID" 
                        value={squareLocation}
                        onChange={(e) => setSquareLocation(e.target.value)}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div>
                      {latestSync && latestSync.syncDate && (
                        <p className="text-xs text-muted-foreground">
                          Last sync: {new Date(latestSync.syncDate).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => syncMutation.mutate()}
                        disabled={syncMutation.isPending}
                      >
                        {syncMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Test Connection
                      </Button>
                      <Button 
                        onClick={() => saveSettingsMutation.mutate()}
                        disabled={saveSettingsMutation.isPending}
                      >
                        {saveSettingsMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Settings
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="sync">
                <Card>
                  <CardHeader>
                    <CardTitle>Sync Settings</CardTitle>
                    <CardDescription>
                      Configure how and when your inventory syncs with Square
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-sync">Auto Sync</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically sync with Square on a schedule
                        </p>
                      </div>
                      <Switch 
                        id="auto-sync" 
                        checked={autoSync} 
                        onCheckedChange={setAutoSync} 
                      />
                    </div>
                    
                    {autoSync && (
                      <div className="space-y-2">
                        <Label htmlFor="sync-frequency">Sync Frequency (minutes)</Label>
                        <Input 
                          id="sync-frequency" 
                          type="number" 
                          min="5"
                          max="1440"
                          value={syncFrequency}
                          onChange={(e) => setSyncFrequency(parseInt(e.target.value))}
                        />
                        <p className="text-xs text-muted-foreground">
                          Minimum 5 minutes. Remember that Square API has rate limits.
                        </p>
                      </div>
                    )}
                    
                    <div className="pt-4">
                      <Button 
                        onClick={() => syncMutation.mutate()}
                        disabled={syncMutation.isPending}
                      >
                        {syncMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sync Now
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => saveSettingsMutation.mutate()}
                      disabled={saveSettingsMutation.isPending}
                    >
                      {saveSettingsMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Settings
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="display">
                <Card>
                  <CardHeader>
                    <CardTitle>Display Settings</CardTitle>
                    <CardDescription>
                      Customize how your inventory is displayed
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Coming Soon</Label>
                      <p className="text-sm text-muted-foreground">
                        Display customization options will be available in a future update.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </>
  );
}
