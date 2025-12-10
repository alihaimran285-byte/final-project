import React, { useState } from 'react';
import { Search, Filter, ZoomIn, X } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const galleryItems = [
    {
      id: 1,
      image: "🏆",
      title: "Sports Day Champions",
      description: "Our students celebrating victory in annual sports competition",
      category: "sports",
      date: "2024-11-15"
    },
    {
      id: 2,
      image: "🔬",
      title: "Science Fair Projects",
      description: "Innovative science projects created by our young scientists",
      category: "academic",
      date: "2024-11-10"
    },
    {
      id: 3,
      image: "🎨",
      title: "Art Exhibition",
      description: "Beautiful artwork created by our talented students",
      category: "arts",
      date: "2024-10-28"
    },
    {
      id: 4,
      image: "🎵",
      title: "Music Concert",
      description: "Annual music concert featuring student performances",
      category: "cultural",
      date: "2024-10-20"
    },
    {
      id: 5,
      image: "📚",
      title: "Library Week",
      description: "Students engaged in reading activities during library week",
      category: "academic",
      date: "2024-10-15"
    },
    {
      id: 6,
      image: "🌱",
      title: "Gardening Club",
      description: "Students learning about plants and nature in gardening club",
      category: "clubs",
      date: "2024-10-10"
    },
    {
      id: 7,
      image: "🎭",
      title: "Drama Performance",
      description: "School play performed by drama club students",
      category: "cultural",
      date: "2024-09-25"
    },
    {
      id: 8,
      image: "🤖",
      title: "Robotics Workshop",
      description: "Students building and programming robots in workshop",
      category: "academic",
      date: "2024-09-18"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Photos', count: galleryItems.length },
    { id: 'sports', name: 'Sports', count: galleryItems.filter(item => item.category === 'sports').length },
    { id: 'academic', name: 'Academic', count: galleryItems.filter(item => item.category === 'academic').length },
    { id: 'arts', name: 'Arts', count: galleryItems.filter(item => item.category === 'arts').length },
    { id: 'cultural', name: 'Cultural', count: galleryItems.filter(item => item.category === 'cultural').length },
    { id: 'clubs', name: 'Clubs', count: galleryItems.filter(item => item.category === 'clubs').length }
  ];

  const filteredItems = activeFilter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeFilter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-peach-50 py-8 px-4 mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-900 mb-4">
            School Gallery
          </h1>
          <p className="text-lg text-orange-700 max-w-2xl mx-auto">
            Explore the vibrant life at Panda School through our photo gallery. 
            Capture moments of learning, creativity, and fun.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === category.id
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-white text-orange-700 border border-orange-200 hover:bg-orange-50'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-orange-200 overflow-hidden cursor-pointer"
              onClick={() => setSelectedImage(item)}
            >
              {/* Image/Emoji Display */}
              <div className="bg-gradient-to-r from-orange-400 to-peach-400 p-8 text-center h-48 flex items-center justify-center">
                <span className="text-6xl">{item.image}</span>
              </div>
              
              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-orange-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-orange-700 text-sm mb-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between text-xs text-orange-600">
                  <span className="capitalize">{item.category}</span>
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📷</div>
            <h3 className="text-xl font-semibold text-orange-900 mb-2">
              No photos found
            </h3>
            <p className="text-orange-700">
              Try selecting a different category to see more photos.
            </p>
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-orange-900">
                    {selectedImage.title}
                  </h3>
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="p-2 hover:bg-orange-100 rounded-lg transition-colors"
                  >
                    <X size={24} className="text-orange-600" />
                  </button>
                </div>
                
                {/* Large Image/Emoji */}
                <div className="bg-gradient-to-r from-orange-400 to-peach-400 p-12 text-center rounded-xl mb-4">
                  <span className="text-8xl">{selectedImage.image}</span>
                </div>
                
                <p className="text-orange-700 mb-4">
                  {selectedImage.description}
                </p>
                
                <div className="flex justify-between text-sm text-orange-600">
                  <span className="capitalize">{selectedImage.category}</span>
                  <span>{new Date(selectedImage.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gallery Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-white rounded-xl p-6 border border-orange-200">
            <div className="text-3xl font-bold text-orange-600">{galleryItems.length}+</div>
            <div className="text-orange-700">Memories</div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-orange-200">
            <div className="text-3xl font-bold text-orange-600">6</div>
            <div className="text-orange-700">Categories</div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-orange-200">
            <div className="text-3xl font-bold text-orange-600">2020</div>
            <div className="text-orange-700">Since</div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-orange-200">
            <div className="text-3xl font-bold text-orange-600">500+</div>
            <div className="text-orange-700">Students</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;