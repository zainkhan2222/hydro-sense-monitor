
import { cn } from "@/lib/utils";

interface StationStatusIndicatorProps {
  isActive: boolean;
  className?: string;
}

const StationStatusIndicator = ({ isActive, className }: StationStatusIndicatorProps) => {
  return (
    <div className="flex items-center space-x-2">
      <div
        className={cn(
          "w-2 h-2 rounded-full",
          isActive ? "bg-alert-low" : "bg-alert-high",
          className
        )}
      />
      <span className={cn(isActive ? "text-alert-low" : "text-alert-high")}>
        {isActive ? "Active" : "Inactive"}
      </span>
    </div>
  );
};

export default StationStatusIndicator;
