const jwt = require('jsonwebtoken');
const Teacher = require('../models/Tteacher');
const Student = require('../models/Tstudent');
const Admin = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    
    // Find user based on role
    let user;
    switch (decoded.role) {
      
      case 'candidate':
        user = await Student.findById(decoded.id);
        break;
      case 'admin':
        user = await Admin.findById(decoded.id);
        break;
      default:
        return res.status(401).json({
          success: false,
          message: 'Invalid user role'
        });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add user to request object
    req.user = user;
    req.token = token;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

// Role-based middleware
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${req.user.role} role cannot access this resource.`
      });
    }

    next();
  };
};

module.exports = { authMiddleware, requireRole };