
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award, BookOpen, TrendingUp, Users, Plus, Settings } from 'lucide-react';
import { usePerformanceManagement } from '@/hooks/usePerformanceManagement';

export function CompetencyManagement() {
  const { competencyFrameworks, loading } = usePerformanceManagement();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'novice': return 'bg-red-100 text-red-800';
      case 'developing': return 'bg-yellow-100 text-yellow-800';
      case 'proficient': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-green-100 text-green-800';
      case 'expert': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalCompetencies = competencyFrameworks.reduce((acc, f) => 
    acc + (f.framework_competencies?.length || 0), 0
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Competency Management</h2>
          <p className="text-muted-foreground">
            Define and assess competencies across roles and teams
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Framework
        </Button>
      </div>

      {/* Competency Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Frameworks</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{competencyFrameworks.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Competencies</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompetencies}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assessments</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Completed this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coverage</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">
              Employees assessed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Frameworks List */}
      <div className="space-y-4">
        {competencyFrameworks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Award className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No competency frameworks yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create competency frameworks to standardize skill assessments across your organization.
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
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
                    <CardDescription>{framework.description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      {framework.organization_level}
                    </Badge>
                    {framework.department && (
                      <Badge variant="outline">
                        {framework.department}
                      </Badge>
                    )}
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium">Competencies</p>
                    <p className="text-sm text-muted-foreground">
                      {framework.framework_competencies?.length || 0} defined
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Scope</p>
                    <p className="text-sm text-muted-foreground">
                      {framework.role_family || 'All roles'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <Badge className={framework.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {framework.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>

                {framework.framework_competencies && framework.framework_competencies.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Key Competencies</p>
                    <div className="flex flex-wrap gap-2">
                      {framework.framework_competencies.slice(0, 5).map((competency) => (
                        <Badge key={competency.id} variant="outline">
                          {competency.competency_name}
                          {competency.weight_percentage > 0 && (
                            <span className="ml-1 text-xs">({competency.weight_percentage}%)</span>
                          )}
                        </Badge>
                      ))}
                      {framework.framework_competencies.length > 5 && (
                        <Badge variant="outline">
                          +{framework.framework_competencies.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
