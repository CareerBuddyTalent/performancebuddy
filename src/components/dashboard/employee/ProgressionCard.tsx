
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProgressionCard() {
  return (
    <Card className="border border-gray-200 dark:border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Progression</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Overall Grade */}
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 rounded-full bg-cyan-100 dark:bg-cyan-900/30">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">Q3</span>
              </div>
              <div className="absolute inset-0">
                <svg viewBox="0 0 100 100" className="h-full w-full rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                    className="text-cyan-500 dark:text-cyan-400"
                    strokeDasharray="283"
                    strokeDashoffset="70"
                  />
                </svg>
              </div>
            </div>
            <div>
              <div className="text-xl font-bold text-cyan-500 dark:text-cyan-400">Exceeding</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Overall grade</div>
            </div>
          </div>
          
          {/* Review cycles */}
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-semibold">3/4</span>
              </div>
              <div className="absolute inset-0">
                <svg viewBox="0 0 100 100" className="h-full w-full rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                    className="text-blue-500 dark:text-blue-400"
                    strokeDasharray="283"
                    strokeDashoffset="70"
                  />
                </svg>
              </div>
            </div>
            <div>
              <div className="text-xl font-bold">Review cycles</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">4 cycles required</div>
            </div>
          </div>
          
          {/* Performing grades */}
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/30">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-semibold">1/2</span>
              </div>
              <div className="absolute inset-0">
                <svg viewBox="0 0 100 100" className="h-full w-full rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                    className="text-purple-500 dark:text-purple-400"
                    strokeDasharray="283"
                    strokeDashoffset="140"
                  />
                </svg>
              </div>
            </div>
            <div>
              <div className="text-xl font-bold">Performing grades</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">2 required</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
