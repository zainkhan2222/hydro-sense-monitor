
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Station } from "@/types";

interface StationFormProps {
  station?: Station;
  onSubmit?: (data: Partial<Station>) => void;
}

const StationForm = ({ station, onSubmit }: StationFormProps) => {
  const isEditing = !!station;
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: station?.name || "",
    description: station?.description || "",
    location: station?.location || "",
    latitude: station?.latitude || 0,
    longitude: station?.longitude || 0,
    isActive: station?.isActive ?? true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form data
    if (!formData.name || !formData.location) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // This would be replaced with actual Supabase logic
    setTimeout(() => {
      if (onSubmit) {
        onSubmit(formData);
      } else {
        toast({
          title: isEditing ? "Station Updated" : "Station Created",
          description: `${formData.name} has been ${isEditing ? "updated" : "created"} successfully`,
        });
        navigate("/stations");
      }
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <FormLabel htmlFor="name">Station Name *</FormLabel>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter station name"
              required
            />
            <FormDescription>
              A unique name to identify this monitoring station
            </FormDescription>
          </div>

          <div className="space-y-2">
            <FormLabel htmlFor="description">Description</FormLabel>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a detailed description of this station"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <FormLabel htmlFor="location">Location *</FormLabel>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., River Thames, London Bridge"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <FormLabel htmlFor="latitude">Latitude</FormLabel>
              <Input
                id="latitude"
                name="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="e.g., 51.5074"
              />
            </div>
            <div className="space-y-2">
              <FormLabel htmlFor="longitude">Longitude</FormLabel>
              <Input
                id="longitude"
                name="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="e.g., -0.1278"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={handleSwitchChange}
            />
            <FormLabel htmlFor="isActive">Active Station</FormLabel>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/stations")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditing ? "Update Station" : "Create Station"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default StationForm;
