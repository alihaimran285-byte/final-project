import React from 'react';
import { Bell } from 'lucide-react';

const EventSidebar = ({ 
  events, 
  notifications, 
  unreadCount, 
  setShowNotifications, 
  filters, 
  formatTime, 
  getNotificationIcon, 
  getNotificationColor 
}) => {
  
  const eventTypeCounts = React.useMemo(() => {
    const counts = {
      academic: 0,
      sports: 0,
      cultural: 0,
      meeting: 0,
      workshop: 0,
      other: 0
    };

    events.forEach(event => {
      if (counts.hasOwnProperty(event.type)) {
        counts[event.type]++;
      }
    });

    return [
      { label: 'Academic Events', type: 'academic', count: counts.academic },
      { label: 'Sports Events', type: 'sports', count: counts.sports },
      { label: 'Cultural Events', type: 'cultural', count: counts.cultural },
      { label: 'Meetings', type: 'meeting', count: counts.meeting },
      { label: 'Workshops', type: 'workshop', count: counts.workshop || 0 }
    ];
  }, [events]);

  return (
    <div className="space-y-6">
      {/* Event Types */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Event Types</h3>
        <div className="space-y-3">
          {eventTypeCounts.map((item) => (
            <div key={item.type} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
              <span className="font-medium text-gray-800">{item.label}</span>
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="space-y-3">
          {notifications.slice(0, 3).map((notification) => (
            <div 
              key={notification.id} 
              className={`p-3 rounded-lg border ${!notification.read ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}
            >
              <div className="flex items-start space-x-2">
                <div className="pt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 mb-1">
                    {notification.title}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTime(notification.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {notifications.length === 0 && (
            <div className="text-center py-4">
              <Bell className="mx-auto text-gray-300 mb-2" size={24} />
              <p className="text-sm text-gray-600">No notifications yet</p>
            </div>
          )}
          
          {notifications.length > 3 && (
            <button
              onClick={() => setShowNotifications(true)}
              className="w-full text-center text-sm text-blue-500 hover:text-blue-700 pt-2"
            >
              View all notifications
            </button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Active Filters</span>
            <span className="text-sm font-medium text-gray-800">
              {Object.values(filters).filter(f => f !== 'all' && f !== '').length}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Today's Date</span>
            <span className="text-sm font-medium text-gray-800">
              {new Date().toISOString().split('T')[0]}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Notifications</span>
            <span className="text-sm font-medium text-gray-800">
              {notifications.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventSidebar;