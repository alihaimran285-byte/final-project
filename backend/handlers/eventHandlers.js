

const { eventsData } = require('../data/initialData');

const getAllEvents = (req, res) => {
  res.json({
    success: true,
    count: eventsData.length,
    data: eventsData
  });
};

const getEventById = (req, res) => {
  const event = eventsData.find(e => e._id === req.params.id);
  
  if (!event) {
    return res.status(404).json({
      success: false,
      error: "Event not found"
    });
  }
  
  res.json({
    success: true,
    data: event
  });
};

const addEvent = (req, res) => {
  const { 
    title, 
    description, 
    date, 
    time, 
    venue, 
    organizer, 
    targetAudience, 
    className,
    type = 'academic',       // ✅ ADD THIS LINE
    status = 'upcoming'      // ✅ ADD THIS LINE
  } = req.body;
  
  const eventTargetAudience = targetAudience || 
                              (className === 'all' ? ['all'] : [className]);
  
  const newEvent = {
    _id: Date.now().toString(),
    title,
    description,
    date,
    time,
    venue,
    organizer,
    class: className || 'all',
    targetAudience: eventTargetAudience,
    type: type,              // ✅ ADD THIS LINE
    status: status,          // ✅ ADD THIS LINE
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  eventsData.push(newEvent);
  
  res.status(201).json({
    success: true,
    message: 'Event added successfully',
    data: newEvent
  });
};

const updateEvent = (req, res) => {
  const eventIndex = eventsData.findIndex(e => e._id === req.params.id);
  
  if (eventIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Event not found"
    });
  }
  
  const { className, targetAudience } = req.body;
  
  if (className) {
    req.body.class = className;
    if (!targetAudience) {
      req.body.targetAudience = className === 'all' ? ['all'] : [className];
    }
  }
  
  eventsData[eventIndex] = {
    ...eventsData[eventIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    message: 'Event updated successfully',
    data: eventsData[eventIndex]
  });
};

const deleteEvent = (req, res) => {
  const eventIndex = eventsData.findIndex(e => e._id === req.params.id);
  
  if (eventIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Event not found"
    });
  }
  
  const deleted = eventsData.splice(eventIndex, 1);
  
  res.json({
    success: true,
    message: 'Event deleted successfully',
    data: deleted[0]
  });
};

module.exports = {
  getAllEvents,
  getEventById,
  addEvent,
  updateEvent,
  deleteEvent
};