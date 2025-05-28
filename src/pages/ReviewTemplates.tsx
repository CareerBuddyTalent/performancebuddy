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

export default function ReviewTemplates() {
  const { user } = useSupabaseAuth();
  const [templates, setTemplates] = useState([
    { id: "1", name: "360 Review", description: "Comprehensive review from multiple perspectives" },
    { id: "2", name: "Annual Performance Review", description: "Yearly evaluation of employee performance" },
  ]);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateDescription, setNewTemplateDescription] = useState("");

  const handleAddTemplate = () => {
    if (newTemplateName) {
      const newTemplate = {
        id: Date.now().toString(),
        name: newTemplateName,
        description: newTemplateDescription,
      };
      setTemplates([...templates, newTemplate]);
      setNewTemplateName("");
      setNewTemplateDescription("");
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Review Templates</CardTitle>
          <CardDescription>Manage and create review templates for your organization.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <Label htmlFor="templateName">Template Name</Label>
                <Input
                  id="templateName"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="e.g., 360 Review"
                />
              </div>
              <div className="col-span-1">
                <Label htmlFor="templateDescription">Description</Label>
                <Input
                  id="templateDescription"
                  value={newTemplateDescription}
                  onChange={(e) => setNewTemplateDescription(e.target.value)}
                  placeholder="e.g., Comprehensive review"
                />
              </div>
              <div className="col-span-1 flex items-end">
                <Button onClick={handleAddTemplate}>Add Template</Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.id}</TableCell>
                      <TableCell>{template.name}</TableCell>
                      <TableCell>{template.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
