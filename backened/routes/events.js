const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// GET all events with filters
router.get("/", async (req, res) => {
  try {
    const { type, status, date, search } = req.query;
    
    let filter = {};
    
    // Filter by type
    if (type && type !== 'all') {
      filter.type = type;
    }
    
    // Filter by status
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    // Filter by date range
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.date = { $gte: startDate, $lt: endDate };
    }
    
    // Search by title or description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    
    const events = await Event.find(filter)
      .sort({ date: 1, createdAt: -1 })
      .lean();
    
    // Format dates for frontend
    const formattedEvents = events.map(event => ({
      ...event,
      date: event.date.toISOString().split('T')[0],
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString()
    }));
    
    res.json({
      success: true,
      data: formattedEvents,
      total: formattedEvents.length
    });
  } catch (error) {
    console.error('❌ GET Events Error:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch events" 
    });
  }
});

// GET single event
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).lean();
    
    if (!event) {
      return res.status(404).json({ 
        success: false,
        error: "Event not found" 
      });
    }
    
    // Format date
    event.date = event.date.toISOString().split('T')[0];
    
    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('❌ GET Single Event Error:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch event" 
    });
  }
});

// CREATE new event
router.post("/", async (req, res) => {
  try {
    console.log('📥 POST /api/events - Body:', req.body);
    
    // Validation
    const { title, date, time, location, organizer } = req.body;
    
    if (!title || !date || !time || !location || !organizer) {
      return res.status(400).json({ 
        success: false,
        error: "Title, date, time, location, and organizer are required" 
      });
    }
    
    // Check for duplicate event on same date
    const existingEvent = await Event.findOne({
      title: req.body.title,
      date: new Date(req.body.date)
    });
    
    if (existingEvent) {
      return res.status(400).json({
        success: false,
        error: "Event with same title and date already exists"
      });
    }
    
    const newEvent = new Event({
      title: req.body.title,
      description: req.body.description || "",
      type: req.body.type || "academic",
      date: new Date(req.body.date),
      time: req.body.time,
      location: req.body.location,
      organizer: req.body.organizer,
      participants: parseInt(req.body.participants) || 0,
      status: req.body.status || "upcoming",
      image: getEventEmoji(req.body.type || "academic")
    });
    
    await newEvent.save();
    
    console.log('✅ Event created:', newEvent.title);
    
    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: {
        ...newEvent.toObject(),
        date: newEvent.date.toISOString().split('T')[0]
      }
    });
  } catch (error) {
    console.error('❌ POST Error:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to create event" 
    });
  }
});

// UPDATE event
router.put("/:id", async (req, res) => {
  try {
    const eventId = req.params.id;
    
    const updates = { ...req.body };
    
    // Convert date string to Date object if provided
    if (updates.date) {
      updates.date = new Date(updates.date);
    }
    
    // Convert participants to number if provided
    if (updates.participants) {
      updates.participants = parseInt(updates.participants);
    }
    
    // Update emoji if type changed
    if (updates.type) {
      updates.image = getEventEmoji(updates.type);
    }
    
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      updates,
      { new: true, runValidators: true }
    ).lean();
    
    if (!updatedEvent) {
      return res.status(404).json({ 
        success: false,
        error: "Event not found" 
      });
    }
    
    // Format date
    updatedEvent.date = updatedEvent.date.toISOString().split('T')[0];
    
    res.json({
      success: true,
      message: "Event updated successfully",
      data: updatedEvent
    });
  } catch (error) {
    console.error('❌ PUT Error:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to update event" 
    });
  }
});

// DELETE event
router.delete("/:id", async (req, res) => {
  try {
    const eventId = req.params.id;
    
    const deletedEvent = await Event.findByIdAndDelete(eventId).lean();
    
    if (!deletedEvent) {
      return res.status(404).json({ 
        success: false,
        error: "Event not found" 
      });
    }
    
    // Format date
    deletedEvent.date = deletedEvent.date.toISOString().split('T')[0];
    
    res.json({ 
      success: true,
      message: "Event deleted successfully", 
      data: deletedEvent 
    });
  } catch (error) {
    console.error('❌ DELETE Error:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to delete event" 
    });
  }
});

// GET event statistics
router.get("/stats/summary", async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Get all events
    const events = await Event.find().lean();
    
    // Calculate statistics
    const upcomingEvents = events.filter(event => 
      event.status === 'upcoming' && new Date(event.date) >= currentDate
    ).length;
    
    const totalParticipants = events.reduce((sum, event) => sum + (event.participants || 0), 0);
    
    const eventsThisMonth = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === currentMonth && 
             eventDate.getFullYear() === currentYear;
    }).length;
    
    const uniqueLocations = new Set(events.map(event => event.location)).size;
    
    // Event type distribution
    const typeDistribution = {
      academic: 0,
      sports: 0,
      cultural: 0,
      meeting: 0,
      workshop: 0,
      other: 0
    };
    
    events.forEach(event => {
      if (typeDistribution.hasOwnProperty(event.type)) {
        typeDistribution[event.type]++;
      }
    });
    
    res.json({
      success: true,
      data: {
        overview: {
          totalEvents: events.length,
          upcomingEvents,
          totalParticipants,
          eventsThisMonth,
          uniqueLocations
        },
        typeDistribution,
        recentEvents: events
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5)
          .map(event => ({
            id: event._id,
            title: event.title,
            date: event.date.toISOString().split('T')[0],
            type: event.type,
            status: event.status
          }))
      }
    });
  } catch (error) {
    console.error('❌ Stats Error:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch event statistics" 
    });
  }
});

// Helper function to get event emoji
function getEventEmoji(type) {
  const emojis = {
    academic: '📚',
    sports: '⚽',
    cultural: '🎭',
    meeting: '👥',
    workshop: '🔧',
    other: '📅'
  };
  return emojis[type] || '📅';
}

module.exports = router;