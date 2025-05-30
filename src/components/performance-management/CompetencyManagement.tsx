
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, BookOpen, Target, Users } from 'lucide-react';
import { usePerformanceManagement } from '@/hooks/usePerformanceManagement';

export function CompetencyManagement() {
  const { competencyFrameworks } = usePerformanceManagement();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Competency Management</h2>
          <p className="text-muted-foreground">
            Define and manage competency frameworks for different roles and departments
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Framework
        </Button>
      </div>

      <div className="grid gap-4">
        {competencyFrameworks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Competency Frameworks</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create competency frameworks to define skills and behaviors required for different roles.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Framework
              </Button>
            </CardContent>
          </Card>
        ) : (
          competencyFrameworks.map((framework) => (
            <Card key={framework.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{framework.name}</CardTitle>
                    <CardDescription>
                      {framework.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={framework.is_active ? "default" : "secondary"}>
                      {framework.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline">
                      {framework.organization_level}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <p className="font-medium text-muted-foreground">Level</p>
                    <p className="capitalize">{framework.organization_level}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Department</p>
                    <p>{framework.department || 'All Departments'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Role Family</p>
                    <p>{framework.role_family || 'All Roles'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Competencies</p>
                    <p>{framework.framework_competencies?.length || 0}</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    <Target className="h-4 w-4 mr-2" />
                    Manage Competencies
                  </Button>
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    View Assessments
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
