import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import FoodPage from "@/pages/food";
import DrinksPage from "@/pages/drinks";
import MerchandisePage from "@/pages/merchandise";
import InventoryCountPage from "@/pages/inventory-count";
import ReportsPage from "@/pages/reports";
import SettingsPage from "@/pages/settings";
import { Helmet } from "react-helmet";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/food" component={FoodPage} />
      <Route path="/drinks" component={DrinksPage} />
      <Route path="/merchandise" component={MerchandisePage} />
      <Route path="/inventory-count" component={InventoryCountPage} />
      <Route path="/reports" component={ReportsPage} />
      <Route path="/settings" component={SettingsPage} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Helmet>
        <title>Arcola Tractor Pull Invenotry Mangement</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      </Helmet>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
