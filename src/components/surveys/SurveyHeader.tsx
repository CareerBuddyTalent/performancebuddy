
import { useAuth } from "@/context/AuthContext";

export default function SurveyHeader() {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col space-y-2">
      <h1 className="text-3xl font-bold tracking-tight">
        {user?.role === 'employee' ? 'Engagement Surveys' : 'Survey Management'}
      </h1>
      <p className="text-muted-foreground">
        {user?.role === 'employee' 
          ? 'Provide feedback through engagement surveys' 
          : 'Create and manage employee engagement surveys'}
      </p>
    </div>
  );
}
