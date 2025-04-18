
import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Company } from "@/types";

interface CompanySelectorProps {
  companies: Company[];
  selectedCompanyId: string;
  onCompanyChange: (companyId: string) => void;
}

export default function CompanySelector({ 
  companies, 
  selectedCompanyId, 
  onCompanyChange 
}: CompanySelectorProps) {
  const [open, setOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  useEffect(() => {
    const company = companies.find(c => c.id === selectedCompanyId) || null;
    setSelectedCompany(company);
  }, [selectedCompanyId, companies]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="flex items-center justify-between text-sm font-normal"
        >
          {selectedCompany ? (
            <div className="flex items-center gap-2">
              {selectedCompany.logoUrl ? (
                <Avatar className="h-6 w-6">
                  <AvatarImage src={selectedCompany.logoUrl} alt={selectedCompany.name} />
                  <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
                    {selectedCompany.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Building2 className="h-4 w-4 text-gray-600" />
              )}
              <span className="text-gray-800">{selectedCompany.name}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-600" />
              <span className="text-gray-800">Select company</span>
            </div>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-white border-gray-200 shadow-lg">
        <Command className="bg-white">
          <CommandInput placeholder="Search company..." className="text-gray-700" />
          <CommandEmpty className="text-gray-500">No company found.</CommandEmpty>
          <CommandGroup className="text-gray-700">
            {companies.map((company) => (
              <CommandItem
                key={company.id}
                value={company.id}
                onSelect={() => {
                  onCompanyChange(company.id);
                  setOpen(false);
                }}
                className="text-gray-800 hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={company.logoUrl} alt={company.name} />
                    <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
                      {company.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{company.name}</span>
                </div>
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    selectedCompanyId === company.id ? "opacity-100 text-green-500" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
