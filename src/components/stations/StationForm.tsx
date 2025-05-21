
import React from "react";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the validation schema using Zod
const stationFormSchema = z.object({
  name: z.string().min(1, "Station name is required"),
  description: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  isActive: z.boolean().default(true),
});

// Define the type based on the schema
type StationFormValues = z.infer<typeof stationFormSchema>;

interface StationFormProps {
  station?: Station;
  onSubmit?: (data: Partial<Station>) => void;
}

const StationForm = ({ station, onSubmit }: StationFormProps) => {
  const isEditing = !!station;
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Initialize the form with useForm hook and zodResolver for validation
  const form = useForm<StationFormValues>({
    resolver: zodResolver(stationFormSchema),
    defaultValues: {
      name: station?.name || "",
      description: station?.description || "",
      location: station?.location || "",
      latitude: station?.latitude || 0,
      longitude: station?.longitude || 0,
      isActive: station?.isActive ?? true,
    },
  });
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleFormSubmit = (data: StationFormValues) => {
    setIsSubmitting(true);

    // This would be replaced with actual Supabase logic
    setTimeout(() => {
      if (onSubmit) {
        onSubmit(data);
      } else {
        toast({
          title: isEditing ? "Station Updated" : "Station Created",
          description: `${data.name} has been ${isEditing ? "updated" : "created"} successfully`,
        });
        navigate("/stations");
      }
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <CardContent className="space-y-4 pt-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Station Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter station name" {...field} />
                  </FormControl>
                  <FormDescription>
                    A unique name to identify this monitoring station
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter a detailed description of this station" 
                      rows={3} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., River Thames, London Bridge" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="any" 
                        placeholder="e.g., 51.5074"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="any" 
                        placeholder="e.g., -0.1278"
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Switch 
                      checked={field.value} 
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Active Station</FormLabel>
                </FormItem>
              )}
            />
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
      </Form>
    </Card>
  );
};

export default StationForm;
