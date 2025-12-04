import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import ClientsList from "./pages/clients/ClientsList";
import ClientForm from "./pages/clients/ClientForm";
import ClientDetail from "./pages/clients/ClientDetail";
import RealtorsList from "./pages/realtors/RealtorsList";
import RealtorForm from "./pages/realtors/RealtorForm";
import RealtorDetail from "./pages/realtors/RealtorDetail";
import PropertiesList from "./pages/properties/PropertiesList";
import PropertyForm from "./pages/properties/PropertyForm";
import PropertyDetail from "./pages/properties/PropertyDetail";
import OffersList from "./pages/offers/OffersList";
import OfferForm from "./pages/offers/OfferForm";
import OfferDetail from "./pages/offers/OfferDetail";
import NeedsList from "./pages/needs/NeedsList";
import NeedForm from "./pages/needs/NeedForm";
import NeedDetail from "./pages/needs/NeedDetail";
import DealsList from "./pages/deals/DealsList";
import DealForm from "./pages/deals/DealForm";
import DealDetail from "./pages/deals/DealDetail";
import SearchPage from "./pages/Search";
import EventsPage from "./pages/Events";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<ClientsList />} />
            <Route path="/clients/new" element={<ClientForm />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/clients/:id/edit" element={<ClientForm />} />
            <Route path="/realtors" element={<RealtorsList />} />
            <Route path="/realtors/new" element={<RealtorForm />} />
            <Route path="/realtors/:id" element={<RealtorDetail />} />
            <Route path="/realtors/:id/edit" element={<RealtorForm />} />
            <Route path="/properties" element={<PropertiesList />} />
            <Route path="/properties/new" element={<PropertyForm />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/properties/:id/edit" element={<PropertyForm />} />
            <Route path="/offers" element={<OffersList />} />
            <Route path="/offers/new" element={<OfferForm />} />
            <Route path="/offers/:id" element={<OfferDetail />} />
            <Route path="/offers/:id/edit" element={<OfferForm />} />
            <Route path="/needs" element={<NeedsList />} />
            <Route path="/needs/new" element={<NeedForm />} />
            <Route path="/needs/:id" element={<NeedDetail />} />
            <Route path="/needs/:id/edit" element={<NeedForm />} />
            <Route path="/deals" element={<DealsList />} />
            <Route path="/deals/new" element={<DealForm />} />
            <Route path="/deals/:id" element={<DealDetail />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/events" element={<EventsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
