
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BadgeCheck } from "lucide-react";

export default function PreviousReviewCard() {
  return (
    <Card className="mt-6 border border-gray-200 dark:border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6">
        <div>
          <CardTitle className="text-lg">Q2 2023</CardTitle>
          <Badge variant="outline" className="mt-1">Previous</Badge>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center text-amber-600 dark:text-amber-400">
            <span className="font-medium">Developing</span>
            <TrendingUp className="ml-1 h-4 w-4" />
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">Grade</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Timeline</h4>
          <div className="relative">
            <div className="absolute left-0 top-4 h-0.5 w-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="relative flex justify-between">
              {/* Goal setting */}
              <div className="flex flex-col items-center">
                <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                  <BadgeCheck className="h-4 w-4" />
                </div>
                <span className="mt-2 text-xs font-medium">Goal setting</span>
                <span className="text-xs text-gray-500">Closed 1 Apr</span>
              </div>
              
              {/* Nomination */}
              <div className="flex flex-col items-center">
                <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                  <BadgeCheck className="h-4 w-4" />
                </div>
                <span className="mt-2 text-xs font-medium">Nomination</span>
                <span className="text-xs text-gray-500">Closed</span>
              </div>
              
              {/* Review */}
              <div className="flex flex-col items-center">
                <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                  <BadgeCheck className="h-4 w-4" />
                </div>
                <span className="mt-2 text-xs font-medium">Review</span>
                <span className="text-xs text-gray-500">Closed 17 Jun</span>
              </div>
              
              {/* Calibration */}
              <div className="flex flex-col items-center">
                <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                  <BadgeCheck className="h-4 w-4" />
                </div>
                <span className="mt-2 text-xs font-medium">Calibration</span>
                <span className="text-xs text-gray-500">Closed 25 Jul</span>
              </div>
              
              {/* Results */}
              <div className="flex flex-col items-center">
                <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                  <BadgeCheck className="h-4 w-4" />
                </div>
                <span className="mt-2 text-xs font-medium">Results</span>
                <span className="text-xs text-gray-500">Closed 2 Aug</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
