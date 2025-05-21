
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ParameterStatus, ParameterType } from "@/types";
import { cn } from "@/lib/utils";

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
      return "parameter-good";
    case "warning":
      return "parameter-warning";
    case "danger":
      return "parameter-danger";
    case "critical":
      return "parameter-critical";
    default:
      return "";
  }
};

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
        <div className={cn("text-sm mt-1", `text-${status}`)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </CardContent>
    </Card>
  );
};

export default ParameterCard;
