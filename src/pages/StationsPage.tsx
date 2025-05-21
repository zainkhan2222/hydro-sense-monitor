import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MainLayout from "@/components/layout/MainLayout";
import StationCard from "@/components/stations/StationCard";
import { Station } from "@/types";
import { useToast } from "@/hooks/use-toast";

// Mock data - same as in Dashboard.tsx
const mockStations: Station[] = [
  {
    id: "1",
    name: "River Thames Monitoring",
    description: "Main monitoring station for River Thames water quality",
    location: "London Bridge",
    latitude: 51.5074,
    longitude: -0.1278,
    isActive: true,
    ownerId: "user1",
    createdAt: "2023-01-15T12:00:00Z",
    updatedAt: "2023-05-20T14:30:00Z"
  },
  {
    id: "2",
    name: "Lake District Sensor",
    description: "Remote sensor for monitoring lake water quality",
    location: "Windermere",
    latitude: 54.3781,
    longitude: -2.9382,
    isActive: true,
    ownerId: "user1",
    createdAt: "2023-02-20T10:15:00Z",
    updatedAt: "2023-05-21T09:45:00Z"
  },
  {
    id: "3",
    name: "Coastal Monitoring",
    description: "Coastal water quality monitoring station",
    location: "Brighton Beach",
    latitude: 50.8225,
    longitude: -0.1372,
    isActive: false,
    ownerId: "user1",
    createdAt: "2023-03-05T08:30:00Z",
    updatedAt: "2023-05-10T11:20:00Z"
  }
];

const StationsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stations, setStations] = useState<Station[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "Stations - Hydro Scan";
    
    // Simulate fetching stations
    const fetchStations = () => {
      // This would be replaced with actual Supabase logic
      setTimeout(() => {
        setStations(mockStations);
        setIsLoading(false);
      }, 500);
    };
    
    fetchStations();
  }, []);

  const handleDeleteStation = (id: string) => {
    // This would be replaced with actual Supabase delete logic
    setStations((prev) => prev.filter((station) => station.id !== id));
  };

  const filteredStations = stations.filter((station) =>
    station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Stations</h1>
        <p className="text-muted-foreground mt-1">
          Manage your water quality monitoring stations
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search stations..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => navigate("/stations/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Station
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-64 bg-muted animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : filteredStations.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No stations found</h3>
          <p className="text-muted-foreground mt-1">
            {searchQuery
              ? "Try adjusting your search query"
              : "Start by adding your first station"}
          </p>
          {!searchQuery && (
            <Button className="mt-4" onClick={() => navigate("/stations/new")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Station
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredStations.map((station) => (
            <StationCard
              key={station.id}
              station={station}
              onDelete={handleDeleteStation}
            />
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default StationsPage;
