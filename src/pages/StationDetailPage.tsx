
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit, Trash, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import MainLayout from "@/components/layout/MainLayout";
import StationStatusIndicator from "@/components/stations/StationStatusIndicator";
import ReadingsChart from "@/components/readings/ReadingsChart";
import ParameterCard from "@/components/readings/ParameterCard";
import { Station, Reading, Alert } from "@/types";
import { ParameterStatus } from "@/components/readings/ParameterCard";
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
    updatedAt: "2023-05-10T11:20:00Z",
  }
];

const mockReadings: Reading[] = [
  {
    id: "r1",
    stationId: "1",
    timestamp: "2023-05-20T10:30:00Z",
    ph: 7.2,
    temperature: 18.2,
    dissolvedOxygen: 8.0,
    turbidity: 5.0,
    tds: 118,
    conductivity: 248,
    createdAt: "2023-05-20T10:30:00Z"
  },
  {
    id: "r2",
    stationId: "1",
    timestamp: "2023-05-20T11:30:00Z",
    ph: 7.2,
    temperature: 18.3,
    dissolvedOxygen: 8.1,
    turbidity: 5.1,
    tds: 119,
    conductivity: 249,
    createdAt: "2023-05-20T11:30:00Z"
  },
  {
    id: "r3",
    stationId: "1",
    timestamp: "2023-05-20T12:30:00Z",
    ph: 7.2,
    temperature: 18.4,
    dissolvedOxygen: 8.1,
    turbidity: 5.1,
    tds: 120,
    conductivity: 250,
    createdAt: "2023-05-20T12:30:00Z"
  },
  {
    id: "r4",
    stationId: "1",
    timestamp: "2023-05-20T13:30:00Z",
    ph: 7.2,
    temperature: 18.5,
    dissolvedOxygen: 8.1,
    turbidity: 5.2,
    tds: 120,
    conductivity: 250,
    createdAt: "2023-05-20T13:30:00Z"
  },
  {
    id: "r5",
    stationId: "1",
    timestamp: "2023-05-20T14:30:00Z",
    ph: 7.2,
    temperature: 18.5,
    dissolvedOxygen: 8.1,
    turbidity: 5.2,
    tds: 120,
    conductivity: 250,
    createdAt: "2023-05-20T14:30:00Z"
  }
];

const mockAlerts: Alert[] = [
  {
    id: "a1",
    stationId: "1",
    parameter: "ph",
    value: 8.7,
    timestamp: "2023-05-19T15:45:00Z",
    severity: "medium",
    acknowledged: false,
    readingId: "r1"
  },
  {
    id: "a2",
    stationId: "2",
    parameter: "temperature",
    value: 25.3,
    timestamp: "2023-05-20T09:15:00Z",
    severity: "high",
    acknowledged: false,
    readingId: "r2"
  },
  {
    id: "a3",
    stationId: "3",
    parameter: "turbidity",
    value: 15.2,
    timestamp: "2023-05-21T11:30:00Z",
    severity: "critical",
    acknowledged: true,
    acknowledgedBy: "user1",
    acknowledgedAt: "2023-05-21T12:15:00Z",
    readingId: "r3"
  }
];

const StationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [station, setStation] = useState<Station | null>(null);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [latestReading, setLatestReading] = useState<Reading | null>(null);

  useEffect(() => {
    // Simulate fetching station details
    const fetchStationDetails = () => {
      // This would be replaced with actual Supabase logic
      setTimeout(() => {
        const foundStation = mockStations.find((s) => s.id === id);
        if (foundStation) {
          setStation(foundStation);
          document.title = `${foundStation.name} - Hydro Scan`;
          
          // Get readings for this station
          const stationReadings = mockReadings.filter(
            (r) => r.stationId === id
          );
          setReadings(stationReadings);
          
          // Set the latest reading
          if (stationReadings.length > 0) {
            setLatestReading(stationReadings[stationReadings.length - 1]);
          }
          
          // Get alerts for this station
          const stationAlerts = mockAlerts.filter(
            (a) => a.stationId === id
          );
          setAlerts(stationAlerts);
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
  }, [id, navigate, toast]);

  const handleDelete = () => {
    setIsDeleting(true);
    
    // This would be replaced with actual Supabase delete logic
    setTimeout(() => {
      toast({
        title: "Station deleted",
        description: `${station?.name} has been deleted successfully`,
      });
      navigate("/stations");
      setIsDeleting(false);
    }, 1000);
  };

  if (isLoading) {
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

  if (!station) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">Station not found</h3>
          <p className="text-muted-foreground mt-1">
            The station you're looking for doesn't exist
          </p>
          <Button className="mt-4" onClick={() => navigate("/stations")}>
            Back to Stations
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{station.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <StationStatusIndicator isActive={station.isActive} />
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{station.location}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/stations/${id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            <Trash className="mr-2 h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="readings">Readings</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Station Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">Description</h3>
                <p className="text-muted-foreground">
                  {station.description || "No description provided"}
                </p>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Location</h3>
                  <p className="text-muted-foreground">{station.location}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Coordinates</h3>
                  <p className="text-muted-foreground">
                    {station.latitude?.toFixed(4)}, {station.longitude?.toFixed(4)}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Created</h3>
                  <p className="text-muted-foreground">
                    {new Date(station.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Last Updated</h3>
                  <p className="text-muted-foreground">
                    {new Date(station.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
            {latestReading && (
              <>
                <ParameterCard
                  name="temperature"
                  value={latestReading.temperature || 0}
                  unit="°C"
                  status="good"
                />
                <ParameterCard
                  name="ph"
                  value={latestReading.ph || 0}
                  unit=""
                  status="warning"
                />
                <ParameterCard
                  name="dissolvedOxygen"
                  value={latestReading.dissolvedOxygen || 0}
                  unit="mg/L"
                  status="good"
                />
                <ParameterCard
                  name="turbidity"
                  value={latestReading.turbidity || 0}
                  unit="NTU"
                  status="good"
                />
                <ParameterCard
                  name="tds"
                  value={latestReading.tds || 0}
                  unit="mg/L"
                  status="good"
                />
                <ParameterCard
                  name="conductivity"
                  value={latestReading.conductivity || 0}
                  unit="μS/cm"
                  status="good"
                />
              </>
            )}
          </div>
          
          <ReadingsChart readings={readings} title="Recent Readings" />
        </TabsContent>
        
        <TabsContent value="readings" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Readings</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Reading
            </Button>
          </div>
          
          <ReadingsChart readings={readings} title="Historical Readings" />
          
          <Card>
            <CardHeader>
              <CardTitle>Raw Data</CardTitle>
              <CardDescription>
                View and export raw reading data for this station
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Date</th>
                      <th className="text-right p-2">Temperature</th>
                      <th className="text-right p-2">pH</th>
                      <th className="text-right p-2">Dissolved Oxygen</th>
                      <th className="text-right p-2">Turbidity</th>
                      <th className="text-right p-2">TDS</th>
                      <th className="text-right p-2">Conductivity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {readings.map((reading) => (
                      <tr key={reading.id} className="border-b">
                        <td className="p-2">
                          {new Date(reading.timestamp).toLocaleString()}
                        </td>
                        <td className="text-right p-2">
                          {reading.temperature?.toFixed(1)} °C
                        </td>
                        <td className="text-right p-2">
                          {reading.ph?.toFixed(1)}
                        </td>
                        <td className="text-right p-2">
                          {reading.dissolvedOxygen?.toFixed(1)} mg/L
                        </td>
                        <td className="text-right p-2">
                          {reading.turbidity?.toFixed(1)} NTU
                        </td>
                        <td className="text-right p-2">
                          {reading.tds?.toFixed(0)} mg/L
                        </td>
                        <td className="text-right p-2">
                          {reading.conductivity?.toFixed(0)} μS/cm
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Alerts</h2>
            <Button variant="outline">
              Export Alerts
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Alert History</CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No alerts for this station</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div
                        className={`w-3 h-3 rounded-full mr-4 ${
                          alert.severity === "low"
                            ? "bg-alert-low"
                            : alert.severity === "medium"
                            ? "bg-alert-medium"
                            : alert.severity === "high"
                            ? "bg-alert-high"
                            : "bg-alert-critical"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <div className="font-medium">
                          {alert.parameter.charAt(0).toUpperCase() + alert.parameter.slice(1)} Alert
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Value: {alert.value.toFixed(1)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(alert.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {alert.acknowledged ? "Acknowledged" : "Unacknowledged"}
                        </div>
                        {alert.acknowledged && (
                          <div className="text-sm text-muted-foreground">
                            By: Admin
                          </div>
                        )}
                        {!alert.acknowledged && (
                          <Button variant="outline" size="sm">
                            Acknowledge
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>
                Configure API access for this station
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">API Key</h3>
                <div className="flex gap-2">
                  <Input type="password" value="••••••••••••••••••••••••••••••" readOnly />
                  <Button variant="outline">Show</Button>
                  <Button variant="outline">Regenerate</Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Use this API key to authenticate requests to the station's API endpoints
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">API Endpoints</h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div>
                        <span className="font-mono bg-muted px-1 py-0.5 rounded text-sm">GET</span>{" "}
                        <span className="font-mono">/api/stations/{id}/readings</span>
                      </div>
                      <div>
                        <span className="font-mono bg-muted px-1 py-0.5 rounded text-sm">POST</span>{" "}
                        <span className="font-mono">/api/stations/{id}/readings</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>
                Actions that cannot be undone
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete Station"}
              </Button>
              <p className="text-sm text-muted-foreground">
                This will permanently delete the station and all its associated data
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default StationDetailPage;
