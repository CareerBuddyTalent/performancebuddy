
import { useState } from "react";
import { useCompany } from "@/context/CompanyContext";
import { Goal } from "@/types";
import { Search, Plus, Settings, MoreHorizontal, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompanySelector from "@/components/CompanySelector";
import PerformanceGoalTable from "@/components/performance/PerformanceGoalTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock performance goals data
const performanceGoals: Goal[] = [
  {
    id: "1",
    userId: "user1",
    title: "Dream Team",
    description: "Build a high-performing team",
    dueDate: new Date(2024, 11, 31),
    status: "in_progress",
    progress: 71,
    createdAt: new Date(),
    updatedAt: new Date(),
    level: "company",
    metrics: [
      { name: "Team members", target: 75000, current: 53250, unit: "£" }
    ]
  },
  {
    id: "2",
    userId: "user1",
    title: "Fast Growth",
    description: "Achieve rapid growth targets",
    dueDate: new Date(2024, 11, 31),
    status: "in_progress",
    progress: 31,
    createdAt: new Date(),
    updatedAt: new Date(),
    level: "company",
    metrics: [
      { name: "New users", target: 75, current: 23, unit: "people" }
    ]
  },
  {
    id: "3",
    userId: "user1",
    title: "Profitability",
    description: "Increase profit margins",
    dueDate: new Date(2024, 11, 31),
    status: "in_progress",
    progress: 75,
    createdAt: new Date(),
    updatedAt: new Date(),
    level: "company",
    metrics: [
      { name: "Profit margin", target: 23, current: 19, unit: "%" }
    ]
  },
  {
    id: "4",
    userId: "user1",
    title: "Deliver WOW",
    description: "Exceed customer expectations",
    dueDate: new Date(2024, 11, 31),
    status: "not_started",
    progress: 20,
    createdAt: new Date(),
    updatedAt: new Date(),
    level: "company",
    metrics: [
      { name: "Delivery time", target: 5, current: 9, unit: "Days" }
    ]
  },
  {
    id: "5",
    userId: "user1",
    title: "Customer Service",
    description: "Improve customer satisfaction",
    dueDate: new Date(2024, 11, 31),
    status: "in_progress",
    progress: 54,
    createdAt: new Date(),
    updatedAt: new Date(),
    level: "company",
    metrics: [
      { name: "Satisfaction score", target: 100, current: 77, unit: "%" }
    ]
  }
];

export default function Performance() {
  const { companies, currentCompany, setCurrentCompany } = useCompany();
  const [activeTab, setActiveTab] = useState("goals");
  const goalsCompletion = 50;
  const roadmapCompletion = 73;
  
  const handleCompanyChange = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    if (company) {
      setCurrentCompany(company);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-bold">
            R
          </div>
          <h1 className="text-2xl font-bold">Performance</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-gray-400">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400">
            <div className="relative">
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
            </svg>
          </Button>
          <div className="flex items-center ml-4 bg-gray-800 rounded-lg p-1">
            <div className="flex items-center space-x-2 px-2">
              <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <CompanySelector 
                companies={companies}
                selectedCompanyId={currentCompany?.id || ""}
                onCompanyChange={handleCompanyChange}
              />
            </div>
            <Avatar className="h-8 w-8 ml-2">
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Navigation Sidebar */}
      <div className="flex flex-1">
        <nav className="w-20 bg-black border-r border-gray-800">
          <div className="flex flex-col items-center space-y-8 py-8">
            <Button variant="ghost" className="w-full flex flex-col items-center p-2 rounded text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span className="text-xs mt-1">Home</span>
            </Button>
            <Button variant="ghost" className="w-full flex flex-col items-center p-2 rounded text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span className="text-xs mt-1">My Profile</span>
            </Button>
            <Button variant="ghost" className="w-full flex flex-col items-center p-2 rounded text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span className="text-xs mt-1">People</span>
            </Button>
            <Button variant="ghost" className="w-full flex flex-col items-center p-2 rounded text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              <span className="text-xs mt-1">Recruitment</span>
            </Button>
            <Button variant="ghost" className="w-full flex flex-col items-center p-2 rounded bg-gray-800 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20V10"></path>
                <path d="M18 20V4"></path>
                <path d="M6 20v-4"></path>
              </svg>
              <span className="text-xs mt-1">Performance</span>
            </Button>
            <Button variant="ghost" className="w-full flex flex-col items-center p-2 rounded text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="7"></circle>
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
              </svg>
              <span className="text-xs mt-1">Organisation</span>
            </Button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Tab Navigation */}
          <div className="mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList className="bg-gray-900 p-1">
                <TabsTrigger value="goals" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="2"></circle>
                  </svg>
                  Goals
                </TabsTrigger>
                <TabsTrigger value="reviews" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 4-2 4-2v-2.5c-1 .5-1.5 1-3 1-1.5 0-2.5-1-4-1-1.5 0-2.5 1-4 1-1.5 0-2 -.5-3-1v2.5s1 2 4 2c1.25 0 2.5-1.06 4-1.06z"></path>
                    <path d="M12 15.94c1.5 0 2.75 1.06 4 1.06 3 0 4-2 4-2v-2.5c-1 .5-1.5 1-3 1-1.5 0-2.5-1-4-1-1.5 0-2.5 1-4 1-1.5 0-2 -.5-3-1v2.5s1 2 4 2c1.25 0 2.5-1.06 4-1.06z"></path>
                    <path d="M12 10.94c1.5 0 2.75 1.06 4 1.06 3 0 4-2 4-2v-2.5c-1 .5-1.5 1-3 1-1.5 0-2.5-1-4-1-1.5 0-2.5 1-4 1-1.5 0-2 -.5-3-1v2.5s1 2 4 2c1.25 0 2.5-1.06 4-1.06z"></path>
                    <path d="M12 5.94c1.5 0 2.75 1.06 4 1.06 3 0 4-2 4-2v-2.5c-1 .5-1.5 1-3 1-1.5 0-2.5-1-4-1-1.5 0-2.5 1-4 1-1.5 0-2 -.5-3-1v2.5s1 2 4 2c1.25 0 2.5-1.06 4-1.06z"></path>
                  </svg>
                  Reviews
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v18h18"></path>
                    <path d="M18 17V9"></path>
                    <path d="M13 17V5"></path>
                    <path d="M8 17v-3"></path>
                  </svg>
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="surveys" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="9" y1="9" x2="15" y2="9"></line>
                    <line x1="9" y1="12" x2="15" y2="12"></line>
                    <line x1="9" y1="15" x2="15" y2="15"></line>
                  </svg>
                  Surveys
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6 max-w-sm">
            <div className="bg-gray-900 rounded-lg p-4">
              <span className="text-amber-500 text-3xl font-bold">{goalsCompletion}%</span>
              <p className="text-sm text-gray-400">Goals</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <span className="text-teal-500 text-3xl font-bold">{roadmapCompletion}%</span>
              <p className="text-sm text-gray-400">Roadmap</p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap justify-between items-center bg-gray-900 rounded-lg p-2 mb-6">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="text-gray-400">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" className="flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Q3 2024 current
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="7"></circle>
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                </svg>
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button className="bg-white hover:bg-gray-100 text-black flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add new goal
              </Button>
              <Button variant="ghost" className="text-gray-400 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3"></path>
                  <path d="M21 14v3a2 2 0 0 1-2 2h-3m-7 0H5a2 2 0 0 1-2-2v-3"></path>
                  <path d="m9 10 3-3 3 3"></path>
                  <path d="M12 20v-9"></path>
                </svg>
                Edit weights
              </Button>
              <Button variant="ghost" className="text-gray-400 flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Performance Goals Table */}
          <PerformanceGoalTable goals={performanceGoals} />
        </main>
      </div>
    </div>
  );
}
