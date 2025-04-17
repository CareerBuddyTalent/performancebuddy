
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Edit, Users, BarChart, Heart } from "lucide-react";
import { Link } from "react-router-dom";

interface FavoriteItem {
  id: number;
  title: string;
  subtitle?: string;
  avatar?: string;
  type: "person" | "dashboard" | "chart";
}

export default function FavoritesSection({ favorites }: { favorites: FavoriteItem[] }) {
  return (
    <Card className="border-t-4 border-t-rose-400 overflow-hidden">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <Heart className="h-4 w-4 text-rose-500" />
            <span>Favorites</span>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[320px] overflow-y-auto">
          {favorites.map((item) => (
            <Link 
              key={item.id}
              to={item.type === "person" ? `/users/${item.id}` : item.type === "dashboard" ? "/dashboard" : "/performance"}
              className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800 last:border-0"
            >
              {item.type === "person" && (
                <Avatar className="h-10 w-10">
                  <AvatarImage src={item.avatar} alt={item.title} />
                  <AvatarFallback>{item.title.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              {item.type === "dashboard" && (
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 dark:text-blue-400">
                  <Users className="h-5 w-5" />
                </div>
              )}
              {item.type === "chart" && (
                <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
                  <BarChart className="h-5 w-5" />
                </div>
              )}
              <div>
                <div className="font-medium">{item.title}</div>
                {item.subtitle && (
                  <div className="text-xs text-gray-500">{item.subtitle}</div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
