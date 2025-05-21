
import { useEffect } from "react";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  useEffect(() => {
    document.title = "Login - Hydro Scan";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/30 water-pattern p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full bg-water animate-flow"></div>
            <div className="absolute inset-2 rounded-full bg-primary flex items-center justify-center text-white font-bold text-2xl">
              HS
            </div>
          </div>
          <h1 className="text-3xl font-bold text-primary">Hydro Scan</h1>
          <p className="text-muted-foreground mt-2">
            Water Quality Monitoring System
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
