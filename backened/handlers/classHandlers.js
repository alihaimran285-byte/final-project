// ================================
// CLASS HANDLERS
// ================================

const { classesData, studentsData } = require('../data/initialData');

const getAllClasses = (req, res) => {
  res.json({
    success: true,
    count: classesData.length,
    data: classesData
  });
};

const getClassById = (req, res) => {
  const classItem = classesData.find(c => c._id === req.params.id);
  
  if (!classItem) {
    return res.status(404).json({
      success: false,
      error: "Class not found"
    });
  }
  
  const classStudents = studentsData.filter(s => s.class === classItem.className);
  
  res.json({
    success: true,
    data: {
      ...classItem,
      students: classStudents
    }
  });
};

const addClass = (req, res) => {
  const newClass = {
    _id: Date.now().toString(),
    ...req.body,
    totalStudents: 0,
    status: req.body.status || 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  classesData.push(newClass);
  
  res.status(201).json({
    success: true,
    message: 'Class added successfully',
    data: newClass
  });
};

const updateClass = (req, res) => {
  const classIndex = classesData.findIndex(c => c._id === req.params.id);
  
  if (classIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Class not found"
    });
  }
  
  classesData[classIndex] = {
    ...classesData[classIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    message: 'Class updated successfully',
    data: classesData[classIndex]
  });
};

const deleteClass = (req, res) => {
  const classIndex = classesData.findIndex(c => c._id === req.params.id);
  
  if (classIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Class not found"
    });
  }
  
  const deleted = classesData.splice(classIndex, 1);
  
  res.json({
    success: true,
    message: 'Class deleted successfully',
    data: deleted[0]
  });
};

module.exports = {
  getAllClasses,
  getClassById,
  addClass,
  updateClass,
  deleteClass
};