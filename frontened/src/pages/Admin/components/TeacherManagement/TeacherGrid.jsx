import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import TeacherCard from './TeacherCard';

const TeacherGrid = ({ teachers, loading, searchTerm, subjectFilter, onEditClick, onDeleteClick, onAddTeacher }) => {
  if (teachers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="text-orange-400" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-orange-900 mb-2">No teachers found</h3>
          <p className="text-orange-700 mb-6">
            {searchTerm || subjectFilter !== 'All' 
              ? 'Try adjusting your search or filters to find what you are looking for.'
              : 'Get started by adding your first teacher to the system.'
            }
          </p>
          <button
            onClick={onAddTeacher}
            className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Add Teacher
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {teachers.map((teacher) => (
        <TeacherCard
          key={teacher._id}
          teacher={teacher}
          loading={loading}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </div>
  );
};

export default TeacherGrid;