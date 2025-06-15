import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Plus, Trash2, Edit3, Save, X } from 'lucide-react';
import { portfolioConfig } from '../config/portfolio';
import { useAdmin } from '../contexts/AdminContext';

interface SkillCategory {
  name: string;
  skills: string[];
}

const Skills: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { isAdmin } = useAdmin();
  const [skills, setSkills] = useState(portfolioConfig.skills);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);

  const addNewSkillToCategory = (categoryIndex: number, skillName: string) => {
    if (skillName.trim()) {
      const updatedSkills = { ...skills };
      updatedSkills.categories[categoryIndex].skills.push(skillName.trim());
      setSkills(updatedSkills);
    }
  };

  const removeSkill = (categoryIndex: number, skillIndex: number) => {
    const updatedSkills = { ...skills };
    updatedSkills.categories[categoryIndex].skills.splice(skillIndex, 1);
    setSkills(updatedSkills);
  };

  const addNewCategory = () => {
    if (newCategoryName.trim()) {
      const updatedSkills = {
        ...skills,
        categories: [
          ...skills.categories,
          { name: newCategoryName.trim(), skills: [] }
        ]
      };
      setSkills(updatedSkills);
      setNewCategoryName('');
      setShowAddCategory(false);
    }
  };

  const removeCategory = (categoryIndex: number) => {
    const updatedSkills = {
      ...skills,
      categories: skills.categories.filter((_, i) => i !== categoryIndex)
    };
    setSkills(updatedSkills);
  };

  const updateCategoryName = (categoryIndex: number, newName: string) => {
    const updatedSkills = { ...skills };
    updatedSkills.categories[categoryIndex].name = newName;
    setSkills(updatedSkills);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const categoryVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const skillVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className="flex items-center justify-center mb-16">
            <motion.h2
              variants={categoryVariants}
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              {skills.title}
            </motion.h2>
            {isAdmin && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAdminPanel(!showAdminPanel)}
                className="ml-4 p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
              >
                <Edit3 size={24} />
              </motion.button>
            )}
          </div>

          {/* Admin Panel for Skills Management */}
          {showAdminPanel && isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Manage Skills & Categories</h3>
                <button
                  onClick={() => setShowAddCategory(!showAddCategory)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <Plus size={16} />
                  <span>Add Category</span>
                </button>
              </div>

              {/* Add New Category */}
              {showAddCategory && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Category name (e.g., Backend Development)"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addNewCategory()}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={addNewCategory}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowAddCategory(false)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
              {skills.categories.map((category, categoryIndex) => (
                <div key={category.name} className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) => updateCategoryName(categoryIndex, e.target.value)}
                      className="text-lg font-semibold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 text-gray-800 dark:text-white"
                    />
                    <button
                      onClick={() => removeCategory(categoryIndex)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  {/* Add new skill input */}
                  <div className="flex space-x-2 mb-4">
                    <input
                      type="text"
                      placeholder={`Add new ${category.name.toLowerCase()} skill`}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addNewSkillToCategory(categoryIndex, e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        addNewSkillToCategory(categoryIndex, input.value);
                        input.value = '';
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm"
                    >
                      Add
                    </button>
                  </div>

                  {/* Skills list with delete buttons */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <div
                        key={skill}
                        className="flex items-center justify-between bg-white dark:bg-gray-700 rounded-lg p-2 border border-gray-200 dark:border-gray-600"
                      >
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => {
                            const updatedSkills = { ...skills };
                            updatedSkills.categories[categoryIndex].skills[skillIndex] = e.target.value;
                            setSkills(updatedSkills);
                          }}
                          className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-700 dark:text-gray-300"
                        />
                        <button
                          onClick={() => removeSkill(categoryIndex, skillIndex)}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-200"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {skills.categories.map((category, categoryIndex) => (
              <motion.div
                key={category.name}
                variants={categoryVariants}
                className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
                    {category.name}
                  </h3>
                  {isAdmin && !showAdminPanel && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const skillName = prompt(`Add new skill to ${category.name}:`);
                        if (skillName) {
                          addNewSkillToCategory(categoryIndex, skillName);
                        }
                      }}
                      className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200"
                    >
                      <Plus size={16} />
                    </motion.button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill}
                      variants={skillVariants}
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-3 text-center border border-blue-100 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 relative group"
                    >
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {skill}
                      </span>
                      {isAdmin && !showAdminPanel && (
                        <motion.button
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          onClick={() => removeSkill(categoryIndex, skillIndex)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <Trash2 size={12} />
                        </motion.button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;