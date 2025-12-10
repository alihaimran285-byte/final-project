
import React from 'react';
import { 
  Home,
  Users, 
  BookOpen, 
  BarChart3, 
  Settings,
  UserPlus,
  Calendar,
  ClipboardList,
  GraduationCap,
  LogOut,
  FileText
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'students', icon: Users, label: 'Students' },
    { id: 'teachers', icon: UserPlus, label: 'Teachers' },
    { id: 'classes', icon: BookOpen, label: 'Classes' },
    { id: 'assignments', icon: FileText, label: 'Assignments' },
    { id: 'attendance', icon: Calendar, label: 'Attendance' },
    { id: 'event', icon: BarChart3, label: 'Event' },
    { id: 'viewapplication', icon: ClipboardList, label: 'View Applications' },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('adminDashboardData');
    localStorage.removeItem('candidateDashboardData');
    window.location.href = '/login';
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:relative inset-y-0 right-0 z-50 w-64 bg-gradient-to-b from-orange-500 to-orange-600 shadow-lg transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      }`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-orange-400 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-400 rounded-lg flex items-center justify-center">
                  <GraduationCap className="text-white" size={20} />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Panda School</h1>
                <p className="text-xs text-orange-100">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === item.id
                        ? 'bg-white text-orange-600 shadow-lg transform scale-105'
                        : 'text-orange-100 hover:bg-orange-400 hover:text-white'
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Admin Info and Logout */}
          <div className="p-4 border-t border-orange-400 flex-shrink-0 space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="https://ui-avatars.com/api/?name=Admin+User&background=ffffff&color=ff6b35"
                alt="Admin"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <div>
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-orange-100">Administrator</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-orange-100 hover:bg-orange-400 hover:text-white transition-all border border-orange-400 hover:border-orange-300"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;