import React, { useState } from 'react';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Company {
  id: string;
  name: string;
  description: string;
}

export default function CompanyManagement() {
  const { user } = useSupabaseAuth();
  const [companies, setCompanies] = useState<Company[]>([
    { id: "1", name: "Acme Corp", description: "Leading provider of innovative solutions." },
    { id: "2", name: "Beta Industries", description: "Revolutionizing the industry with cutting-edge technology." },
  ]);
  const [newCompany, setNewCompany] = useState<Omit<Company, 'id'>>({ name: '', description: '' });
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  const [editedCompany, setEditedCompany] = useState<Company>({ id: '', name: '', description: '' });

  if (user?.role !== 'admin') {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You do not have permission to view this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please contact your administrator for assistance.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCreateCompany = () => {
    if (!newCompany.name || !newCompany.description) {
      toast.error("Please fill in all fields to create a company.");
      return;
    }

    const newId = Math.random().toString(36).substring(7);
    const companyToAdd = { ...newCompany, id: newId };
    setCompanies([...companies, companyToAdd]);
    setNewCompany({ name: '', description: '' });
    toast.success(`${newCompany.name} created successfully!`);
  };

  const handleEditCompany = (company: Company) => {
    setEditingCompanyId(company.id);
    setEditedCompany(company);
  };

  const handleUpdateCompany = () => {
    if (!editedCompany.name || !editedCompany.description) {
      toast.error("Please fill in all fields to update the company.");
      return;
    }

    setCompanies(companies.map(company =>
      company.id === editedCompany.id ? editedCompany : company
    ));
    setEditingCompanyId(null);
    toast.success(`${editedCompany.name} updated successfully!`);
  };

  const handleDeleteCompany = (id: string) => {
    setCompanies(companies.filter(company => company.id !== id));
    toast.success("Company deleted successfully!");
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Company Management</CardTitle>
          <CardDescription>Create, edit, and manage companies within your organization.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Company Name"
              value={newCompany.name}
              onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Company Description"
              value={newCompany.description}
              onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
            />
          </div>
          <Button onClick={handleCreateCompany}>
            <Plus className="h-4 w-4 mr-2" />
            Create Company
          </Button>
        </CardContent>
      </Card>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell className="font-medium">{company.id}</TableCell>
              <TableCell>
                {editingCompanyId === company.id ? (
                  <Input
                    value={editedCompany.name}
                    onChange={(e) => setEditedCompany({ ...editedCompany, name: e.target.value })}
                  />
                ) : (
                  company.name
                )}
              </TableCell>
              <TableCell>
                {editingCompanyId === company.id ? (
                  <Input
                    value={editedCompany.description}
                    onChange={(e) => setEditedCompany({ ...editedCompany, description: e.target.value })}
                  />
                ) : (
                  company.description
                )}
              </TableCell>
              <TableCell className="text-right">
                {editingCompanyId === company.id ? (
                  <div className="flex justify-end gap-2">
                    <Button size="sm" onClick={handleUpdateCompany}>Update</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingCompanyId(null)}>Cancel</Button>
                  </div>
                ) : (
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEditCompany(company)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteCompany(company.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
