
import { Spinner } from "@/components/ui/spinner";

interface GlobalLoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export function GlobalLoading({ message = "Loading...", fullScreen = false }: GlobalLoadingProps) {
  const containerClasses = fullScreen 
    ? "flex min-h-screen w-full items-center justify-center bg-background"
    : "flex h-full w-full items-center justify-center p-8";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center space-y-4">
        <Spinner size="lg" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
