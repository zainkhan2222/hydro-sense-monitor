
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import StationCard from "@/components/stations/StationCard";
import ReadingsChart from "@/components/readings/ReadingsChart";
import ParameterCard from "@/components/readings/ParameterCard";
import { Alert, Reading, Station } from "@/types";
import { ParameterStatus } from "@/components/readings/ParameterCard";

// Define DashboardSummary type locally if needed
interface DashboardSummary {
  totalStations: number;
  activeStations: number;
  totalAlerts: number;
  unacknowledgedAlerts: number;
  recentReadings: Reading[];
  recentAlerts: Alert[];
}

// Mock data
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
    createdAt: "2023-05-20T10:30:00Z",
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
    createdAt: "2023-05-20T11:30:00Z",
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
    createdAt: "2023-05-20T12:30:00Z",
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
    createdAt: "2023-05-20T13:30:00Z",
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
    createdAt: "2023-05-20T14:30:00Z",
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

const Dashboard = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<DashboardSummary>({
    totalStations: 0,
    activeStations: 0,
    totalAlerts: 0,
    unacknowledgedAlerts: 0,
    recentReadings: [],
    recentAlerts: []
  });

  useEffect(() => {
    document.title = "Dashboard - Hydro Scan";
    
    // Simulate fetching dashboard summary
    const fetchDashboardSummary = () => {
      // This would be replaced with actual Supabase logic
      setTimeout(() => {
        const activeStationsCount = mockStations.filter(station => station.isActive).length;
        const unacknowledgedAlertsCount = mockAlerts.filter(alert => !alert.acknowledged).length;
        
        setSummary({
          totalStations: mockStations.length,
          activeStations: activeStationsCount,
          totalAlerts: mockAlerts.length,
          unacknowledgedAlerts: unacknowledgedAlertsCount,
          recentReadings: mockReadings,
          recentAlerts: mockAlerts
        });
      }, 500);
    };
    
    fetchDashboardSummary();
  }, []);

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your water quality monitoring system
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Stations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary.totalStations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Stations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary.activeStations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary.totalAlerts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unacknowledged Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-alert-high">{summary.unacknowledgedAlerts}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {mockReadings[0] && (
          <>
            <ParameterCard
              name="temperature"
              value={mockReadings[0].temperature || 0}
              unit="°C"
              status="good"
              onClick={() => navigate("/stations/1/readings")}
            />
            <ParameterCard
              name="ph"
              value={mockReadings[0].ph || 0}
              unit=""
              status="warning"
              onClick={() => navigate("/stations/1/readings")}
            />
            <ParameterCard
              name="dissolvedOxygen"
              value={mockReadings[0].dissolvedOxygen || 0}
              unit="mg/L"
              status="good"
              onClick={() => navigate("/stations/1/readings")}
            />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <ReadingsChart readings={mockReadings} title="Recent Readings" />
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>
                Latest alerts from your monitoring stations
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/alerts")}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAlerts.map((alert) => (
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
                      Station: {mockStations.find((s) => s.id === alert.stationId)?.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-medium ${
                        alert.severity === "low"
                          ? "text-alert-low"
                          : alert.severity === "medium"
                          ? "text-alert-medium"
                          : alert.severity === "high"
                          ? "text-alert-high"
                          : "text-alert-critical"
                      }`}
                    >
                      {alert.value.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {alert.acknowledged ? "Acknowledged" : "Unacknowledged"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Stations</h2>
          <Button onClick={() => navigate("/stations/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Station
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mockStations.map((station) => (
            <StationCard key={station.id} station={station} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
