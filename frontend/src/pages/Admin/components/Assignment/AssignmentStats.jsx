
import React from 'react';
import { BookOpen, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const AssignmentStats = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
    <StatCard
      title="Total Assignments"
      value={stats.total}
      icon={BookOpen}
      color="orange"
      borderColor="border-orange-200"
      bgColor="bg-orange-100"
      iconColor="text-orange-600"
    />
    
    <StatCard
      title="Active"
      value={stats.active}
      icon={CheckCircle}
      color="green"
      borderColor="border-green-200"
      bgColor="bg-green-100"
      iconColor="text-green-600"
    />
    
    <StatCard
      title="Pending Submission"
      value={stats.pending}
      icon={Clock}
      color="yellow"
      borderColor="border-yellow-200"
      bgColor="bg-yellow-100"
      iconColor="text-yellow-600"
    />
    
    <StatCard
      title="Overdue"
      value={stats.overdue}
      icon={AlertCircle}
      color="red"
      borderColor="border-red-200"
      bgColor="bg-red-100"
      iconColor="text-red-600"
    />
  </div>
);

const StatCard = ({ title, value, icon: Icon, borderColor, bgColor, iconColor }) => (
  <div className={`bg-white rounded-2xl shadow-sm border ${borderColor} p-4 md:p-6`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <div className={`w-10 h-10 md:w-12 md:h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
        <Icon className={iconColor} size={20} />
      </div>
    </div>
  </div>
);

export default AssignmentStats;