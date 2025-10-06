import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Button, Input } from './common';

const PasswordReset = () => {
  const [formData, setFormData] = useState({
    email: '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    // Validate password confirmation
    if (formData.new_password !== formData.confirm_password) {
      setMessage('New passwords do not match');
      setMessageType('error');
      setLoading(false);
      return;
    }
    
    try {
      await axios.post('http://localhost:8000/api/v1/auth/reset-password', {
        email: formData.email,
        current_password: formData.current_password,
        new_password: formData.new_password
      });
      
      setMessage('Password reset successfully!');
      setMessageType('success');
      setFormData({
        email: '',
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Error resetting password');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 font-display mb-2">Reset Password</h3>
          <p className="text-gray-600 text-sm">Update your account password</p>
        </div>

        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Enter your email"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          }
        />

        <Input
          label="Current Password"
          type="password"
          name="current_password"
          value={formData.current_password}
          onChange={handleChange}
          required
          placeholder="Enter current password"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
        />

        <Input
          label="New Password"
          type="password"
          name="new_password"
          value={formData.new_password}
          onChange={handleChange}
          required
          placeholder="Enter new password"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          }
        />

        <Input
          label="Confirm New Password"
          type="password"
          name="confirm_password"
          value={formData.confirm_password}
          onChange={handleChange}
          required
          placeholder="Confirm new password"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-xl border ${
                messageType === 'success'
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}
            >
              <div className="flex items-center">
                {messageType === 'success' ? (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {message}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>
    </motion.div>
  );
};

export default PasswordReset;