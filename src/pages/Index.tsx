
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/30 water-pattern p-4">
      <div className="max-w-lg w-full text-center">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-water animate-flow"></div>
          <div className="absolute inset-3 rounded-full bg-primary flex items-center justify-center text-white font-bold text-3xl">
            HS
          </div>
        </div>
        <h1 className="text-4xl font-bold text-primary mb-4">Hydro Scan</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Advanced Water Quality Monitoring System
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
          <Button 
            onClick={() => navigate("/login")} 
            size="lg"
            className="text-lg py-6"
          >
            Login
          </Button>
          <Button 
            onClick={() => navigate("/register")} 
            size="lg" 
            variant="outline"
            className="text-lg py-6"
          >
            Register
          </Button>
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          Connect, monitor, and analyze water quality data in real-time
        </p>
      </div>
    </div>
  );
};

export default Index;
