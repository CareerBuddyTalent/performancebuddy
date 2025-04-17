
import React from "react";
import { Switch } from "@/components/ui/switch";

export default function DataAccessControls() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Data Access Controls</h3>
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <h4 className="font-medium">Performance Reviews</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="manager-view-all" defaultChecked />
              <span>Managers can view all team reviews</span>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="manager-export" defaultChecked />
              <span>Managers can export team reviews</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Goals</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="employee-create-goals" defaultChecked />
              <span>Employees can create personal goals</span>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="approval-required" defaultChecked />
              <span>Goal approval required</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Analytics Data</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="employee-analytics" />
              <span>Employees can view personal analytics</span>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="sensitive-data" defaultChecked />
              <span>Hide sensitive data (salary, rankings)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
