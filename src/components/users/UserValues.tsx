
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Trophy, Star, Users, BookOpen, Compass } from "lucide-react";

interface CompanyValue {
  id: string;
  name: string;
  description: string;
  icon: keyof typeof valueIcons;
  score?: number;
}

const valueIcons = {
  Heart,
  Trophy,
  Star,
  Users,
  BookOpen,
  Compass,
};

const companyValues: CompanyValue[] = [
  {
    id: "v1",
    name: "Customer First",
    description: "Always prioritize customer needs and experience",
    icon: "Heart",
    score: 4
  },
  {
    id: "v2",
    name: "Excellence",
    description: "Strive for the highest quality in everything we do",
    icon: "Trophy",
    score: 3
  },
  {
    id: "v3",
    name: "Innovation",
    description: "Embrace change and drive creative solutions",
    icon: "Star",
    score: 4
  },
  {
    id: "v4",
    name: "Collaboration",
    description: "Work together effectively across teams",
    icon: "Users",
    score: 5
  },
  {
    id: "v5",
    name: "Learning",
    description: "Continuous growth and development",
    icon: "BookOpen",
    score: 4
  },
  {
    id: "v6",
    name: "Integrity",
    description: "Act with honesty and transparency",
    icon: "Compass",
    score: 5
  }
];

interface UserValuesProps {
  userName: string;
}

export default function UserValues({ userName }: UserValuesProps) {
  const getScoreColor = (score: number) => {
    if (score >= 4.5) return "text-green-600 dark:text-green-400";
    if (score >= 3.5) return "text-blue-600 dark:text-blue-400";
    if (score >= 2.5) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Values & Culture</CardTitle>
        <CardDescription>
          Alignment with company values and cultural contribution
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companyValues.map((value) => {
            const Icon = valueIcons[value.icon];
            return (
              <div
                key={value.id}
                className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{value.name}</h3>
                      {value.score && (
                        <Badge 
                          variant="outline" 
                          className={getScoreColor(value.score)}
                        >
                          {value.score}/5
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
