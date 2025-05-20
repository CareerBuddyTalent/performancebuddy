
import React from 'react';
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface OKRTreeFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterLevel: string;
  setFilterLevel: (level: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
}

export const OKRTreeFilters: React.FC<OKRTreeFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  filterLevel,
  setFilterLevel,
  expandAll,
  collapseAll
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search objectives..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Select value={filterLevel} onValueChange={setFilterLevel}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="company">Company</SelectItem>
            <SelectItem value="department">Department</SelectItem>
            <SelectItem value="team">Team</SelectItem>
            <SelectItem value="individual">Individual</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" size="sm" onClick={expandAll}>Expand All</Button>
        <Button variant="outline" size="sm" onClick={collapseAll}>Collapse All</Button>
      </div>
    </div>
  );
};
