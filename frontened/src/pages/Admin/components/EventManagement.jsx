import React, { useState, useEffect } from 'react';
import { 
  Calendar,
  Plus,
  Filter,
  MapPin,
  Clock,
  Users,
  Edit3,
  Trash2,
  Eye,
  MoreVertical,
  X,
  Share2,
  Calendar as CalendarIcon,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const EventsManagement = ({ events = [], onDataUpdate, searchTerm = '' }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [filters, setFilters] = useState({
    eventType: 'all',
    status: 'all',
    date: ''
  });

  // API Base URL
  const API_BASE = 'http://localhost:3000';

  // New Event Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: 'academic',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    location: '',
    organizer: '',
    participants: 0,
    status: 'upcoming'
  });

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE}/api/events`);
      const data = await response.json();
      
      if (data.success) {
        // Data is already in state from parent, just update if needed
        if (onDataUpdate) {
          onDataUpdate();
        }
      } else {
        setError(data.error || 'Failed to fetch events');
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  // Filter events based on filters and search term
  const filteredEvents = React.useMemo(() => {
    let result = events;
    
    // Apply filters
    if (filters.eventType !== 'all') {
      result = result.filter(event => event.type === filters.eventType);
    }
    
    if (filters.status !== 'all') {
      result = result.filter(event => event.status === filters.status);
    }
    
    if (filters.date) {
      result = result.filter(event => event.date === filters.date);
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(event => 
        event.title?.toLowerCase().includes(term) ||
        event.description?.toLowerCase().includes(term) ||
        event.location?.toLowerCase().includes(term) ||
        event.organizer?.toLowerCase().includes(term)
      );
    }
    
    return result;
  }, [events, filters, searchTerm]);

  // Calculate statistics
  const statistics = React.useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const upcomingEvents = events.filter(event => 
      event.status === 'upcoming' || event.status === 'Upcoming'
    ).length;
    
    const totalParticipants = events.reduce((sum, event) => 
      sum + (parseInt(event.participants) || 0), 0
    );
    
    const eventsThisMonth = events.filter(event => {
      if (!event.date) return false;
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === currentMonth && 
             eventDate.getFullYear() === currentYear;
    }).length;

    const uniqueLocations = new Set(events.map(event => event.location)).size;

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
        label: 'Events This Month', 
        value: eventsThisMonth.toString(), 
        change: 'Active month', 
        trend: eventsThisMonth > 0 ? 'up' : 'down',
        icon: Clock,
        color: 'orange'
      }
    ];
  }, [events]);

  // Event type counts
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

  // Add new event
  const handleAddEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccessMessage('Event created successfully!');
        setShowAddEventModal(false);
        resetEventForm();
        
        if (onDataUpdate) {
          onDataUpdate();
        }
        
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(data.error || 'Failed to create event');
      }
    } catch (err) {
      console.error('Error creating event:', err);
      setError('Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update event
  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/api/events/${selectedEvent._id || selectedEvent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccessMessage('Event updated successfully!');
        setShowAddEventModal(false);
        setSelectedEvent(null);
        resetEventForm();
        
        if (onDataUpdate) {
          onDataUpdate();
        }
        
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(data.error || 'Failed to update event');
      }
    } catch (err) {
      console.error('Error updating event:', err);
      setError('Failed to update event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete event
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/api/events/${eventId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccessMessage('Event deleted successfully!');
        
        if (onDataUpdate) {
          onDataUpdate();
        }
        
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(data.error || 'Failed to delete event');
      }
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // View event details
  const handleViewEvent = (event) => {
    setShowEventDetails(event);
  };

  // Edit event
  const handleEditEvent = (event) => {
    setNewEvent({
      title: event.title || '',
      description: event.description || '',
      type: event.type || 'academic',
      date: event.date || new Date().toISOString().split('T')[0],
      time: event.time || '10:00',
      location: event.location || '',
      organizer: event.organizer || '',
      participants: event.participants || 0,
      status: event.status || 'upcoming'
    });
    setSelectedEvent(event);
    setShowAddEventModal(true);
  };

  // Share event
  const handleShareEvent = (event) => {
    const eventDetails = `
