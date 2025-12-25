import React from 'react';
import { Mail, Phone, Star, Award } from 'lucide-react';

const Teacher = () => {
  const teachers = [
    {
      id: 1,
      name: "Mrs. Ayesha Khan",
      subject: "Science & Mathematics",
      experience: "12 Years",
      qualification: "M.Sc. Physics",
      rating: 4.9,
      students: 240,
      image: "👩‍🏫",
      specialties: ["Physics", "Chemistry", "Problem Solving"],
      email: "ayesha.khan@pandaschool.pk",
      phone: "+92 300 123 4567"
    },
    {
      id: 2,
      name: "Mr. Ali Raza",
      subject: "Languages & Literature",
      experience: "8 Years",
      qualification: "M.A. English Literature",
      rating: 4.8,
      students: 180,
      image: "👨‍🏫",
      specialties: ["English", "Urdu", "Creative Writing"],
      email: "ali.raza@pandaschool.pk",
      phone: "+92 300 123 4568"
    },
    {
      id: 3,
      name: "Ms. Fatima Noor",
      subject: "Arts & Creativity",
      experience: "6 Years",
      qualification: "B.F.A. Fine Arts",
      rating: 4.9,
      students: 150,
      image: "👩‍🎨",
      specialties: ["Painting", "Music", "Drama"],
      email: "fatima.noor@pandaschool.pk",
      phone: "+92 300 123 4569"
    },
    {
      id: 4,
      name: "Mr. Bilal Ahmed",
      subject: "Sports & Physical Education",
      experience: "10 Years",
      qualification: "M.P.Ed Physical Education",
      rating: 4.7,
      students: 300,
      image: "🏃‍♂️",
      specialties: ["Cricket", "Football", "Athletics"],
      email: "bilal.ahmed@pandaschool.pk",
      phone: "+92 300 123 4570"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-peach-50 py-8 px-4 mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-900 mb-4">
            Our Teachers
          </h1>
          <p className="text-lg text-orange-700 max-w-2xl mx-auto">
            Meet our dedicated and experienced teaching staff who are passionate 
            about nurturing young minds and creating a positive learning environment.
          </p>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {teachers.map((teacher) => (
            <div 
              key={teacher.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-orange-200 overflow-hidden"
            >
              {/* Teacher Header */}
              <div className="bg-gradient-to-r from-orange-400 to-peach-400 p-6 text-center">
                <div className="text-5xl mb-2">{teacher.image}</div>
                <h3 className="text-xl font-bold text-white">{teacher.name}</h3>
                <p className="text-orange-100">{teacher.subject}</p>
              </div>
              
              {/* Teacher Details */}
              <div className="p-6">
                {/* Qualification & Experience */}
                <div className="mb-4">
                  <div className="flex items-center text-sm text-orange-600 mb-1">
                    <Award size={16} className="mr-2" />
                    <span>{teacher.qualification}</span>
                  </div>
                  <div className="text-sm text-orange-600">
                    {teacher.experience} Experience
                  </div>
                </div>

                {/* Specialties */}
                <div className="mb-4">
                  <h4 className="font-semibold text-orange-900 text-sm mb-2">Specialties:</h4>
                  <div className="flex flex-wrap gap-1">
                    {teacher.specialties.map((specialty, index) => (
                      <span 
                        key={index}
                        className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rating & Students */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-400 fill-current mr-1" />
                    <span className="text-sm font-semibold text-orange-900">
                      {teacher.rating}
                    </span>
                  </div>
                  <div className="text-sm text-orange-600">
                    {teacher.students} students
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 border-t border-orange-200 pt-4">
                  <div className="flex items-center text-sm text-orange-600">
                    <Mail size={14} className="mr-2" />
                    <span className="truncate">{teacher.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-orange-600">
                    <Phone size={14} className="mr-2" />
                    <span>{teacher.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Teaching Philosophy */}
        <div className="mt-16 bg-white rounded-2xl p-8 border border-orange-200">
          <h2 className="text-2xl font-bold text-orange-900 text-center mb-6">
            Our Teaching Philosophy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">💖</div>
              <h3 className="font-semibold text-orange-900 mb-2">Nurturing Environment</h3>
              <p className="text-orange-700 text-sm">
                Creating a safe and supportive space for every child to grow
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🚀</div>
              <h3 className="font-semibold text-orange-900 mb-2">Innovative Methods</h3>
              <p className="text-orange-700 text-sm">
                Using modern teaching techniques to make learning fun and effective
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🌟</div>
              <h3 className="font-semibold text-orange-900 mb-2">Individual Attention</h3>
              <p className="text-orange-700 text-sm">
                Personalized learning paths for each student's unique needs
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teacher;