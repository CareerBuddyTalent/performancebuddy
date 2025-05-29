
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { usePerformanceManagement } from '@/hooks/usePerformanceManagement';
import { toast } from 'sonner';

interface CreateCalibrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCalibrationDialog({ open, onOpenChange }: CreateCalibrationDialogProps) {
  const { createCalibrationSession } = usePerformanceManagement();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    department: '',
    session_date: new Date(),
    forced_ranking_enabled: false,
    bell_curve_settings: {}
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Session name is required');
      return;
    }

    setLoading(true);
    try {
      const result = await createCalibrationSession({
        name: formData.name,
        description: formData.description || undefined,
        department: formData.department || undefined,
        session_date: formData.session_date,
        forced_ranking_enabled: formData.forced_ranking_enabled,
        bell_curve_settings: formData.bell_curve_settings,
        status: 'scheduled'
      });

      if (result) {
        toast.success('Calibration session created successfully');
        onOpenChange(false);
        setFormData({
          name: '',
          description: '',
          department: '',
          session_date: new Date(),
          forced_ranking_enabled: false,
          bell_curve_settings: {}
        });
      }
    } catch (error) {
      toast.error('Failed to create calibration session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Calibration Session</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Session Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Q1 2024 Engineering Calibration"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the calibration session objectives"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Session Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(formData.session_date, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.session_date}
                  onSelect={(date) => date && setFormData({ ...formData, session_date: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="forced-ranking"
              checked={formData.forced_ranking_enabled}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, forced_ranking_enabled: checked })
              }
            />
            <Label htmlFor="forced-ranking" className="text-sm">
              Enable forced ranking distribution
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Session'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
