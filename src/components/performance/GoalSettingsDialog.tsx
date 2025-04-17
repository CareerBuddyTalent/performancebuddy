
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface GoalSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GoalSettingsDialog({ open, onOpenChange }: GoalSettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Goal Settings</DialogTitle>
          <DialogDescription>
            Configure goal types, weights, and approval flows
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Goal Types</h3>
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-goals">Company Goals</Label>
                <Switch id="company-goals" defaultChecked />
                <p className="text-sm text-muted-foreground">Allow company-level goals</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="team-goals">Team Goals</Label>
                <Switch id="team-goals" defaultChecked />
                <p className="text-sm text-muted-foreground">Allow team-level goals</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="personal-goals">Personal Goals</Label>
                <Switch id="personal-goals" defaultChecked />
                <p className="text-sm text-muted-foreground">Allow personal development goals</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="okr-goals">OKR Format</Label>
                <Switch id="okr-goals" />
                <p className="text-sm text-muted-foreground">Use OKR format for goals</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Goal Weights</h3>
            <Separator />
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="default-weight">Default Goal Weight</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Select weight" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Weights</SelectLabel>
                      <SelectItem value="low">Low (10%)</SelectItem>
                      <SelectItem value="medium">Medium (20%)</SelectItem>
                      <SelectItem value="high">High (30%)</SelectItem>
                      <SelectItem value="critical">Critical (40%)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Default weight for new goals</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight-distribution">Weight Distribution</Label>
                <Select defaultValue="balanced">
                  <SelectTrigger>
                    <SelectValue placeholder="Select distribution" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Distribution Strategy</SelectLabel>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="company-first">Company First</SelectItem>
                      <SelectItem value="personal-first">Personal First</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">How weights are distributed across goal types</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Approval Flow</h3>
            <Separator />
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="approval-required">Approval Required</Label>
                <Switch id="approval-required" defaultChecked />
                <p className="text-sm text-muted-foreground">Goals require manager approval</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="approval-levels">Approval Levels</Label>
                <Select defaultValue="manager">
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Approval Levels</SelectLabel>
                      <SelectItem value="manager">Manager Only</SelectItem>
                      <SelectItem value="department">Department Head</SelectItem>
                      <SelectItem value="exec">Executive Team</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Who needs to approve goals</p>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => onOpenChange(false)}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
