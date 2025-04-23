
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md text-center">
        <img 
          src="/lovable-uploads/5f7f5cab-6e48-4d4e-b4a2-edee8cc1cbc4.png" 
          alt="CareerBuddy" 
          className="mx-auto mb-8 h-12"
        />
        <h1 className="text-2xl font-bold mb-4">Welcome to CareerBuddy</h1>
        <p className="text-muted-foreground mb-6">
          Streamline your performance management process
        </p>
        <Button 
          onClick={() => navigate('/login')} 
          className="w-full"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}
