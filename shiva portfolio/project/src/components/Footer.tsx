import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Edit3, Save, X } from 'lucide-react';
import { portfolioConfig } from '../config/portfolio';
import { useAdmin } from '../contexts/AdminContext';

const Footer: React.FC = () => {
  const { isAdmin } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [footerData, setFooterData] = useState({
    name: portfolioConfig.name,
    tagline: portfolioConfig.tagline
  });

  const saveFooterData = () => {
    setIsEditing(false);
    // In a real app, you would save this to your backend/config
  };

  const cancelEdit = () => {
    setFooterData({
      name: portfolioConfig.name,
      tagline: portfolioConfig.tagline
    });
    setIsEditing(false);
  };

  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-12">
      <div className="container mx-auto px-6">
        <div className="text-center">
          {/* Admin Edit Panel */}
          {isEditing && isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-6 bg-gray-800 dark:bg-gray-900 rounded-2xl shadow-lg max-w-md mx-auto"
            >
              <div className="flex justify-end space-x-4 mb-4">
                <button
                  onClick={saveFooterData}
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={footerData.name}
                    onChange={(e) => setFooterData({ ...footerData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tagline
                  </label>
                  <textarea
                    value={footerData.tagline}
                    onChange={(e) => setFooterData({ ...footerData, tagline: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {footerData.name}
              </h3>
              {isAdmin && !isEditing && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className="ml-4 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
                >
                  <Edit3 size={16} />
                </motion.button>
              )}
            </div>
            <p className="text-gray-400 max-w-md mx-auto">
              {footerData.tagline}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="border-t border-gray-800 pt-8"
          >
            <div className="flex items-center justify-center space-x-2 text-gray-400">
              <span>Made with</span>
              <Heart size={16} className="text-red-500 animate-pulse" />
              <span>by {footerData.name}</span>
            </div>
            <p className="text-gray-500 text-sm mt-2">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;