
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ParameterType, Reading } from "@/types";

interface ReadingsChartProps {
  readings: Reading[];
  title?: string;
}

const colorMap = {
  pH: "#2196F3",
  temperature: "#FF9800",
  dissolvedOxygen: "#4CAF50",
  turbidity: "#9C27B0",
  tds: "#795548",
  conductivity: "#F44336",
};

const unitMap = {
  pH: "",
  temperature: "°C",
  dissolvedOxygen: "mg/L",
  turbidity: "NTU",
  tds: "mg/L",
  conductivity: "μS/cm",
};

const ReadingsChart = ({ readings, title = "Water Quality Readings" }: ReadingsChartProps) => {
  const [selectedParameter, setSelectedParameter] = useState<ParameterType>("temperature");
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Format data for chart
    if (readings && readings.length > 0) {
      const data = readings.map((reading) => ({
        time: new Date(reading.timestamp).toLocaleString(),
        ...reading.parameters,
      }));
      setChartData(data);
    }
  }, [readings]);

  const formatParameterName = (name: string): string => {
    switch (name) {
      case "pH":
        return "pH";
      case "tds":
        return "TDS";
      default:
        return name.charAt(0).toUpperCase() + name.slice(1);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Select
          value={selectedParameter}
          onValueChange={(value) => setSelectedParameter(value as ParameterType)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select parameter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="temperature">Temperature</SelectItem>
            <SelectItem value="pH">pH</SelectItem>
            <SelectItem value="dissolvedOxygen">Dissolved Oxygen</SelectItem>
            <SelectItem value="turbidity">Turbidity</SelectItem>
            <SelectItem value="tds">TDS</SelectItem>
            <SelectItem value="conductivity">Conductivity</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis 
              label={{ 
                value: unitMap[selectedParameter], 
                angle: -90, 
                position: 'insideLeft' 
              }} 
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={selectedParameter}
              stroke={colorMap[selectedParameter]}
              activeDot={{ r: 8 }}
              name={formatParameterName(selectedParameter)}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ReadingsChart;
