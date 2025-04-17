
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ReviewCycleCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Current/Upcoming Review */}
      <Card className="border border-gray-200 dark:border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <span className="font-bold">Q4</span>
            </div>
            <div>
              <div className="text-lg font-medium">Mid III</div>
              <div className="text-sm text-gray-500">Q4 '24</div>
            </div>
            <Badge className="ml-auto bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300">
              Upcoming
            </Badge>
          </div>
        </CardContent>
      </Card>
      
      {/* Previous Review */}
      <Card className="border border-gray-200 dark:border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <span className="font-bold">Q3</span>
            </div>
            <div>
              <div className="text-lg font-medium">Mid II</div>
              <div className="text-sm text-gray-500">Q3 '24</div>
            </div>
            <Badge className="ml-auto bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400">
              Exceeding
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
