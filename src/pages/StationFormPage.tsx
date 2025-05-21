
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import StationForm from "@/components/stations/StationForm";
import { Station } from "@/types";
import { useToast } from "@/hooks/use-toast";

// Mock data - using the same as in Dashboard.tsx
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
    updatedAt: "2023-05-20T14:30:00Z",
    lastReading: {
      id: "r1",
      stationId: "1",
      timestamp: "2023-05-20T14:30:00Z",
      parameters: {
        temperature: 18.5,
        pH: 7.2,
        dissolvedOxygen: 8.1,
        turbidity: 5.2,
        tds: 120,
        conductivity: 250
      }
    }
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
    updatedAt: "2023-05-21T09:45:00Z",
    lastReading: {
      id: "r2",
      stationId: "2",
      timestamp: "2023-05-21T09:45:00Z",
      parameters: {
        temperature: 15.2,
        pH: 6.9,
        dissolvedOxygen: 9.3,
        turbidity: 2.1,
        tds: 85,
        conductivity: 180
      }
    }
  }
];

const StationFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [station, setStation] = useState<Station | null>(null);
  const [isLoading, setIsLoading] = useState(!!id);

  const isEditing = !!id;

  useEffect(() => {
    document.title = isEditing ? "Edit Station - Hydro Scan" : "New Station - Hydro Scan";
    
    if (isEditing) {
      // Simulate fetching station details
      const fetchStationDetails = () => {
        // This would be replaced with actual Supabase logic
        setTimeout(() => {
          const foundStation = mockStations.find((s) => s.id === id);
          if (foundStation) {
            setStation(foundStation);
          } else {
            toast({
              title: "Station not found",
              description: "The requested station does not exist",
              variant: "destructive",
            });
            navigate("/stations");
          }
          setIsLoading(false);
        }, 500);
      };
      
      fetchStationDetails();
    }
  }, [id, isEditing, navigate, toast]);

  const handleSubmit = (data: Partial<Station>) => {
    // This would be replaced with actual Supabase logic
    // For now, just display a success message and navigate back
    
    toast({
      title: isEditing ? "Station updated" : "Station created",
      description: `${data.name} has been ${isEditing ? "updated" : "created"} successfully`,
    });
    
    // Navigate to the station page if editing, or back to stations if creating
    if (isEditing) {
      navigate(`/stations/${id}`);
    } else {
      navigate("/stations");
    }
  };

  if (isEditing && isLoading) {
    return (
      <MainLayout>
        <div className="space-y-4">
          <div className="h-8 w-64 bg-muted animate-pulse rounded"></div>
          <div className="h-4 w-96 bg-muted animate-pulse rounded"></div>
          <div className="h-64 bg-muted animate-pulse rounded-lg"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {isEditing ? "Edit Station" : "New Station"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isEditing
            ? "Update your station information"
            : "Create a new water quality monitoring station"}
        </p>
      </div>
      
      <StationForm station={station || undefined} onSubmit={handleSubmit} />
    </MainLayout>
  );
};

export default StationFormPage;
