
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ParameterType } from "@/types";
import { cn } from "@/lib/utils";

// Define ParameterStatus type locally since it's not in the types file
export type ParameterStatus = 'good' | 'warning' | 'danger' | 'critical';

interface ParameterCardProps {
  name: ParameterType | string;
  value: number;
  unit: string;
  status: ParameterStatus;
  onClick?: () => void;
}

const getStatusClass = (status: ParameterStatus): string => {
  switch (status) {
    case "good":
      return "bg-green-500";
    case "warning":
      return "bg-yellow-500";
    case "danger":
      return "bg-orange-500";
    case "critical":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const formatParameterName = (name: string): string => {
  switch (name) {
    case "ph":
      return "pH";
    case "tds":
      return "TDS";
    default:
      return name.charAt(0).toUpperCase() + name.slice(1);
  }
};

const ParameterCard = ({ name, value, unit, status, onClick }: ParameterCardProps) => {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all hover:shadow-md", 
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <div className={cn("h-2", getStatusClass(status))} />
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{formatParameterName(name)}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end space-x-1">
          <div className="text-3xl font-bold">{value.toFixed(1)}</div>
          <div className="text-sm text-muted-foreground mb-1">{unit}</div>
        </div>
        <div className="text-sm mt-1">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </CardContent>
    </Card>
  );
};

export default ParameterCard;
