
import React from 'react';
import { Link } from "react-router-dom";

export default function SidebarLogo() {
  return (
    <div className="p-4 pb-0">
      <Link to="/" className="flex items-center mb-6">
        <div className="h-10 w-10 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
          R
        </div>
      </Link>
    </div>
  );
}
