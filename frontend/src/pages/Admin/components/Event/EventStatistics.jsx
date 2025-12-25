import React from 'react';
import { Calendar as CalendarIcon, Users, Bell } from 'lucide-react';

const EventStatistics = ({ events, unreadCount, notifications }) => {
  const statistics = React.useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const upcomingEvents = events.filter(event => 
      event.status === 'upcoming' || event.status === 'Upcoming'
    ).length;
    
    const totalParticipants = events.reduce((sum, event) => 
      sum + (parseInt(event.targetAudience || event.participants) || 0), 0
    );
    
    const eventsThisMonth = events.filter(event => {
      if (!event.date) return false;
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === currentMonth && 
             eventDate.getFullYear() === currentYear;
    }).length;

    return [
      { 
        label: 'Total Events', 
        value: events.length.toString(), 
        change: `${events.length} total`, 
        trend: 'up',
        icon: CalendarIcon,
        color: 'blue'
      },
      { 
        label: 'Upcoming Events', 
        value: upcomingEvents.toString(), 
        change: `${upcomingEvents} scheduled`, 
        trend: upcomingEvents > 0 ? 'up' : 'down',
        icon: CalendarIcon,
        color: 'green'
      },
      { 
        label: 'Total Participants', 
        value: `${totalParticipants}+`, 
        change: `${totalParticipants} total attendees`, 
        trend: 'up',
        icon: Users,
        color: 'purple'
      },
      { 
        label: 'Notifications', 
        value: unreadCount.toString(), 
        change: `${notifications.length} total`, 
        trend: unreadCount > 0 ? 'up' : 'down',
        icon: Bell,
        color: unreadCount > 0 ? 'red' : 'gray'
      }
    ];
  }, [events, unreadCount, notifications.length]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statistics.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className={`text-sm mt-1 ${
                stat.trend === 'up' ? 'text-green-600' : 
                stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {stat.change}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${
              stat.color === 'blue' ? 'bg-blue-100' :
              stat.color === 'green' ? 'bg-green-100' :
              stat.color === 'purple' ? 'bg-purple-100' :
              stat.color === 'red' ? 'bg-red-100' :
              'bg-gray-100'
            }`}>
              <stat.icon className={
                stat.color === 'blue' ? 'text-blue-600' :
                stat.color === 'green' ? 'text-green-600' :
                stat.color === 'purple' ? 'text-purple-600' :
                stat.color === 'red' ? 'text-red-600' :
                'text-gray-600'
              } size={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventStatistics;