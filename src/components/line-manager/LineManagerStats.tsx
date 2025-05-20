
import { Card, CardContent } from "@/components/ui/card";
import { User, Clock, Check, AlertCircle } from "lucide-react";

export default function LineManagerStats() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Team Members</p>
              <p className="text-2xl font-bold">8</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <User className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            2 new team members this quarter
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Upcoming 1:1s</p>
              <p className="text-2xl font-bold">3</p>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-full">
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            Next: Today at 2:00 PM
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Peer Reviews</p>
              <p className="text-2xl font-bold">6</p>
            </div>
            <div className="p-2 bg-green-500/10 rounded-full">
              <Check className="h-5 w-5 text-green-500" />
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            4 completed, 2 pending
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Needs Attention</p>
              <p className="text-2xl font-bold">2</p>
            </div>
            <div className="p-2 bg-amber-500/10 rounded-full">
              <AlertCircle className="h-5 w-5 text-amber-500" />
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            1 overdue review, 1 PIP to monitor
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
