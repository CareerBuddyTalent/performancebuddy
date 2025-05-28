
import React, { useState } from 'react';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
import { Survey } from '@/types/surveys';
import { SurveyActions } from './SurveyActions';

interface SurveyListProps {
  surveys: Survey[];
  onEdit: (survey: Survey) => void;
  onDelete: (surveyId: string) => void;
  onViewResponses: (surveyId: string) => void;
}

export default function SurveyList({ surveys, onEdit, onDelete, onViewResponses }: SurveyListProps) {
  const { user } = useSupabaseAuth();
  const canEdit = user?.role === 'admin' || user?.role === 'manager';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Surveys</CardTitle>
        <CardDescription>
          Manage and view surveys created by your organization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {surveys.map((survey) => (
                <TableRow key={survey.id}>
                  <TableCell className="font-medium">{survey.title}</TableCell>
                  <TableCell>{survey.description}</TableCell>
                  <TableCell>{survey.status}</TableCell>
                  <TableCell className="text-right">
                    <SurveyActions
                      surveyId={survey.id}
                      onEdit={() => onEdit(survey)}
                      onDelete={onDelete}
                      onShare={() => {}}
                      onViewResults={onViewResponses}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {surveys.length === 0 && (
          <div className="text-center p-4">
            No surveys found.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
