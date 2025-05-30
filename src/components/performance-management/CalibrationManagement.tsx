
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar, Users, Settings } from 'lucide-react';
import { usePerformanceManagement } from '@/hooks/usePerformanceManagement';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { toast } from '@/hooks/use-toast';

export function CalibrationManagement() {
  const { user } = useSupabaseAuth();
  const { calibrationSessions, createCalibrationSession, loading } = usePerformanceManagement();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newSession, setNewSession] = useState({
    name: '',
    description: '',
    department: '',
    session_date: '',
    forced_ranking_enabled: false
  });

  const handleCreateSession = async () => {
    if (!user || !newSession.name || !newSession.session_date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      await createCalibrationSession({
        name: newSession.name,
        description: newSession.description,
        department: newSession.department || null,
        session_date: new Date(newSession.session_date),
        forced_ranking_enabled: newSession.forced_ranking_enabled,
        status: 'scheduled'
      });

      toast({
        title: "Success",
        description: "Calibration session created successfully"
      });

      setIsCreateOpen(false);
      setNewSession({
        name: '',
        description: '',
        department: '',
        session_date: '',
        forced_ranking_enabled: false
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create calibration session",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Calibration Management</h2>
          <p className="text-muted-foreground">
            Manage performance calibration sessions and ensure consistent rating standards
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Session
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create Calibration Session</DialogTitle>
              <DialogDescription>
                Set up a new performance calibration session for your team or department.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Session Name *</Label>
                <Input
                  id="name"
                  value={newSession.name}
                  onChange={(e) => setNewSession({ ...newSession, name: e.target.value })}
                  placeholder="Q4 Performance Calibration"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newSession.description}
                  onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                  placeholder="Quarterly performance calibration for the engineering team"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={newSession.department}
                  onChange={(e) => setNewSession({ ...newSession, department: e.target.value })}
                  placeholder="Engineering"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="session_date">Session Date *</Label>
                <Input
                  id="session_date"
                  type="datetime-local"
                  value={newSession.session_date}
                  onChange={(e) => setNewSession({ ...newSession, session_date: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateSession} disabled={loading}>
                Create Session
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {calibrationSessions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Calibration Sessions</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first calibration session to start managing performance standards across your team.
              </p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Session
              </Button>
            </CardContent>
          </Card>
        ) : (
          calibrationSessions.map((session) => (
            <Card key={session.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{session.name}</CardTitle>
                    <CardDescription>
                      {session.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(session.status)}>
                      {session.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-muted-foreground">Date</p>
                    <p>{new Date(session.session_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Department</p>
                    <p>{session.department || 'All Departments'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Participants</p>
                    <p>{session.calibration_participants?.length || 0}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Manager</p>
                    <p>{session.manager_id}</p>
                  </div>
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Participants
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
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
