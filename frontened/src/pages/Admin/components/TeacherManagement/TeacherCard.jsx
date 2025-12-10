import React from 'react';
import { Mail, Phone, Edit3, Trash2, Clock, BookOpen, Calendar } from 'lucide-react';

const TeacherCard = ({ teacher, onEdit, onDelete }) => {
  if (!teacher) return null;

  const {
    _id,
    name = 'Teacher Name',
    email = 'No email',
    phone = 'Not provided',
    subject = 'General',
    status = 'active',
    classes = 1,
    experience = 0,
    joinDate,
    createdAt,
    schedule = ''
  } = teacher;

  const getAvatarUrl = () => 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=fdba74&color=fff&bold=true&size=128`;

  const getStatusColor = () => {
    const map = { active: 'bg-green-100 text-green-700', inactive: 'bg-gray-100 text-gray-700', 'on leave': 'bg-yellow-100 text-yellow-700' };
    return map[status.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  const formatJoin = (d) => !d ? '—' : new Date(d).toLocaleDateString('en-US', { month: 'short' });

  return (
    <div className="h-full flex">
      <div className="bg-white rounded-2xl border border-orange-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col w-full h-full min-h-[400px] overflow-hidden">
        
        <div className="h-1.5 bg-gradient-to-r from-orange-500 to-orange-400"></div>

        <div className="p-5 flex flex-col flex-1">
          
          {/* Header */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <img src={getAvatarUrl()} alt={name} className="w-14 h-14 rounded-full border-4 border-white shadow" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 truncate">{name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusColor()}`}>{status}</span>
                  <span className="text-sm font-medium text-orange-700 truncate">{subject}</span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2"><Mail size={14} className="text-orange-500" /><span className="truncate">{email}</span></div>
              {phone && phone !== 'Not provided' && <div className="flex items-center gap-2"><Phone size={14} className="text-orange-500" /><span className="truncate">{phone}</span></div>}
            </div>

            {/* Stats - Now 3 items only (rating removed) */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <Clock size={16} className="mx-auto text-blue-600 mb-1" />
                <p className="text-sm font-bold text-blue-900">{experience}y</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-3 text-center">
                <BookOpen size={16} className="mx-auto text-orange-600 mb-1" />
                <p className="text-sm font-bold text-orange-900">{classes}</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <Calendar size={16} className="mx-auto text-purple-600 mb-1" />
                <p className="text-xs font-bold text-purple-900">{formatJoin(joinDate || createdAt)}</p>
              </div>
            </div>

            {/* Schedule */}
            {schedule && <div className="text-xs text-gray-600 bg-gray-50 rounded-lg p-3 mb-4 line-clamp-2">{schedule}</div>}
          </div>

          {/* Footer - Always at bottom */}
          <div className="pt-4 border-t border-gray-200 mt-auto">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                ID: {_id?.slice(-6) || 'N/A'}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(teacher)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white font-semibold text-xs rounded-lg transition-all shadow-sm hover:shadow-md"
                >
                  <Edit3 size={13} /> Edit
                </button>
                <button
                  onClick={() => onDelete(teacher)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white font-semibold text-xs rounded-lg transition-all shadow-sm hover:shadow-md"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCard;