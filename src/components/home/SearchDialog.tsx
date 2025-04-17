
import { useState, useEffect } from "react";
import { Search, FileText, Users, Calendar, BarChart } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";

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
  
  // Mock search results
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
      href: "/user/1",
      icon: <Users className="h-4 w-4 mr-2" />
    },
    { 
      id: "user-2", 
      name: "Michael Smith", 
      type: "user", 
      href: "/user/2",
      icon: <Users className="h-4 w-4 mr-2" />
    },
    { 
      id: "report-1", 
      name: "Q2 Team Performance", 
      type: "report", 
      href: "/reports/1",
      icon: <BarChart className="h-4 w-4 mr-2" />
    },
    { 
      id: "page-1", 
      name: "Calendar", 
      type: "page", 
      href: "/calendar",
      icon: <Calendar className="h-4 w-4 mr-2" />
    },
  ];

  // Update search results based on query
  const handleSearch = (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    
    const filteredResults = mockResults.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(filteredResults);
  };

  // Navigate to result
  const handleSelect = (item: SearchItem) => {
    window.location.href = item.href;
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0">
        <Command className="rounded-lg border shadow-md">
          <CommandInput 
            placeholder="Search for tasks, users, reports..."
            onValueChange={handleSearch}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Results">
              {searchResults.map((item) => (
                <CommandItem 
                  key={item.id}
                  onSelect={() => handleSelect(item)}
                  className="flex items-center"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
