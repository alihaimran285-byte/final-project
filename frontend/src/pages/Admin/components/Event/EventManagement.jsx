
import React, { useState, useEffect, useRef } from 'react';
import { Plus, RefreshCw, Filter, Bell, BellRing, CheckCircle, AlertCircle, X, Edit3, Trash2, Calendar } from 'lucide-react';
import Notification from '../../../Notification';
import EventStatistics from './EventStatistics';
import EventList from './EventList';
import EventSidebar from './EventSidebar';
import EventModals from './EventModels';
import FilterModal from './FilterModel';

const EventsManagement = ({ events = [], onDataUpdate, searchTerm = '' }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [notification, setNotification] = useState({ 
    message: '', 
    type: 'success', 
    visible: false 
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationSoundRef = useRef(null);
  
  const [filters, setFilters] = useState({
    eventType: 'all',
    status: 'all',
    date: ''
  });
const API_BASE = 'http://localhost:3000';
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
const showNotification = (message, type = 'success') => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, 4000);
  };
const [mappedEvents, setMappedEvents] = useState([]);
const mapEventType = (backendType) => {
    const typeMap = {
      'academics': 'academic',
      'academic': 'academic',
      'cultural': 'cultural',
      'sports': 'sports',
      'meeting': 'meeting',
      'workshop': 'workshop',
      'other': 'other',
      'Academic': 'academic',
      'Cultural': 'cultural',
      'Sports': 'sports',
      'Meeting': 'meeting',
      'Workshop': 'workshop',
      'Other': 'other'
    };
    
    if (backendType && typeMap[backendType]) {
      return typeMap[backendType];
    }
    const lowerType = backendType?.toLowerCase();
    if (lowerType && typeMap[lowerType]) {
      return typeMap[lowerType];
    }
    
    return backendType || 'academic';
  };

  const mapEventStatus = (backendStatus) => {
    const statusMap = {
      'upcoming': 'upcoming',
      'ongoing': 'ongoing',
      'completed': 'completed',
      'cancelled': 'cancelled',
      'Upcoming': 'upcoming',
      'Ongoing': 'ongoing',
      'Completed': 'completed',
      'Cancelled': 'cancelled'
    };
    
    if (backendStatus && statusMap[backendStatus]) {
      return statusMap[backendStatus];
    }
    
    return backendStatus || 'upcoming';
  };

  useEffect(() => {
    if (events && events.length > 0) {
      const formattedEvents = events.map(event => ({
        ...event,
        
        location: event.venue || event.location || '',
    
        participants: parseInt(event.targetAudience || event.participants) || 0,
        type: mapEventType(event.type) || 'academic',
        status: mapEventStatus(event.status) || 'upcoming',
        originalType: event.type,
        originalStatus: event.status
      }));
      setMappedEvents(formattedEvents);
      formattedEvents.forEach((event, index) => {
        console.log(`Event ${index + 1}:`, {
          title: event.title,
          backendType: event.originalType,
          mappedType: event.type,
          backendStatus: event.originalStatus,
          mappedStatus: event.status
        });
      });
    } else {
      setMappedEvents([]);
    }
  }, [events]);
  useEffect(() => {
    const savedNotifications = JSON.parse(localStorage.getItem('eventNotifications')) || [];
    setNotifications(savedNotifications);
    
    const unread = savedNotifications.filter(n => !n.read).length;
    setUnreadCount(unread);
    checkUpcomingEvents();
    notificationSoundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/286/286-preview.mp3');
    return () => {
      if (notificationSoundRef.current) {
        notificationSoundRef.current.pause();
        notificationSoundRef.current = null;
      }
    };
  }, [mappedEvents]);
  const checkUpcomingEvents = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const upcomingEvents = mappedEvents.filter(event => {
      if (!event.date) return false;
      const eventDate = new Date(event.date);
      return eventDate >= today && eventDate <= tomorrow && 
             (event.status === 'upcoming' || event.status === 'Upcoming');
    });
    upcomingEvents.forEach(event => {
      addNotification({
        type: 'upcoming',
        title: 'Upcoming Event',
        message: `${event.title} is scheduled for tomorrow`,
        eventId: event._id || event.id,
        timestamp: new Date()
      });
    });
  };
  const addNotification = (notification) => {
    const existing = notifications.find(n => 
      n.type === notification.type && 
      n.eventId === notification.eventId
    );
    
    if (!existing) {
      const newNotification = {
        ...notification,
        id: Date.now(),
        read: false
      };
      
      const updatedNotifications = [newNotification, ...notifications];
      setNotifications(updatedNotifications);
      setUnreadCount(prev => prev + 1);
      localStorage.setItem('eventNotifications', JSON.stringify(updatedNotifications));
      if (notificationSoundRef.current) {
        notificationSoundRef.current.play().catch(console.error);
      }
    }
  }
  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    
    setNotifications(updatedNotifications);
    setUnreadCount(prev => Math.max(0, prev - 1));
    localStorage.setItem('eventNotifications', JSON.stringify(updatedNotifications));
  };
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    
    setNotifications(updatedNotifications);
    setUnreadCount(0);
    localStorage.setItem('eventNotifications', JSON.stringify(updatedNotifications));
  };
  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem('eventNotifications');
  };
  const deleteNotification = (id) => {
    const updatedNotifications = notifications.filter(n => n.id !== id);
    setNotifications(updatedNotifications);
    
    const unread = updatedNotifications.filter(n => !n.read).length;
    setUnreadCount(unread);
    localStorage.setItem('eventNotifications', JSON.stringify(updatedNotifications));
  };
  const filteredEvents = React.useMemo(() => {
    let result = mappedEvents;
    if (filters.eventType !== 'all') {
      result = result.filter(event => {
        const eventType = mapEventType(event.type);
        return eventType === filters.eventType;
      });
    }
    
    if (filters.status !== 'all') {
      result = result.filter(event => {
        const eventStatus = mapEventStatus(event.status);
        return eventStatus === filters.status;
      });
    }
    
    if (filters.date) {
      result = result.filter(event => event.date === filters.date);
    }
if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(event => 
        event.title?.toLowerCase().includes(term) ||
        event.description?.toLowerCase().includes(term) ||
        (event.venue || event.location)?.toLowerCase().includes(term) ||
        event.organizer?.toLowerCase().includes(term)
      );
    }
     return result;
  }, [mappedEvents, filters, searchTerm]);
  const handleAddEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const eventData = {
        title: newEvent.title,
        description: newEvent.description,
        date: newEvent.date,
        time: newEvent.time,
        venue: newEvent.location,
        organizer: newEvent.organizer,
        targetAudience: newEvent.participants.toString(),
        className: 'all',
        type: newEvent.type,
        status: newEvent.status
      };
      ;
      
      const response = await fetch(`${API_BASE}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        showNotification("Event created successfully!", "success");
addNotification({
          type: 'created',
          title: 'Event Created',
          message: `New event "${newEvent.title}" has been created`,
          eventId: data.data?._id,
          timestamp: new Date()
        });
        
        setSuccessMessage(''); 
        setShowAddEventModal(false);
        resetEventForm();
        
        if (onDataUpdate) onDataUpdate();
      } else {
        showNotification(data.error || 'Failed to create event', "error");
        setError(null); 
      }
    } catch (err) {
      console.error('Error creating event:', err);
      showNotification('Failed to create event. Please try again.', "error");
      setError(null); 
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const eventData = {
        title: newEvent.title,
        description: newEvent.description,
        date: newEvent.date,
        time: newEvent.time,
        venue: newEvent.location,
        organizer: newEvent.organizer,
        targetAudience: newEvent.participants.toString(),
        className: 'all',
        type: newEvent.type,
        status: newEvent.status
      };
      
      console.log('🔍 DEBUG - Updating Event Data:', eventData);
      
      const response = await fetch(`${API_BASE}/api/events/${selectedEvent._id || selectedEvent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
      
      const data = await response.json();
      
      console.log('🔍 DEBUG - Update Response:', data);
      
      if (data.success) {

        showNotification("Event updated successfully!", "success");
        addNotification({
          type: 'updated',
          title: 'Event Updated',
          message: `Event "${newEvent.title}" has been updated`,
          eventId: selectedEvent._id || selectedEvent.id,
          timestamp: new Date()
        });
        
        setSuccessMessage('');
        setShowAddEventModal(false);
        setSelectedEvent(null);
        resetEventForm();
        
        if (onDataUpdate) onDataUpdate();
      } else {
        showNotification(data.error || 'Failed to update event', "error");
        setError(null); 
      }
    } catch (err) {
      console.error('Error updating event:', err);
      showNotification('Failed to update event. Please try again.', "error");
      setError(null); 
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/api/events/${eventToDelete}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        showNotification("Event deleted successfully!", "success");
        
        const deletedEvent = mappedEvents.find(e => (e._id || e.id) === eventToDelete);
        if (deletedEvent) {
          addNotification({
            type: 'deleted',
            title: 'Event Deleted',
            message: `Event "${deletedEvent.title}" has been deleted`,
            timestamp: new Date()
          });
        }
        
        setSuccessMessage(''); 
        setShowConfirmModal(false);
        setEventToDelete(null);
        
        if (onDataUpdate) onDataUpdate();
      } else {
        showNotification(data.error || 'Failed to delete event', "error");
        setError(null); 
        setShowConfirmModal(false);
      }
    } catch (err) {
      console.error('Error deleting event:', err);
      showNotification('Failed to delete event. Please try again.', "error");
      setError(null); 
      setShowConfirmModal(false);
    } finally {
      setLoading(false);
    }
  };
  const showDeleteConfirmation = (eventId) => {
    setEventToDelete(eventId);
    setConfirmMessage('Are you sure you want to delete this event? This action cannot be undone.');
    setConfirmAction('delete');
    setShowConfirmModal(true);
  };
  const showResetConfirmation = () => {
    setConfirmMessage('Are you sure you want to reset the form? All unsaved changes will be lost.');
    setConfirmAction('reset');
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    if (confirmAction === 'delete') {
      handleDeleteEvent();
    } else if (confirmAction === 'reset') {
      resetEventForm();
      setShowAddEventModal(false);
      setSelectedEvent(null);
      setShowConfirmModal(false);
    }
  };
  const handleViewEvent = (event) => {
    setShowEventDetails(event);
  };

  const handleEditEvent = (event) => {
    console.log('🔍 DEBUG - Editing event - Original data:', {
      title: event.title,
      backendType: event.originalType || event.type,
      backendStatus: event.originalStatus || event.status,
      mappedType: event.type,
      mappedStatus: event.status
    });
    
    setNewEvent({
      title: event.title || '',
      description: event.description || '',
      type: mapEventType(event.originalType || event.type) || 'academic',
      
      date: event.date || new Date().toISOString().split('T')[0],
      time: event.time || '10:00',
      location: event.venue || event.location || '',
      organizer: event.organizer || '',
      participants: parseInt(event.targetAudience || event.participants) || 0,
      status: mapEventStatus(event.originalStatus || event.status) || 'upcoming'
    });
    
    console.log('🔍 DEBUG - NewEvent state after mapping:', {
      type: mapEventType(event.originalType || event.type) || 'academic',
      status: mapEventStatus(event.originalStatus || event.status) || 'upcoming'
    });
    
    setSelectedEvent(event);
    setShowAddEventModal(true);
  };
  const handleShareEvent = (event) => {
    const eventLocation = event.venue || event.location;
    const eventDetails = `
Event: ${event.title}
Date: ${event.date}
Time: ${event.time}
Location: ${eventLocation}
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
      showNotification('Event details copied to clipboard!', "success");
    }
  };

  const handleSetReminder = (event) => {
    addNotification({
      type: 'reminder',
      title: 'Reminder Set',
      message: `Reminder set for "${event.title}"`,
      eventId: event._id || event.id,
      timestamp: new Date()
    });
    showNotification(`Reminder set for ${event.title}`, "success");
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
  const handleApplyFilters = () => {
    setShowFilterModal(false);
  }
  const handleResetFilters = () => {
    setFilters({
      eventType: 'all',
      status: 'all',
      date: ''
    });
    setShowFilterModal(false);
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE}/api/events`);
      const data = await response.json();
      
      if (data.success) {

        showNotification('Events refreshed successfully!', "success");
        addNotification({
          type: 'updated',
          title: 'Events Refreshed',
          message: 'All events have been refreshed successfully',
          timestamp: new Date()
        });
        
        if (onDataUpdate) onDataUpdate();
      } else {
        showNotification(data.error || 'Failed to fetch events', "error");
        setError(null); 
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      showNotification('Failed to connect to server', "error");
      setError(null); 
    } finally {
      setLoading(false);
    }
  };
  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) {
      return minutes < 1 ? 'Just now' : `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'upcoming': return <Calendar className="text-blue-500" size={20} />;
      case 'created': return <Plus className="text-green-500" size={20} />;
      case 'updated': return <Edit3 className="text-yellow-500" size={20} />;
      case 'deleted': return <Trash2 className="text-red-500" size={20} />;
      case 'reminder': return <BellRing className="text-purple-500" size={20} />;
      default: return <Bell className="text-gray-500" size={20} />;
    }
  };
  const getNotificationColor = (type) => {
    switch(type) {
      case 'upcoming': return 'blue';
      case 'created': return 'green';
      case 'updated': return 'yellow';
      case 'deleted': return 'red';
      case 'reminder': return 'purple';
      default: return 'gray';
    }
  };

  return (
    <div className="w-full p-6 space-y-6"> 
      
      <Notification 
        message={notification.message} 
        type={notification.type} 
        isVisible={notification.visible} 
      />

      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-lg font-medium">Please wait...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-orange-800">Events Management</h2>
          <p className="text-orange-400">Manage and track all school events and activities</p>
        </div>
        <div className="flex space-x-3 mt-4 lg:mt-0">
          <button 
            onClick={fetchEvents}
            disabled={loading}
            className="border border-gray-300 rounded-lg px-4 py-3 hover:bg-orange-400 transition-colors flex items-center space-x-2 text-gray-700 disabled:opacity-50"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button 
            onClick={() => setShowFilterModal(true)}
            className="border border-gray-300 rounded-lg px-4 py-3 hover:bg-orange-400 transition-colors flex items-center space-x-2 text-gray-700"
          >
            <Filter size={20} />
            <span>Filter</span>
          </button>
          
    
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="border border-gray-300 rounded-lg px-4 py-3 hover:bg-orange-400 transition-colors flex items-center space-x-2 text-gray-700 relative"
            >
              {unreadCount > 0 ? <BellRing size={20} /> : <Bell size={20} />}
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            
            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                    <div className="flex space-x-2">
                      {unreadCount > 0 && (
                        <button onClick={markAllAsRead} className="text-sm text-blue-500 hover:text-blue-700">
                          Mark all read
                        </button>
                      )}
                      {notifications.length > 0 && (
                        <button onClick={clearAllNotifications} className="text-sm text-red-500 hover:text-red-700">
                          Clear all
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="mx-auto text-gray-300 mb-3" size={32} />
                      <p className="text-gray-600">No notifications yet</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                          onClick={() => {
                            markAsRead(notification.id);
                            if (notification.eventId) {
                              const event = mappedEvents.find(e => (e._id || e.id) === notification.eventId);
                              if (event) handleViewEvent(event);
                            }
                          }}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="pt-1">{getNotificationIcon(notification.type)}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium text-gray-800 mb-1">{notification.title}</h4>
                                <button onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }} className="text-gray-400 hover:text-gray-600 ml-2">
                                  <X size={16} />
                                </button>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">{formatTime(notification.timestamp)}</span>
                                {!notification.read && <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {notifications.length > 0 && (
                  <div className="p-3 border-t border-gray-200">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{unreadCount} unread</span>
                      <span>{notifications.length} total</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setShowAddEventModal(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 shadow-sm"
          >
            <Plus size={20} />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <EventStatistics 
        events={mappedEvents} 
        unreadCount={unreadCount} 
        notifications={notifications} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events List */}
        <EventList 
          filteredEvents={filteredEvents}
          loading={loading}
          searchTerm={searchTerm}
          filters={filters}
          handleViewEvent={handleViewEvent}
          handleEditEvent={handleEditEvent}
          handleSetReminder={handleSetReminder}
          handleShareEvent={handleShareEvent}
          showDeleteConfirmation={showDeleteConfirmation}
          getEventTypeColor={getEventTypeColor}
          setShowAddEventModal={setShowAddEventModal}
        />

        {/* Sidebar */}
        <EventSidebar 
          events={mappedEvents}
          notifications={notifications}
          unreadCount={unreadCount}
          setShowNotifications={setShowNotifications}
          filters={filters}
          formatTime={formatTime}
          getNotificationIcon={getNotificationIcon}
          getNotificationColor={getNotificationColor}
        />
      </div>

      {/* All Modals */}
      <EventModals
        showAddEventModal={showAddEventModal}
        setShowAddEventModal={setShowAddEventModal}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        loading={loading}
        handleAddEvent={handleAddEvent}
        handleUpdateEvent={handleUpdateEvent}
        resetEventForm={resetEventForm}
        showResetConfirmation={showResetConfirmation}
        showConfirmModal={showConfirmModal}
        setShowConfirmModal={setShowConfirmModal}
        eventToDelete={eventToDelete}
        setEventToDelete={setEventToDelete}
        confirmAction={confirmAction}
        setConfirmAction={setConfirmAction}
        confirmMessage={confirmMessage}
        setConfirmMessage={setConfirmMessage}
        handleConfirm={handleConfirm}
        showEventDetails={showEventDetails}
        setShowEventDetails={setShowEventDetails}
        handleEditEvent={handleEditEvent}
        getEventTypeColor={getEventTypeColor}
      />

      {/* Filter Modal */}
      {showFilterModal && (
        <FilterModal
          filters={filters}
          setFilters={setFilters}
          setShowFilterModal={setShowFilterModal}
          handleResetFilters={handleResetFilters}
          handleApplyFilters={handleApplyFilters}
        />
      )}
    </div>
  );
};

export default EventsManagement;