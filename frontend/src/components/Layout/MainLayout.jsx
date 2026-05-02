import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900">
      <Sidebar />
      <Header />
      {/* Main Content - with margin-left to accommodate sidebar */}
      <main className="ml-72 mt-16 p-6 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
