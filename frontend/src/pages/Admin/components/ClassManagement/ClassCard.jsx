import React from 'react';
import { Calendar, User, Users, Edit2, Trash2, MapPin, Plus } from 'lucide-react';

const ClassCard = ({ classItem, onEdit, onDelete, onAddStudents }) => {
  if (!classItem) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse w-full">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  
  const {
    name = '',
    className = '',
    subject = 'General',
    schedule: rawSchedule = '',
    teacher = '',
    classTeacherName = '',
    grade = '',
    students = 0,
    totalStudents = 0,
    code = '',
    color = 'blue',
    roomNo = '',
    capacity = 30,
    _id,
    id
  } = classItem;

  const classId = _id || id;
  const displayName = className || name || 'Class Name';
  const displayTeacher = classTeacherName || teacher || 'No teacher assigned';
  const studentCount = totalStudents || students || 0;
  

  const formatSchedule = () => {
    if (!rawSchedule) return 'No schedule';
    
    if (typeof rawSchedule === 'string') {
      return rawSchedule.length > 25 ? rawSchedule.substring(0, 22) + '...' : rawSchedule;
    }
    
    if (typeof rawSchedule === 'object') {
      try {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        const scheduleDays = days.filter(day => rawSchedule[day]);
        
        if (scheduleDays.length === 0) {
          
          const fullDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
          const foundDay = fullDays.find(day => rawSchedule[day]);
          if (foundDay) {
            return `${foundDay.substring(0, 3)}: ${Array.isArray(rawSchedule[foundDay]) ? rawSchedule[foundDay][0] : rawSchedule[foundDay]}`;
          }
          return 'Schedule set';
        }
        
        if (scheduleDays.length === 1) {
          const time = Array.isArray(rawSchedule[scheduleDays[0]]) 
            ? rawSchedule[scheduleDays[0]][0]
            : rawSchedule[scheduleDays[0]];
          return `${scheduleDays[0]}: ${time}`;
        }
        
        return `${scheduleDays[0]}...: ${Array.isArray(rawSchedule[scheduleDays[0]]) ? rawSchedule[scheduleDays[0]][0] : rawSchedule[scheduleDays[0]]}`;
      } catch (error) {
        return 'Schedule set';
      }
    }
    
    return 'Schedule set';
  };

  const scheduleText = formatSchedule();
  
  
  const colorMap = {
    blue: { 
      bg: 'bg-blue-500', 
      light: 'bg-blue-50', 
      text: 'text-blue-600', 
      border: 'border-blue-200',
      progress: 'bg-blue-500'
    },
    green: { 
      bg: 'bg-green-500', 
      light: 'bg-green-50', 
      text: 'text-green-600', 
      border: 'border-green-200',
      progress: 'bg-green-500'
    },
    purple: { 
      bg: 'bg-purple-500', 
      light: 'bg-purple-50', 
      text: 'text-purple-600', 
      border: 'border-purple-200',
      progress: 'bg-purple-500'
    },
    orange: { 
      bg: 'bg-orange-500', 
      light: 'bg-orange-50', 
      text: 'text-orange-600', 
      border: 'border-orange-200',
      progress: 'bg-orange-500'
    },
    red: { 
      bg: 'bg-red-500', 
      light: 'bg-red-50', 
      text: 'text-red-600', 
      border: 'border-red-200',
      progress: 'bg-red-500'
    },
    indigo: { 
      bg: 'bg-indigo-500', 
      light: 'bg-indigo-50', 
      text: 'text-indigo-600', 
      border: 'border-indigo-200',
      progress: 'bg-indigo-500'
    },
    pink: { 
      bg: 'bg-pink-500', 
      light: 'bg-pink-50', 
      text: 'text-pink-600', 
      border: 'border-pink-200',
      progress: 'bg-pink-500'
    },
    teal: { 
      bg: 'bg-teal-500', 
      light: 'bg-teal-50', 
      text: 'text-teal-600', 
      border: 'border-teal-200',
      progress: 'bg-teal-500'
    }
  };

  const colors = colorMap[color] || colorMap.blue;
  
  
  const subjectIcons = {
    Mathematics: '∫',
    Science: '⚛️',
    English: '📖',
    Urdu: '📘',
    Islamiat: '🕌',
    Biology: '🧬',
    Physics: '⚡',
    Chemistry: '🧪',
    'Social Studies': '🌍',
    'Computer Science': '💻',
    History: '📜',
    Geography: '🗺️',
    'Physical Education': '⚽'
  };

  const subjectIcon = subjectIcons[subject] || '📚';
  
  
  const occupancy = capacity > 0 ? Math.min(Math.round((studentCount / capacity) * 100), 100) : 0;
  
  
  const getOccupancyColor = (percent) => {
    if (percent >= 90) return 'bg-red-500';
    if (percent >= 70) return 'bg-yellow-500';
    if (percent >= 50) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const occupancyColor = getOccupancyColor(occupancy);

  return (
    <div className="group bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full w-full">
      
    
      <div className={`h-1.5 ${colors.bg} group-hover:h-2 transition-all duration-300`}></div>
      
      
      <div className="p-4 flex-1 flex flex-col w-full">
        
        
        <div className="flex items-start justify-between mb-3 w-full">
          <div className="flex items-center gap-2 w-full max-w-[70%]">
            <span className="text-xl flex-shrink-0">{subjectIcon}</span>
            <div className="flex flex-col min-w-0 flex-1">
              <h3 className="text-base font-bold text-gray-800 truncate w-full">
                {displayName}
              </h3>
              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${colors.light} ${colors.text} mt-1 w-fit`}>
                {subject}
              </span>
            </div>
          </div>
          
          
          <div className="flex flex-col items-end flex-shrink-0">
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded whitespace-nowrap">
              {code || 'N/A'}
            </span>
            {grade && (
              <span className="text-xs text-gray-500 mt-1 whitespace-nowrap">
                {grade}
              </span>
            )}
          </div>
        </div>

        
        <div className="space-y-2 mb-3 w-full">
          <div className="flex items-center gap-2 text-sm w-full">
            <Calendar size={14} className="text-orange-500 flex-shrink-0" />
            <span className="text-gray-700 truncate w-full" title={scheduleText}>
              {scheduleText}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm w-full">
            <User size={14} className="text-blue-500 flex-shrink-0" />
            <span className="text-gray-700 truncate w-full" title={displayTeacher}>
              {displayTeacher}
            </span>
          </div>
          {roomNo && (
            <div className="flex items-center gap-2 text-sm w-full">
              <MapPin size={14} className="text-purple-500 flex-shrink-0" />
              <span className="text-gray-700 truncate w-full">{roomNo}</span>
            </div>
          )}
        </div>

  
        <div className="mb-3 flex-1 w-full">
          <div className="flex items-center justify-between mb-1 w-full">
            <div className="flex items-center gap-1">
              <Users size={14} className="text-green-500" />
              <span className="text-xs text-gray-600">Students:</span>
            </div>
            <span className="text-xs font-semibold text-gray-800 whitespace-nowrap">
              {studentCount}/{capacity}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-500 ${occupancyColor}`}
              style={{ width: `${occupancy}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1 w-full">
            <span>0</span>
            <span className="font-medium whitespace-nowrap">{occupancy}% Full</span>
            <span>{capacity}</span>
          </div>
        </div>

        
        <div className="flex gap-1.5 pt-3 border-t border-gray-100 w-full">
          {/* Add Students Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddStudents && onAddStudents(classItem);
            }}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg border border-green-200 hover:border-green-300 transition-colors text-xs font-medium w-full"
            title="Add Students"
          >
            <Plus size={12} />
            <span className="hidden xs:inline">Add</span>
          </button>
          
          {/* Edit Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit && onEdit(classItem);
            }}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 rounded-lg border border-yellow-200 hover:border-yellow-300 transition-colors text-xs font-medium w-full"
            title="Edit Class"
          >
            <Edit2 size={12} />
            <span className="hidden xs:inline">Edit</span>
          </button>
          
          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onDelete && onDelete(classItem);
            }}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg border border-red-200 hover:border-red-300 transition-colors text-xs font-medium w-full"
            title="Delete Class"
          >
            <Trash2 size={12} />
            <span className="hidden xs:inline">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassCard;