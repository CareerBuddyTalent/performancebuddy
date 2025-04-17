
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Building2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Company } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { companies as mockCompanies } from "@/data/mockData";

export default function CompanyManagement() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logoUrl: ""
  });

  const isAdmin = user?.role === "admin";

  const handleOpenAddDialog = () => {
    setFormData({
      name: "",
      description: "",
      logoUrl: ""
    });
    setShowAddDialog(true);
  };

  const handleOpenEditDialog = (company: Company) => {
    setFormData({
      name: company.name,
      description: company.description || "",
      logoUrl: company.logoUrl || ""
    });
    setEditingCompany(company);
    setShowAddDialog(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Company name is required",
        variant: "destructive"
      });
      return;
    }

    if (editingCompany) {
      // Update existing company
      const updatedCompanies = companies.map(c => 
        c.id === editingCompany.id ? { ...c, ...formData } : c
      );
      setCompanies(updatedCompanies);
      toast({
        title: "Company updated",
        description: `${formData.name} has been updated successfully`
      });
    } else {
      // Add new company
      const newCompany: Company = {
        id: `comp${Date.now()}`,
        name: formData.name,
        description: formData.description,
        logoUrl: formData.logoUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${formData.name.replace(/\s/g, '')}`
      };
      setCompanies([...companies, newCompany]);
      toast({
        title: "Company added",
        description: `${formData.name} has been added successfully`
      });
    }

    setShowAddDialog(false);
    setEditingCompany(null);
  };

  const confirmDelete = (company: Company) => {
    setCompanyToDelete(company);
    setIsConfirmDeleteOpen(true);
  };

  const handleDelete = () => {
    if (companyToDelete) {
      setCompanies(companies.filter(c => c.id !== companyToDelete.id));
      toast({
        title: "Company deleted",
        description: `${companyToDelete.name} has been deleted`
      });
      setIsConfirmDeleteOpen(false);
      setCompanyToDelete(null);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Company Management</h1>
          <p className="text-muted-foreground">
            Manage your organization's companies and their details
          </p>
        </div>
        {isAdmin && (
          <Button onClick={handleOpenAddDialog}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Company
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map(company => (
          <Card key={company.id} className="overflow-hidden">
            <div className="bg-primary/10 h-24 flex items-center justify-center">
              <Avatar className="h-16 w-16 border-4 border-background">
                <AvatarImage src={company.logoUrl} alt={company.name} />
                <AvatarFallback className="text-xl">{company.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                {company.name}
                {isAdmin && (
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEditDialog(company)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => confirmDelete(company)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                )}
              </CardTitle>
              <CardDescription>{company.description}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Company ID: {company.id}
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <a href={`/users?company=${company.id}`}>
                  View Users
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Company Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingCompany ? "Edit Company" : "Add New Company"}</DialogTitle>
            <DialogDescription>
              {editingCompany ? "Update company details" : "Add a new company to the platform"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Acme Corporation"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the company..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input
                id="logoUrl"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
              />
              <p className="text-xs text-muted-foreground">
                If left blank, a default logo will be generated based on the company name.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingCompany ? "Save Changes" : "Add Company"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {companyToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsConfirmDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
