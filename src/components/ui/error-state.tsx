
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ErrorStateProps {
  title?: string;
  message?: string;
  fullScreen?: boolean;
  retry?: () => void;
}

export function ErrorState({
  title = "An error occurred",
  message = "We encountered a problem while loading the data. Please try again.",
  fullScreen = false,
  retry,
}: ErrorStateProps) {
  const containerClasses = fullScreen
    ? "flex min-h-screen w-full items-center justify-center bg-background"
    : "w-full p-4";

  return (
    <div className={containerClasses}>
      <div className="max-w-md w-full">
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <div className="flex flex-col">
            <h5 className="font-medium">{title}</h5>
            <AlertDescription>{message}</AlertDescription>
          </div>
        </Alert>
        
        {retry && (
          <Button onClick={retry} className="w-full">
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