Event: ${event.title}
Date: ${event.date}
Time: ${event.time}
Location: ${event.location}
Description: ${event.description}
    `.trim();

    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: eventDetails,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(eventDetails);
      setSuccessMessage('Event details copied to clipboard!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  // Helper functions
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

  const resetEventForm = () => {
    setNewEvent({
      title: '',
      description: '',
      type: 'academic',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      location: '',
      organizer: '',
      participants: 0,
      status: 'upcoming'
    });
  };

  const getEventTypeColor = (type) => {
    const colors = {
      academic: 'blue',
      sports: 'green',
      cultural: 'purple',
      meeting: 'orange',
      workshop: 'red',
      other: 'gray'
    };
    return colors[type] || 'gray';
  };

  // Apply filters
  const handleApplyFilters = () => {
    setShowFilterModal(false);
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      eventType: 'all',
      status: 'all',
      date: ''
    });
    setShowFilterModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Events Management</h2>
          <p className="text-gray-600">Manage and track all school events and activities</p>
        </div>
        <div className="flex space-x-3 mt-4 lg:mt-0">
          <button 
            onClick={fetchEvents}
            disabled={loading}
            className="border border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-50 transition-colors flex items-center space-x-2 text-gray-700 disabled:opacity-50"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button 
            onClick={() => setShowFilterModal(true)}
            className="border border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-50 transition-colors flex items-center space-x-2 text-gray-700"
          >
            <Filter size={20} />
            <span>Filter</span>
          </button>
          <button 
            onClick={() => setShowAddEventModal(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 shadow-sm"
          >
            <Plus size={20} />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="text-green-500 mr-2" size={20} />
            <span className="text-green-700">{successMessage}</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="text-red-500 mr-2" size={20} />
            <span className="text-red-700">{error}</span>
          </div>
          <button 
            onClick={() => setError(null)}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Statistics */}
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
                'bg-orange-100'
              }`}>
                <stat.icon className={
                  stat.color === 'blue' ? 'text-blue-600' :
                  stat.color === 'green' ? 'text-green-600' :
                  stat.color === 'purple' ? 'text-purple-600' :
                  'text-orange-600'
                } size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200">
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
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users size={16} />
                              <span>{event.participants || 0} participants</span>
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
                          onClick={() => handleShareEvent(event)}
                          className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                          title="Share Event"
                        >
                          <Share2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteEvent(event._id || event.id)}
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

        {/* Sidebar */}
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
                <span className="text-sm text-gray-600">Data Updated</span>
                <span className="text-sm font-medium text-gray-800">
                  Just now
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedEvent ? 'Edit Event' : 'Create New Event'}
              </h3>
              <button 
                onClick={() => {
                  setShowAddEventModal(false);
                  setSelectedEvent(null);
                  resetEventForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={loading}
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={selectedEvent ? handleUpdateEvent : handleAddEvent} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newEvent.title}
                    onChange={(e) => setNewEvent(prev => ({...prev, title: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter event title"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type *
                  </label>
                  <select
                    required
                    value={newEvent.type}
                    onChange={(e) => setNewEvent(prev => ({...prev, type: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  >
                    <option value="academic">Academic</option>
                    <option value="sports">Sports</option>
                    <option value="cultural">Cultural</option>
                    <option value="meeting">Meeting</option>
                    <option value="workshop">Workshop</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(prev => ({...prev, description: e.target.value}))}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Event description..."
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    onChange={(e) => setNewEvent(prev => ({...prev, date: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={newEvent.time}
                    onChange={(e) => setNewEvent(prev => ({...prev, time: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={newEvent.location}
                    onChange={(e) => setNewEvent(prev => ({...prev, location: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Event location"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organizer *
                  </label>
                  <input
                    type="text"
                    required
                    value={newEvent.organizer}
                    onChange={(e) => setNewEvent(prev => ({...prev, organizer: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Organizer name/department"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Participants
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newEvent.participants}
                    onChange={(e) => setNewEvent(prev => ({...prev, participants: parseInt(e.target.value) || 0}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={newEvent.status}
                    onChange={(e) => setNewEvent(prev => ({...prev, status: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddEventModal(false);
                    setSelectedEvent(null);
                    resetEventForm();
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  disabled={loading}
                >
                  {loading && <RefreshCw size={16} className="animate-spin" />}
                  <span>{selectedEvent ? 'Update Event' : 'Create Event'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Filter Events</h3>
              <button 
                onClick={() => setShowFilterModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type
                </label>
                <select
                  value={filters.eventType}
                  onChange={(e) => setFilters(prev => ({...prev, eventType: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="academic">Academic</option>
                  <option value="sports">Sports</option>
                  <option value="cultural">Cultural</option>
                  <option value="meeting">Meeting</option>
                  <option value="workshop">Workshop</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => setFilters(prev => ({...prev, date: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleApplyFilters}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {showEventDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Event Details</h3>
              <button 
                onClick={() => setShowEventDetails(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="text-center">
                <div className="text-4xl mb-2">{showEventDetails.image || getEventEmoji(showEventDetails.type)}</div>
                <h4 className="text-xl font-bold text-gray-800">{showEventDetails.title}</h4>
                <span className={`px-3 py-1 text-sm rounded-full mt-2 inline-block ${
                  (showEventDetails.status === 'upcoming' || showEventDetails.status === 'Upcoming') 
                    ? 'bg-green-100 text-green-800' 
                    : showEventDetails.status === 'completed' || showEventDetails.status === 'Completed'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {showEventDetails.status}
                </span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Description</p>
                  <p className="text-gray-800">{showEventDetails.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Date</p>
                    <p className="text-gray-800">{showEventDetails.date}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Time</p>
                    <p className="text-gray-800">{showEventDetails.time}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Location</p>
                    <p className="text-gray-800">{showEventDetails.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Participants</p>
                    <p className="text-gray-800">{showEventDetails.participants || 0}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600">Organizer</p>
                  <p className="text-gray-800">{showEventDetails.organizer}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600">Event Type</p>
                  <span className={`px-2 py-1 text-xs rounded-full bg-${
                    getEventTypeColor(showEventDetails.type)
                  }-100 text-${getEventTypeColor(showEventDetails.type)}-800`}>
                    {showEventDetails.type}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowEventDetails(null)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleEditEvent(showEventDetails);
                    setShowEventDetails(null);
                  }}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Edit Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsManagement;