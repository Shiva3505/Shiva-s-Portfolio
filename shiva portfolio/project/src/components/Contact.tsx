import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Edit3, Save, X } from 'lucide-react';
import { portfolioConfig } from '../config/portfolio';
import { useAdmin } from '../contexts/AdminContext';
import emailjs from '@emailjs/browser';

const Contact: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { isAdmin } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    title: "Get In Touch",
    subtitle: "Let's Connect",
    description: "I'm always interested in new opportunities and exciting projects. Whether you have a question or just want to say hi, feel free to reach out!",
    email: portfolioConfig.email,
    phone: portfolioConfig.phone,
    location: portfolioConfig.location
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // EmailJS configuration
      const serviceId = 'service_portfolio'; // You'll need to set this up
      const templateId = 'template_contact'; // You'll need to set this up
      const publicKey = 'your_public_key'; // You'll need to set this up

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        to_email: 'shiva03505@gmail.com',
        message: formData.message,
        reply_to: formData.email,
      };

      // For demo purposes, we'll simulate sending an email
      // In production, you would use:
      // await emailjs.send(serviceId, templateId, templateParams, publicKey);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo, we'll show success and log the email data
      console.log('Email would be sent to: shiva03505@gmail.com');
      console.log('Email content:', templateParams);
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Show success message for 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
      
    } catch (error) {
      console.error('Failed to send email:', error);
      setSubmitStatus('error');
      
      // Show error message for 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const saveContactInfo = () => {
    setIsEditing(false);
    // In a real app, you would save this to your backend/config
  };

  const cancelEdit = () => {
    setContactInfo({
      title: "Get In Touch",
      subtitle: "Let's Connect",
      description: "I'm always interested in new opportunities and exciting projects. Whether you have a question or just want to say hi, feel free to reach out!",
      email: portfolioConfig.email,
      phone: portfolioConfig.phone,
      location: portfolioConfig.location
    });
    setIsEditing(false);
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
    <section id="contact" className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
              {isEditing ? (
                <input
                  type="text"
                  value={contactInfo.title}
                  onChange={(e) => setContactInfo({ ...contactInfo, title: e.target.value })}
                  className="bg-transparent border-b-2 border-blue-600 focus:outline-none text-center"
                />
              ) : (
                contactInfo.title
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

          {/* Admin Edit Panel */}
          {isEditing && isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
            >
              <div className="flex justify-end space-x-4 mb-4">
                <button
                  onClick={saveContactInfo}
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
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={contactInfo.title}
                    onChange={(e) => setContactInfo({ ...contactInfo, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={contactInfo.subtitle}
                    onChange={(e) => setContactInfo({ ...contactInfo, subtitle: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={contactInfo.location}
                    onChange={(e) => setContactInfo({ ...contactInfo, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={contactInfo.description}
                    onChange={(e) => setContactInfo({ ...contactInfo, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Information */}
            <motion.div variants={itemVariants} className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                  {contactInfo.subtitle}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                  {contactInfo.description}
                </p>
              </div>

              <div className="space-y-6">
                <motion.div
                  whileHover={{ x: 10 }}
                  className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
                >
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                    <Mail className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">Email</h4>
                    <p className="text-gray-600 dark:text-gray-300">{contactInfo.email}</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 10 }}
                  className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
                >
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                    <Phone className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">Phone</h4>
                    <p className="text-gray-600 dark:text-gray-300">{contactInfo.phone}</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 10 }}
                  className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
                >
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                    <MapPin className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">Location</h4>
                    <p className="text-gray-600 dark:text-gray-300">{contactInfo.location}</p>
                  </div>
                </motion.div>
              </div>

              <div className="flex space-x-4 pt-6">
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
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                      placeholder="Your Name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                      placeholder="Your message..."
                    />
                  </div>

                  {/* Status Messages */}
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                    >
                      <p className="text-green-700 dark:text-green-300 text-sm">
                        ✅ Message sent successfully! I'll get back to you soon.
                      </p>
                    </motion.div>
                  )}

                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                    >
                      <p className="text-red-700 dark:text-red-300 text-sm">
                        ❌ Failed to send message. Please try again or email me directly.
                      </p>
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className="w-full flex items-center justify-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        <span>Send Message</span>
                      </>
                    )}
                  </motion.button>

                  {/* Demo Notice */}
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      📧 Messages will be sent to: {contactInfo.email}
                    </p>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;