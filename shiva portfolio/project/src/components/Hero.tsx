import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Mail, MapPin, Edit3, Save, X } from 'lucide-react';
import { portfolioConfig } from '../config/portfolio';
import { useAdmin } from '../contexts/AdminContext';

const Hero: React.FC = () => {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const { isAdmin } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [heroData, setHeroData] = useState({
    name: portfolioConfig.name,
    roles: [...portfolioConfig.roles],
    tagline: portfolioConfig.tagline,
    location: portfolioConfig.location
  });
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prevIndex) => 
        (prevIndex + 1) % heroData.roles.length
      );
    }, 3000); // Change role every 3 seconds

    return () => clearInterval(interval);
  }, [heroData.roles.length]);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const saveHeroData = () => {
    setIsEditing(false);
    // In a real app, you would save this to your backend/config
  };

  const cancelEdit = () => {
    setHeroData({
      name: portfolioConfig.name,
      roles: [...portfolioConfig.roles],
      tagline: portfolioConfig.tagline,
      location: portfolioConfig.location
    });
    setIsEditing(false);
  };

  const addRole = () => {
    if (newRole.trim()) {
      setHeroData({
        ...heroData,
        roles: [...heroData.roles, newRole.trim()]
      });
      setNewRole('');
    }
  };

  const removeRole = (index: number) => {
    if (heroData.roles.length > 1) {
      setHeroData({
        ...heroData,
        roles: heroData.roles.filter((_, i) => i !== index)
      });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-200 dark:bg-pink-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Admin Edit Panel */}
        {isEditing && isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg max-w-2xl mx-auto"
          >
            <div className="flex justify-end space-x-4 mb-4">
              <button
                onClick={saveHeroData}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <Save size={16} />
                <span>Save</span>
              </button>
              <button
                onClick={cancelEdit}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={heroData.name}
                  onChange={(e) => setHeroData({ ...heroData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Roles
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add new role"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addRole()}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={addRole}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {heroData.roles.map((role, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-2"
                    >
                      <input
                        type="text"
                        value={role}
                        onChange={(e) => {
                          const newRoles = [...heroData.roles];
                          newRoles[index] = e.target.value;
                          setHeroData({ ...heroData, roles: newRoles });
                        }}
                        className="flex-1 bg-transparent border-none focus:outline-none text-gray-700 dark:text-gray-300"
                      />
                      {heroData.roles.length > 1 && (
                        <button
                          onClick={() => removeRole(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tagline
                </label>
                <textarea
                  value={heroData.tagline}
                  onChange={(e) => setHeroData({ ...heroData, tagline: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={heroData.location}
                  onChange={(e) => setHeroData({ ...heroData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center mb-6">
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Hi, I'm{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {heroData.name}
              </span>
            </motion.h1>
            {isAdmin && !isEditing && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="ml-4 p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
              >
                <Edit3 size={24} />
              </motion.button>
            )}
          </div>

          <motion.div
            className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 mb-4 h-12 flex items-center justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.h2
              key={currentRoleIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold"
            >
              {heroData.roles[currentRoleIndex]}
            </motion.h2>
          </motion.div>

          <motion.p
            className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {heroData.tagline}
          </motion.p>

          <motion.div
            className="flex justify-center space-x-6 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.a
              href={portfolioConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Github size={24} className="text-gray-700 dark:text-gray-300" />
            </motion.a>
            <motion.a
              href={portfolioConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Linkedin size={24} className="text-blue-600" />
            </motion.a>
            <motion.a
              href={`mailto:${portfolioConfig.email}`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Mail size={24} className="text-red-500" />
            </motion.a>
          </motion.div>

          <motion.div
            className="flex items-center justify-center text-gray-500 dark:text-gray-400 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <MapPin size={16} className="mr-2" />
            <span>{heroData.location}</span>
          </motion.div>

          <motion.button
            onClick={scrollToAbout}
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            Learn More
            <ArrowDown size={20} className="ml-2 animate-bounce" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;