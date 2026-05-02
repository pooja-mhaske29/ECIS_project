import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, LogOut, AlertTriangle, Map, BarChart3, FileText } from 'lucide-react';
import { useClickOutside, useAuth } from '@/hooks';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { logout } = useAuth();
  const sidebarRef = useClickOutside(() => setSidebarOpen(false));

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3 },
    { path: '/detection', label: 'Detection', icon: AlertTriangle },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/hotspots', label: 'Hotspots', icon: Map },
  ];

  return (
    <div className="flex h-screen bg-dark-900">
      {/* Sidebar */}
      <motion.div
        ref={sidebarRef}
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-full w-64 bg-dark-800 border-r border-neon-green/20 shadow-lg z-40 lg:relative lg:translate-x-0"
      >
        {/* Logo */}
        <div className="p-6 border-b border-neon-green/20">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-gradient-neon rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-dark-900" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-neon-green">ECIS</h1>
              <p className="text-xs text-gray-400">Crime Detection</p>
            </div>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="p-6 space-y-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileHover={{ x: 5 }}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-neon text-dark-900 shadow-neon-green'
                      : 'text-gray-300 hover:text-neon-green hover:bg-dark-700/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-6 left-0 right-0 px-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-900/50 transition-all duration-300"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-dark-800/50 backdrop-blur-lg border-b border-neon-cyan/10 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-neon-green hover:text-neon-cyan transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
            <h2 className="text-xl font-bold text-neon-green">
              {navItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="text-sm text-gray-400">
            {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
        />
      )}
    </div>
  );
}
