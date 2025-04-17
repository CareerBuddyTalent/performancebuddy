
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, Users, BarChart } from "lucide-react";

interface FavoriteItem {
  id: number;
  title: string;
  subtitle?: string;
  avatar?: string;
  type: "person" | "dashboard" | "chart";
}

export default function FavoritesSection({ favorites }: { favorites: FavoriteItem[] }) {
  return (
    <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <span className="font-medium">Favourites</span>
        <Button variant="ghost" size="sm" className="p-1">
          <Edit className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-3">
        {favorites.map((item) => (
          <div 
            key={item.id}
            className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            {item.type === "person" && (
              <Avatar className="h-10 w-10">
                <AvatarImage src={item.avatar} alt={item.title} />
                <AvatarFallback>{item.title.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            {item.type === "dashboard" && (
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-500">
                <Users className="h-5 w-5" />
              </div>
            )}
            {item.type === "chart" && (
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-500">
                <BarChart className="h-5 w-5" />
              </div>
            )}
            <div>
              <div className="font-medium">{item.title}</div>
              {item.subtitle && (
                <div className="text-xs text-gray-500">{item.subtitle}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
