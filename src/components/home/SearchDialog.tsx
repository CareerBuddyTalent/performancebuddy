
import { useState, useEffect } from "react";
import { Search, FileText, Users, Calendar, BarChart, MessageSquare, TrendingUp, Clock, UserPlus, FileCheck } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { useNavigate } from "react-router-dom";

interface SearchItem {
  id: string;
  name: string;
  type: "task" | "user" | "report" | "page";
  href: string;
  icon: React.ReactNode;
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [query, setQuery] = useState<string>("");
  const navigate = useNavigate();
  
  // Generate mock search results with real icons for tasks
  const mockResults: SearchItem[] = [
    { 
      id: "task-1", 
      name: "Complete Q3 performance review", 
      type: "task", 
      href: "/tasks/1",
      icon: <FileText className="h-4 w-4 mr-2" />
    },
    { 
      id: "task-2", 
      name: "Update skills assessment", 
      type: "task", 
      href: "/tasks/2",
      icon: <FileText className="h-4 w-4 mr-2" />
    },
    { 
      id: "user-1", 
      name: "Sarah Johnson", 
      type: "user", 
      href: "/users",
      icon: <Users className="h-4 w-4 mr-2" />
    },
    { 
      id: "user-2", 
      name: "Michael Smith", 
      type: "user", 
      href: "/users",
      icon: <Users className="h-4 w-4 mr-2" />
    },
    { 
      id: "report-1", 
      name: "Q2 Team Performance", 
      type: "report", 
      href: "/performance",
      icon: <BarChart className="h-4 w-4 mr-2" />
    },
    { 
      id: "page-1", 
      name: "Calendar", 
      type: "page", 
      href: "/calendar",
      icon: <Calendar className="h-4 w-4 mr-2" />
    },
    { 
      id: "task-3", 
      name: "Pending feedback for interview", 
      type: "task", 
      href: "/feedback",
      icon: <MessageSquare className="h-4 w-4 mr-2" />
    },
    { 
      id: "task-4", 
      name: "KPI · Monthly revenue", 
      type: "task", 
      href: "/performance",
      icon: <TrendingUp className="h-4 w-4 mr-2" />
    },
    { 
      id: "task-5", 
      name: "Annual Leave Request", 
      type: "task", 
      href: "/timeoff",
      icon: <Clock className="h-4 w-4 mr-2" />
    },
    { 
      id: "task-6", 
      name: "Requisition · Accountant", 
      type: "task", 
      href: "/recruitment",
      icon: <UserPlus className="h-4 w-4 mr-2" />
    },
    { 
      id: "task-7", 
      name: "Pending Upload: Passport", 
      type: "task", 
      href: "/documents",
      icon: <FileCheck className="h-4 w-4 mr-2" />
    },
  ];

  // Update search results based on query
  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    
    if (!newQuery) {
      setSearchResults([]);
      return;
    }
    
    const filteredResults = mockResults.filter(item => 
      item.name.toLowerCase().includes(newQuery.toLowerCase())
    );
    
    setSearchResults(filteredResults);
  };

  // Navigate to result
  const handleSelect = (item: SearchItem) => {
    navigate(item.href);
    onOpenChange(false);
    setQuery("");
  };

  // Clear search when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery("");
      setSearchResults([]);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0">
        <Command className="rounded-lg border shadow-md">
          <CommandInput 
            placeholder="Search for tasks, users, reports..."
            value={query}
            onValueChange={handleSearch}
            autoFocus
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {searchResults.length > 0 && (
              <CommandGroup heading="Results">
                {searchResults.map((item) => (
                  <CommandItem 
                    key={item.id}
                    onSelect={() => handleSelect(item)}
                    className="flex items-center cursor-pointer"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
