
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ActiveReviewCycleProps {
  name: string;
  deadline: string;
}

export default function ActiveReviewCycle({ name, deadline }: ActiveReviewCycleProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Active Review Cycle</CardTitle>
        <CardDescription>Current review cycle requiring your input</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{name}</h3>
            <p className="text-sm text-muted-foreground">
              Due by {new Date(deadline).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
