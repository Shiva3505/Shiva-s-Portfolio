import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Github, Plus, Trash2, Edit3 } from 'lucide-react';
import { portfolioConfig } from '../config/portfolio';
import { useAdmin } from '../contexts/AdminContext';

interface Project {
  title: string;
  description: string;
  technologies: string[];
  image: string;
  github: string;
  demo: string;
}

const Projects: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { isAdmin } = useAdmin();
  const [projects, setProjects] = useState(portfolioConfig.projects);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProject, setNewProject] = useState<Project>({
    title: '',
    description: '',
    technologies: [],
    image: '',
    github: '',
    demo: ''
  });
  const [newTech, setNewTech] = useState('');

  const addProject = () => {
    if (newProject.title && newProject.description) {
      const updatedProjects = {
        ...projects,
        items: [...projects.items, newProject]
      };
      setProjects(updatedProjects);
      setNewProject({
        title: '',
        description: '',
        technologies: [],
        image: '',
        github: '',
        demo: ''
      });
      setShowAddForm(false);
    }
  };

  const removeProject = (index: number) => {
    const updatedProjects = {
      ...projects,
      items: projects.items.filter((_, i) => i !== index)
    };
    setProjects(updatedProjects);
  };

  const addTechnology = () => {
    if (newTech.trim()) {
      setNewProject({
        ...newProject,
        technologies: [...newProject.technologies, newTech.trim()]
      });
      setNewTech('');
    }
  };

  const removeTechnology = (index: number) => {
    setNewProject({
      ...newProject,
      technologies: newProject.technologies.filter((_, i) => i !== index)
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

  const projectVariants = {
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
    <section id="projects" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className="flex items-center justify-center mb-16">
            <motion.h2
              variants={projectVariants}
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              {projects.title}
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

          {/* Add Project Form */}
          {showAddForm && isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl"
            >
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Add New Project</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Project Title"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newProject.image}
                  onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="GitHub URL"
                  value={newProject.github}
                  onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Demo URL"
                  value={newProject.demo}
                  onChange={(e) => setNewProject({ ...newProject, demo: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <textarea
                placeholder="Project Description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                rows={3}
                className="w-full mt-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              
              {/* Technologies */}
              <div className="mt-4">
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add technology"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTechnology()}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={addTechnology}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    Add Tech
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newProject.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm flex items-center space-x-1"
                    >
                      <span>{tech}</span>
                      <button
                        onClick={() => removeTechnology(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={addProject}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Add Project
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {projects.items.map((project, index) => (
              <motion.div
                key={project.title}
                variants={projectVariants}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group relative"
              >
                {isAdmin && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => removeProject(index)}
                    className="absolute top-4 right-4 z-10 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                )}

                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium border border-blue-200 dark:border-blue-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-4">
                    <motion.a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors duration-200 text-sm"
                    >
                      <Github size={16} />
                      <span>Code</span>
                    </motion.a>
                    <motion.a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm"
                    >
                      <ExternalLink size={16} />
                      <span>Demo</span>
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;