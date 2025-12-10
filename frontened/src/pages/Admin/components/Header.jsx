import React, { useState } from 'react';
import { Menu, Bell, Search } from 'lucide-react';

const Header = ({ setSidebarOpen, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-orange-100 flex-shrink-0">
      <div className="flex items-center justify-between p-4 lg:px-6">
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors"
          >
            <Menu size={20} />
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-orange-800">Welcome back, Admin!</h1>
            <p className="text-orange-600 text-sm">Here's what's happening today</p>
          </div>
        </div>

      
        <div className="flex items-center space-x-4">
          <div className="relative hidden lg:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-orange-400" />
            </div>
            <input
              type="text"
              placeholder="Search students, teachers, events..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 w-64 border border-orange-200 rounded-lg bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-colors"
            />
          </div>
          
          <button className="relative p-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;