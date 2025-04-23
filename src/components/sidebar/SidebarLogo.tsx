
import React from 'react';
import { Link } from "react-router-dom";

export default function SidebarLogo() {
  return (
    <div className="p-4 pb-0">
      <Link to="/" className="flex items-center mb-6">
        <img 
          src="/lovable-uploads/5f7f5cab-6e48-4d4e-b4a2-edee8cc1cbc4.png" 
          alt="CareerBuddy" 
          className="h-8"
        />
      </Link>
    </div>
  );
}
