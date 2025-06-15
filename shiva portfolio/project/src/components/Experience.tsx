import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Briefcase, Calendar, Plus, Trash2, Edit3, Save, X } from 'lucide-react';
import { portfolioConfig } from '../config/portfolio';
import { useAdmin } from '../contexts/AdminContext';

interface ExperienceItem {
  company: string;
  position: string;
  duration: string;
  description: string;
  achievements: string[];
}

const Experience: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { isAdmin } = useAdmin();
  const [experience, setExperience] = useState(portfolioConfig.experience);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newExperience, setNewExperience] = useState<ExperienceItem>({
    company: '',
    position: '',
    duration: '',
    description: '',
    achievements: []
  });
  const [newAchievement, setNewAchievement] = useState('');

  const addExperience = () => {
    if (newExperience.company && newExperience.position && newExperience.duration) {
      const updatedExperience = {
        ...experience,
        items: [...experience.items, newExperience]
      };
      setExperience(updatedExperience);
      setNewExperience({
        company: '',
        position: '',
        duration: '',
        description: '',
        achievements: []
      });
      setShowAddForm(false);
    }
  };

  const removeExperience = (index: number) => {
    const updatedExperience = {
      ...experience,
      items: experience.items.filter((_, i) => i !== index)
    };
    setExperience(updatedExperience);
  };

  const updateExperience = (index: number, updatedItem: ExperienceItem) => {
    const updatedExperience = {
      ...experience,
      items: experience.items.map((item, i) => i === index ? updatedItem : item)
    };
    setExperience(updatedExperience);
    setEditingIndex(null);
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setNewExperience({
        ...newExperience,
        achievements: [...newExperience.achievements, newAchievement.trim()]
      });
      setNewAchievement('');
    }
  };

  const removeAchievement = (index: number) => {
    setNewExperience({
      ...newExperience,
      achievements: newExperience.achievements.filter((_, i) => i !== index)
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
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section id="experience" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className="flex items-center justify-center mb-16">
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              {experience.title}
            </motion.h2>
            {isAdmin && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddForm(true)}
                className="ml-4 p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus size={24} />
              </motion.button>
            )}
          </div>

          {/* Add Experience Form */}
          {showAddForm && isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg"
            >
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Add New Experience</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Company Name"
                  value={newExperience.company}
                  onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Position"
                  value={newExperience.position}
                  onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <input
                type="text"
                placeholder="Duration (e.g., 2023 - Present)"
                value={newExperience.duration}
                onChange={(e) => setNewExperience({ ...newExperience, duration: e.target.value })}
                className="w-full mb-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <textarea
                placeholder="Job Description"
                value={newExperience.description}
                onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                rows={3}
                className="w-full mb-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              
              {/* Achievements */}
              <div className="mb-4">
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add achievement"
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addAchievement()}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={addAchievement}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {newExperience.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-2"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">{achievement}</span>
                      <button
                        onClick={() => removeAchievement(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={addExperience}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Add Experience
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 to-purple-600"></div>

              {experience.items.map((exp, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative flex items-start mb-12 last:mb-0"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-6 w-4 h-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"></div>

                  {/* Content */}
                  <div className="ml-20 bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 w-full relative group">
                    {isAdmin && (
                      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => setEditingIndex(index)}
                          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => removeExperience(index)}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}

                    {editingIndex === index ? (
                      <EditExperienceForm
                        experience={exp}
                        onSave={(updatedExp) => updateExperience(index, updatedExp)}
                        onCancel={() => setEditingIndex(null)}
                      />
                    ) : (
                      <>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                              {exp.position}
                            </h3>
                            <div className="flex items-center text-blue-600 mb-2">
                              <Briefcase size={16} className="mr-2" />
                              <span className="font-medium">{exp.company}</span>
                            </div>
                          </div>
                          <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <Calendar size={16} className="mr-2" />
                            <span>{exp.duration}</span>
                          </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                          {exp.description}
                        </p>

                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Key Achievements:</h4>
                          {exp.achievements.map((achievement, achIndex) => (
                            <div key={achIndex} className="flex items-start">
                              <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-gray-600 dark:text-gray-300 text-sm">{achievement}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Edit Experience Form Component
const EditExperienceForm: React.FC<{
  experience: ExperienceItem;
  onSave: (exp: ExperienceItem) => void;
  onCancel: () => void;
}> = ({ experience, onSave, onCancel }) => {
  const [editExp, setEditExp] = useState(experience);
  const [newAchievement, setNewAchievement] = useState('');

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setEditExp({
        ...editExp,
        achievements: [...editExp.achievements, newAchievement.trim()]
      });
      setNewAchievement('');
    }
  };

  const removeAchievement = (index: number) => {
    setEditExp({
      ...editExp,
      achievements: editExp.achievements.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          value={editExp.company}
          onChange={(e) => setEditExp({ ...editExp, company: e.target.value })}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Company"
        />
        <input
          type="text"
          value={editExp.position}
          onChange={(e) => setEditExp({ ...editExp, position: e.target.value })}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Position"
        />
      </div>
      <input
        type="text"
        value={editExp.duration}
        onChange={(e) => setEditExp({ ...editExp, duration: e.target.value })}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        placeholder="Duration"
      />
      <textarea
        value={editExp.description}
        onChange={(e) => setEditExp({ ...editExp, description: e.target.value })}
        rows={3}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        placeholder="Description"
      />
      
      {/* Achievements */}
      <div>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            placeholder="Add achievement"
            value={newAchievement}
            onChange={(e) => setNewAchievement(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addAchievement()}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            onClick={addAchievement}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            Add
          </button>
        </div>
        <div className="space-y-2">
          {editExp.achievements.map((achievement, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-2"
            >
              <span className="text-sm text-gray-700 dark:text-gray-300">{achievement}</span>
              <button
                onClick={() => removeAchievement(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => onSave(editExp)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
        >
          <Save size={16} />
          <span>Save</span>
        </button>
        <button
          onClick={onCancel}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
        >
          <X size={16} />
          <span>Cancel</span>
        </button>
      </div>
    </div>
  );
};

export default Experience;