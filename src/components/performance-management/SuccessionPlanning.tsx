
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, AlertTriangle, TrendingUp, Shield, Plus } from 'lucide-react';
import { usePerformanceManagement } from '@/hooks/usePerformanceManagement';

export function SuccessionPlanning() {
  const { successionPlans, loading } = usePerformanceManagement();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCriticalityColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReadinessColor = (level: string) => {
    switch (level) {
      case 'not_ready': return 'bg-red-100 text-red-800';
      case 'emerging': return 'bg-yellow-100 text-yellow-800';
      case 'ready_now': return 'bg-green-100 text-green-800';
      case 'ready_plus': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const criticalRoles = successionPlans.filter(p => p.succession_coverage < 2 && p.business_criticality === 'critical').length;
  const totalCoverage = successionPlans.length > 0 
    ? successionPlans.reduce((acc, p) => acc + p.succession_coverage, 0) / successionPlans.length 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Succession Planning</h2>
          <p className="text-muted-foreground">
            Identify and develop talent pipelines for critical roles
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Position
        </Button>
      </div>

      {/* Planning Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Positions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successionPlans.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Gaps</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalRoles}</div>
            <p className="text-xs text-muted-foreground">
              Critical roles with insufficient coverage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Coverage</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCoverage.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Successors per position
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready Candidates</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {successionPlans.reduce((acc, p) => 
                acc + (p.succession_candidates?.filter(c => c.readiness_level === 'ready_now' || c.readiness_level === 'ready_plus').length || 0), 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Candidates ready for promotion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Succession Plans List */}
      <div className="space-y-4">
        {successionPlans.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No succession plans yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Start building your talent pipeline by creating succession plans for key positions.
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Position
              </Button>
            </CardContent>
          </Card>
        ) : (
          successionPlans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{plan.position_title}</CardTitle>
                    <CardDescription>
                      {plan.department && `${plan.department} • `}
                      Current: {plan.current_incumbent || 'Vacant'}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getCriticalityColor(plan.business_criticality)}>
                      {plan.business_criticality} criticality
                    </Badge>
                    <Badge className={getRiskColor(plan.risk_level)}>
                      {plan.risk_level} risk
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Succession Coverage</p>
                      <p className="text-sm text-muted-foreground">
                        {plan.succession_coverage} candidate{plan.succession_coverage !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {plan.succession_coverage < 1 ? '🔴' : plan.succession_coverage < 2 ? '🟡' : '🟢'}
                      </div>
                    </div>
                  </div>

                  {plan.succession_candidates && plan.succession_candidates.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Candidates</p>
                      <div className="space-y-2">
                        {plan.succession_candidates.slice(0, 3).map((candidate) => (
                          <div key={candidate.id} className="flex items-center justify-between p-2 bg-muted rounded">
                            <div>
                              <p className="text-sm font-medium">Candidate {candidate.candidate_id}</p>
                              <p className="text-xs text-muted-foreground">
                                {candidate.readiness_timeline || 'Timeline TBD'}
                              </p>
                            </div>
                            <Badge className={getReadinessColor(candidate.readiness_level)} variant="outline">
                              {candidate.readiness_level.replace('_', ' ')}
                            </Badge>
                          </div>
                        ))}
                        {plan.succession_candidates.length > 3 && (
                          <p className="text-xs text-muted-foreground">
                            +{plan.succession_candidates.length - 3} more candidates
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
