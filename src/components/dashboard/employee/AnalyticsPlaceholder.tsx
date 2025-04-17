
import { Award } from "lucide-react";

export default function AnalyticsPlaceholder() {
  return (
    <div className="flex h-[200px] items-center justify-center border rounded-lg bg-gray-50 dark:bg-gray-800/30">
      <div className="text-center">
        <Award className="mx-auto h-10 w-10 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium">Performance Analytics</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Performance analytics will be available after more review cycles.
        </p>
      </div>
    </div>
  );
}
