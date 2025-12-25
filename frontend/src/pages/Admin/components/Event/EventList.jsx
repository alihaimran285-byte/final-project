import React from 'react';
import { Calendar, Clock, MapPin, Users, Eye, Edit3, Bell, Share2, Trash2, Plus, RefreshCw } from 'lucide-react';

const EventList = ({ 
  filteredEvents, 
  loading, 
  searchTerm, 
  filters, 
  handleViewEvent, 
  handleEditEvent, 
  handleSetReminder, 
  handleShareEvent, 
  showDeleteConfirmation,
  getEventTypeColor
}) => {
  
  const getEventEmoji = (type) => {
    const emojis = {
      academic: '📚',
      sports: '⚽',
      cultural: '🎭',
      meeting: '👥',
      workshop: '🔧',
      other: '📅'
    };
    return emojis[type] || '📅';
  };

  return (
    <div className="lg:col-span-2">
      <div className="bg-orange-200 rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">School Events</h3>
            <p className="text-sm text-gray-600">
              {loading ? 'Loading...' : `${filteredEvents.length} events found`}
            </p>
          </div>
          {searchTerm && (
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              Search: "{searchTerm}"
            </span>
          )}
        </div>
        
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="mx-auto text-blue-500 mb-4 animate-spin" size={32} />
            <p className="text-gray-600">Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No events found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || Object.values(filters).some(f => f !== 'all' && f !== '') 
                ? 'Try adjusting your filters or search term' 
                : 'Create your first event to get started'}
            </p>
            <button 
              onClick={() => setShowAddEventModal(true)}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              <Plus size={20} className="inline mr-2" />
              Create First Event
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredEvents.map((event) => (
              <div key={event._id || event.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{event.image || getEventEmoji(event.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-800">{event.title}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          (event.status === 'upcoming' || event.status === 'Upcoming') 
                            ? 'bg-green-100 text-green-800' 
                            : event.status === 'completed' || event.status === 'Completed'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar size={16} />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock size={16} />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin size={16} />
                          <span>{event.venue || event.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users size={16} />
                          <span>{event.targetAudience || event.participants || 0} participants</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleViewEvent(event)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      onClick={() => handleEditEvent(event)}
                      className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                      title="Edit Event"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => handleSetReminder(event)}
                      className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors"
                      title="Set Reminder"
                    >
                      <Bell size={16} />
                    </button>
                    <button 
                      onClick={() => handleShareEvent(event)}
                      className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                      title="Share Event"
                    >
                      <Share2 size={16} />
                    </button>
                    <button 
                      onClick={() => showDeleteConfirmation(event._id || event.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      title="Delete Event"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center space-x-2">
                    <span>Organized by: {event.organizer}</span>
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full bg-${
                    getEventTypeColor(event.type)
                  }-100 text-${getEventTypeColor(event.type)}-800`}>
                    {event.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList;