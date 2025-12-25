// ================================
// AUTHENTICATION HANDLERS
// ================================

const { adminsData } = require('../data/initialData');

const adminRegister = (req, res) => {
  const { name, email, password, role } = req.body;
  
  if (!name || !email || !password || role !== 'admin') {
    return res.status(400).json({
      success: false,
      message: 'All fields are required and role must be "admin"'
    });
  }
  
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }

  const existingAdmin = adminsData.find(a => a.email === email);
  if (existingAdmin) {
    return res.status(400).json({
      success: false,
      message: 'Admin with this email already exists'
    });
  }
  
  const adminData = {
    _id: Date.now().toString(),
    name,
    email,
    password,
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  adminsData.push(adminData);
  
  res.json({
    success: true,
    message: 'Admin registration successful!',
    admin: {
      id: adminData._id,
      name: adminData.name,
      email: adminData.email,
      role: adminData.role
    }
  });
};

const adminLogin = (req, res) => {
  const { email, password, role } = req.body;

  let admin = adminsData.find(a => a.email === email);

  if (!admin) {
    return res.status(401).json({
      success: false,
      message: 'Admin not found. Registered admins: admin@school.com or superadmin@school.com'
    });
  }

  if (admin.password !== password) {
    return res.status(401).json({
      success: false,
      message: 'Incorrect password'
    });
  }

  if (role !== 'admin') {
    return res.status(401).json({
      success: false,
      message: 'Please select admin role'
    });
  }

  res.json({
    success: true,
    message: 'Login successful',
    user: {
      id: admin._id,
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: 'admin'
    },
    token: 'admin-token-' + Date.now()
  });
};

module.exports = {
  adminRegister,
  adminLogin
};