import React, { useState } from 'react';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarDateRangePicker } from "@/components/ui/calendar"

export default function PerformanceCycles() {
  const { user } = useSupabaseAuth();
  const [cycles, setCycles] = useState([
    {
      id: "1",
      name: "Q1 2024",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-03-31"),
      status: "active",
    },
    {
      id: "2",
      name: "Q2 2024",
      startDate: new Date("2024-04-01"),
      endDate: new Date("2024-06-30"),
      status: "scheduled",
    },
  ]);

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Performance Review Cycles</CardTitle>
          <CardDescription>
            Manage and schedule performance review cycles for your organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center space-x-4">
              <Calendar className="mr-2 h-4 w-4" />
              <div>
                <Label htmlFor="from">From</Label>
                <Input type="date" id="from" className="w-full" />
              </div>
              <div>
                <Label htmlFor="to">To</Label>
                <Input type="date" id="to" className="w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Cycles</h4>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Name</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cycles.map((cycle) => (
                      <TableRow key={cycle.id}>
                        <TableCell className="font-medium">{cycle.name}</TableCell>
                        <TableCell>{cycle.startDate.toLocaleDateString()}</TableCell>
                        <TableCell>{cycle.endDate.toLocaleDateString()}</TableCell>
                        <TableCell>{cycle.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            <Button>Create New Cycle</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
