
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Users, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { usePerformanceManagement } from '@/hooks/usePerformanceManagement';

export function SuccessionPlanning() {
  const { successionPlans } = usePerformanceManagement();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Succession Planning</h2>
          <p className="text-muted-foreground">
            Identify and develop future leaders for critical business roles
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Succession Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create Succession Plan</DialogTitle>
              <DialogDescription>
                Define a succession plan for a critical business role.
              </DialogDescription>
            </DialogHeader>
            {/* Form content will be added here */}
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successionPlans.length}</div>
            <p className="text-xs text-muted-foreground">Active succession plans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {successionPlans.filter(p => p.risk_level === 'high').length}
            </div>
            <p className="text-xs text-muted-foreground">Positions at risk</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready Now</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {successionPlans.filter(p => 
                p.succession_candidates?.some(c => c.readiness_level === 'ready_now')
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">Positions with ready successors</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {successionPlans.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Succession Plans</h3>
              <p className="text-muted-foreground text-center mb-4">
                Start building succession plans to ensure business continuity and identify future leaders.
              </p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Plan
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
                      {plan.current_incumbent && `Current: ${plan.current_incumbent}`}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getRiskColor(plan.risk_level)}>
                      {plan.risk_level} risk
                    </Badge>
                    <span className={`text-sm font-medium ${getCriticalityColor(plan.business_criticality)}`}>
                      {plan.business_criticality} criticality
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <p className="font-medium text-muted-foreground">Coverage</p>
                    <p>{plan.succession_coverage} candidates</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Ready Now</p>
                    <p>
                      {plan.succession_candidates?.filter(c => c.readiness_level === 'ready_now').length || 0}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Emerging</p>
                    <p>
                      {plan.succession_candidates?.filter(c => c.readiness_level === 'emerging').length || 0}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Development</p>
                    <p>
                      {plan.succession_candidates?.filter(c => c.readiness_level === 'not_ready').length || 0}
                    </p>
                  </div>
                </div>
                
                {plan.succession_candidates && plan.succession_candidates.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-medium text-sm">Succession Candidates:</p>
                    <div className="grid gap-2">
                      {plan.succession_candidates.map((candidate) => (
                        <div key={candidate.id} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm">{candidate.candidate_id}</span>
                          <Badge variant="outline" className="text-xs">
                            {candidate.readiness_level?.replace('_', ' ')}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end mt-4 space-x-2">
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Candidates
                  </Button>
                  <Button variant="outline" size="sm">
                    View Details
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
