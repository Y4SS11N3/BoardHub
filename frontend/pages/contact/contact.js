import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send } from 'lucide-react';

const InputField = ({ label, name, type, value, onChange, error }) => (
  <div className="mb-6">
    <label htmlFor={name} className="block text-gray-300 text-sm font-bold mb-2">
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 text-gray-300 bg-gray-800 border rounded-lg focus:outline-none ${
        error ? 'border-red-500' : 'focus:border-indigo-500'
      }`}
    />
    {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
  </div>
);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Name is required";
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid";
    }
    if (!formData.subject.trim()) tempErrors.subject = "Subject is required";
    if (!formData.message.trim()) tempErrors.message = "Message is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Here you would typically send the form data to your backend
      console.log('Form submitted:', formData);
      // Reset form after submission
      setFormData({ name: '', email: '', subject: '', message: '' });
      alert('Thank you for your message. We will get back to you soon!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-gray-100 sm:text-5xl md:text-6xl">
            Get in Touch
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-1"
            >
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-100">Contact Information</h3>
                <p className="mt-1 text-sm text-gray-400">
                  Reach out to us through any of these means.
                </p>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center">
                    <MapPin className="h-6 w-6 text-indigo-400 mr-2" />
                    <span className="text-gray-300">Casablanca, TechnoPark</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-6 w-6 text-indigo-400 mr-2" />
                    <span className="text-gray-300">+212 612-345678</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-6 w-6 text-indigo-400 mr-2" />
                    <span className="text-gray-300">support@boardhub.com</span>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-5 md:mt-0 md:col-span-2"
            >
              <form onSubmit={handleSubmit} className="bg-gray-800 shadow-md rounded-lg p-6">
                <InputField
                  label="Name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                />
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                />
                <InputField
                  label="Subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  error={errors.subject}
                />
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-300 text-sm font-bold mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 text-gray-300 bg-gray-800 border rounded-lg focus:outline-none ${
                      errors.message ? 'border-red-500' : 'focus:border-indigo-500'
                    }`}
                  ></textarea>
                  {errors.message && <p className="text-red-500 text-xs italic mt-1">{errors.message}</p>}
                </div>
                <div className="flex items-center justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-full inline-flex items-center transition-colors duration-300 hover:bg-indigo-700"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    Send Message
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;