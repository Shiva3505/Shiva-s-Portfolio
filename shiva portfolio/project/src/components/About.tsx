import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CheckCircle, Edit3, Save, X } from 'lucide-react';
import { portfolioConfig } from '../config/portfolio';
import { useAdmin } from '../contexts/AdminContext';

const About: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { isAdmin } = useAdmin();
  const [about, setAbout] = useState(portfolioConfig.about);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: about.title,
    description: about.description,
    highlights: [...about.highlights]
  });
  const [newHighlight, setNewHighlight] = useState('');

  const saveChanges = () => {
    setAbout(editData);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditData({
      title: about.title,
      description: about.description,
      highlights: [...about.highlights]
    });
    setIsEditing(false);
  };

  const addHighlight = () => {
    if (newHighlight.trim()) {
      setEditData({
        ...editData,
        highlights: [...editData.highlights, newHighlight.trim()]
      });
      setNewHighlight('');
    }
  };

  const removeHighlight = (index: number) => {
    setEditData({
      ...editData,
      highlights: editData.highlights.filter((_, i) => i !== index)
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center mb-16">
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              {isEditing ? (
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="bg-transparent border-b-2 border-blue-600 focus:outline-none text-center"
                />
              ) : (
                about.title
              )}
            </motion.h2>
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

          {isEditing && isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl"
            >
              <div className="flex justify-end space-x-4 mb-4">
                <button
                  onClick={saveChanges}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <Save size={16} />
                  <span>Save Changes</span>
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  <X size={16} />
                  <span>Cancel</span>
                </button>
              </div>
            </motion.div>
          )}

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants}>
              {isEditing ? (
                <div className="space-y-4">
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="About description..."
                  />
                  
                  {/* Highlights Management */}
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Highlights</h4>
                    <div className="flex space-x-2 mb-3">
                      <input
                        type="text"
                        placeholder="Add new highlight"
                        value={newHighlight}
                        onChange={(e) => setNewHighlight(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addHighlight()}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <button
                        onClick={addHighlight}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {editData.highlights.map((highlight, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600"
                        >
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="text-green-500 flex-shrink-0" size={16} />
                            <input
                              type="text"
                              value={highlight}
                              onChange={(e) => {
                                const newHighlights = [...editData.highlights];
                                newHighlights[index] = e.target.value;
                                setEditData({ ...editData, highlights: newHighlights });
                              }}
                              className="flex-1 bg-transparent border-none focus:outline-none text-gray-700 dark:text-gray-300"
                            />
                          </div>
                          <button
                            onClick={() => removeHighlight(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                    {about.description}
                  </p>

                  <div className="space-y-4">
                    {about.highlights.map((highlight, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        className="flex items-center space-x-3"
                      >
                        <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                        <span className="text-gray-700 dark:text-gray-300">{highlight}</span>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="relative"
            >
              <div className="relative z-10">
                <img
                  src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Profile"
                  className="rounded-2xl shadow-2xl w-full h-96 object-cover"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl -z-10"></div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;