import React from 'react';
import { X, RefreshCw, AlertCircle, CheckCircle, Calendar, MapPin, Clock, Users } from 'lucide-react';

const EventModals = ({
  showAddEventModal,
  setShowAddEventModal,
  selectedEvent,
  setSelectedEvent,
  newEvent,
  setNewEvent,
  loading,
  handleAddEvent,
  handleUpdateEvent,
  resetEventForm,
  showResetConfirmation,
  showConfirmModal,
  setShowConfirmModal,
  eventToDelete,
  setEventToDelete,
  confirmAction,
  setConfirmAction,
  confirmMessage,
  setConfirmMessage,
  handleConfirm,
  showEventDetails,
  setShowEventDetails,
  handleEditEvent,
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
    <>
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
                  if (selectedEvent || Object.values(newEvent).some(val => val !== '' && val !== 'academic' && val !== 'upcoming' && val !== 0)) {
                    showResetConfirmation();
                  } else {
                    setShowAddEventModal(false);
                    setSelectedEvent(null);
                    resetEventForm();
                  }
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
                    if (selectedEvent || Object.values(newEvent).some(val => val !== '' && val !== 'academic' && val !== 'upcoming' && val !== 0)) {
                      showResetConfirmation();
                    } else {
                      setShowAddEventModal(false);
                      setSelectedEvent(null);
                      resetEventForm();
                    }
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

      {/* Custom Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Confirm Action</h3>
            </div>
            
            <div className="p-6">
              <div className="flex items-start mb-6">
                <AlertCircle className="text-yellow-500 mr-3 mt-0.5" size={24} />
                <p className="text-gray-700">{confirmMessage}</p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setEventToDelete(null);
                    setConfirmAction(null);
                    setConfirmMessage('');
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className={`px-6 py-2 ${
                    confirmAction === 'delete' 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2`}
                  disabled={loading}
                >
                  {loading && <RefreshCw size={16} className="animate-spin" />}
                  <span>
                    {confirmAction === 'delete' ? 'Delete' : 'Confirm'}
                  </span>
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
                    <p className="text-gray-800">{showEventDetails.venue || showEventDetails.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Participants</p>
                    <p className="text-gray-800">{showEventDetails.targetAudience || showEventDetails.participants || 0}</p>
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
    </>
  );
};

export default EventModals;