
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, MoreHorizontal, Edit, Trash } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Station } from "@/types";
import StationStatusIndicator from "./StationStatusIndicator";
import { useToast } from "@/hooks/use-toast";

interface StationCardProps {
  station: Station;
  onDelete?: (id: string) => void;
}

const StationCard = ({ station, onDelete }: StationCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleNavigate = () => {
    navigate(`/stations/${station.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/stations/${station.id}/edit`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    
    // This would be replaced with actual Supabase delete logic
    setTimeout(() => {
      if (onDelete) {
        onDelete(station.id);
        toast({
          title: "Station deleted",
          description: `${station.name} has been deleted successfully`,
        });
      }
      setIsDeleting(false);
    }, 1000);
  };

  const lastReadingDate = station.lastReading
    ? new Date(station.lastReading.timestamp).toLocaleString()
    : "No readings yet";

  return (
    <Card
      className="cursor-pointer hover:border-primary transition-colors"
      onClick={handleNavigate}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{station.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-destructive focus:text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                {isDeleting ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="line-clamp-2">
          {station.description || "No description provided"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status:</span>
            <StationStatusIndicator isActive={station.isActive} />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Location:</span>
            <span>{station.location}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Last Reading:</span>
            <span>{lastReadingDate}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" onClick={handleNavigate}>
          <Settings className="mr-2 h-4 w-4" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StationCard;
