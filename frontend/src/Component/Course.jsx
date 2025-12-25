import React from 'react';
import { BookOpen, Users, Clock, Star } from 'lucide-react';

const Courses = () => {
  const courses = [
    {
      id: 1,
      title: "Science & Technology",
      description: "Hands-on experiments and technology integration",
      duration: "1 Year",
      students: 45,
      level: "Beginner",
      rating: 4.8,
      image: "🔬"
    },
    {
      id: 2,
      title: "Creative Arts",
      description: "Painting, music, drama and creative expression",
      duration: "8 Months",
      students: 32,
      level: "All Levels",
      rating: 4.9,
      image: "🎨"
    },
    {
      id: 3,
      title: "Mathematics Olympiad",
      description: "Advanced math concepts and problem solving",
      duration: "1 Year",
      students: 28,
      level: "Advanced",
      rating: 4.7,
      image: "📐"
    },
    {
      id: 4,
      title: "Language & Literature",
      description: "English, Urdu and creative writing skills",
      duration: "10 Months",
      students: 38,
      level: "Intermediate",
      rating: 4.6,
      image: "📚"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-peach-50 py-8 px-4 mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-900 mb-4">
            Our Courses
          </h1>
          <p className="text-lg text-orange-700 max-w-2xl mx-auto">
            Discover our diverse range of courses designed to nurture young minds 
            and foster creativity in a friendly learning environment.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div 
              key={course.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-orange-200 overflow-hidden"
            >
              {/* Course Image */}
              <div className="bg-gradient-to-r from-orange-400 to-peach-400 p-6 text-center">
                <span className="text-4xl">{course.image}</span>
              </div>
              
              {/* Course Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-orange-900 mb-2">
                  {course.title}
                </h3>
                <p className="text-orange-700 text-sm mb-4">
                  {course.description}
                </p>
                
                {/* Course Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-orange-600">
                    <Clock size={16} className="mr-2" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center text-sm text-orange-600">
                    <Users size={16} className="mr-2" />
                    <span>{course.students} Students</span>
                  </div>
                  <div className="flex items-center text-sm text-orange-600">
                    <BookOpen size={16} className="mr-2" />
                    <span>{course.level}</span>
                  </div>
                </div>
                
                {/* Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-400 fill-current mr-1" />
                    <span className="text-sm font-semibold text-orange-900">
                      {course.rating}
                    </span>
                  </div>
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium">
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">15+</div>
            <div className="text-orange-700">Courses</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">500+</div>
            <div className="text-orange-700">Students</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">25+</div>
            <div className="text-orange-700">Teachers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">98%</div>
            <div className="text-orange-700">Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;