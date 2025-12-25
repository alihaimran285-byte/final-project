import React from 'react';
import { Calendar, Users, MapPin, Clock } from 'lucide-react';

const Activities = () => {
  const activities = [
    {
      id: 1,
      title: "Annual Sports Day",
      description: "A day filled with exciting sports competitions and team activities",
      date: "2024-12-15",
      time: "9:00 AM - 4:00 PM",
      location: "School Ground",
      participants: 250,
      type: "sports",
      image: "🏆",
      status: "upcoming"
    },
    {
      id: 2,
      title: "Science Fair Exhibition",
      description: "Showcase of student science projects and innovations",
      date: "2024-12-10",
      time: "10:00 AM - 2:00 PM",
      location: "Science Lab",
      participants: 180,
      type: "academic",
      image: "🔬",
      status: "upcoming"
    },
    {
      id: 3,
      title: "Art & Craft Workshop",
      description: "Creative workshop for painting, pottery and craft activities",
      date: "2024-11-28",
      time: "2:00 PM - 5:00 PM",
      location: "Art Room",
      participants: 60,
      type: "creative",
      image: "🎨",
      status: "completed"
    },
    {
      id: 4,
      title: "Music Concert",
      description: "Annual music concert featuring student performances",
      date: "2024-11-20",
      time: "6:00 PM - 9:00 PM",
      location: "Auditorium",
      participants: 150,
      type: "cultural",
      image: "🎵",
      status: "completed"
    }
  ];

  const activityTypes = [
    { type: "sports", name: "Sports", color: "from-green-500 to-green-400", icon: "⚽" },
    { type: "academic", name: "Academic", color: "from-blue-500 to-blue-400", icon: "📚" },
    { type: "creative", name: "Creative", color: "from-purple-500 to-purple-400", icon: "🎨" },
    { type: "cultural", name: "Cultural", color: "from-pink-500 to-pink-400", icon: "🎭" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-peach-50 py-8 px-4 mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-900 mb-4">
            School Activities
          </h1>
          <p className="text-lg text-orange-700 max-w-2xl mx-auto">
            Engaging activities and events that make learning fun and help students 
            develop new skills and friendships.
          </p>
        </div>

        {/* Activity Types */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {activityTypes.map((activityType) => (
            <div 
              key={activityType.type}
              className={`bg-gradient-to-r ${activityType.color} rounded-xl p-4 text-white text-center shadow-lg`}
            >
              <div className="text-3xl mb-2">{activityType.icon}</div>
              <div className="font-semibold">{activityType.name}</div>
            </div>
          ))}
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activities.map((activity) => (
            <div 
              key={activity.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-orange-200 overflow-hidden"
            >
              {/* Activity Header */}
              <div className="bg-gradient-to-r from-orange-400 to-peach-400 p-6">
                <div className="flex items-center justify-between">
                  <div className="text-4xl">{activity.image}</div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    activity.status === 'upcoming' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {activity.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mt-2">
                  {activity.title}
                </h3>
              </div>
              
              {/* Activity Details */}
              <div className="p-6">
                <p className="text-orange-700 mb-4">
                  {activity.description}
                </p>
                
                {/* Activity Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-orange-600">
                    <Calendar size={16} className="mr-2" />
                    <span>{new Date(activity.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-orange-600">
                    <Clock size={16} className="mr-2" />
                    <span>{activity.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-orange-600">
                    <MapPin size={16} className="mr-2" />
                    <span>{activity.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-orange-600">
                    <Users size={16} className="mr-2" />
                    <span>{activity.participants} Participants</span>
                  </div>
                </div>

                {/* Action Button */}
                <button className={`w-full py-2 rounded-lg font-medium ${
                  activity.status === 'upcoming'
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                } transition-colors`}>
                  {activity.status === 'upcoming' ? 'Register Now' : 'Event Completed'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Highlights */}
        <div className="mt-16 bg-white rounded-2xl p-8 border border-orange-200">
          <h2 className="text-2xl font-bold text-orange-900 text-center mb-6">
            Upcoming Highlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="text-4xl mb-2">🎄</div>
              <h3 className="font-semibold text-orange-900 mb-2">Winter Festival</h3>
              <p className="text-orange-700 text-sm">December 20, 2024</p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-2">📖</div>
              <h3 className="font-semibold text-orange-900 mb-2">Book Fair</h3>
              <p className="text-orange-700 text-sm">January 15, 2025</p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-2">🌍</div>
              <h3 className="font-semibold text-orange-900 mb-2">Science Olympiad</h3>
              <p className="text-orange-700 text-sm">February 10, 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activities;