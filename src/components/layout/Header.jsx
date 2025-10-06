import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Badge } from '../common';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <motion.header 
      className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-40"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and brand */}
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <motion.svg 
                className="w-6 h-6 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </motion.svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent font-display">
                Founder CRM
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                Startup Management Suite
              </p>
            </div>
          </motion.div>

          {/* User info and actions */}
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* User role badge */}
            <Badge 
              variant={user?.role === 'founder' ? 'gradient' : 'gradient-success'}
              size="md"
              className="shadow-sm"
            >
              {user?.role === 'founder' ? '👑 Founder' : '👥 Team Member'}
            </Badge>

            {/* User greeting */}
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium text-gray-900">
                Welcome back,
              </span>
              <span className="text-xs text-gray-600 font-medium">
                {user?.name}
              </span>
            </div>

            {/* User avatar */}
            <motion.div 
              className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </motion.div>

            {/* Logout button */}
            <Button
              onClick={logout}
              variant="danger"
              size="sm"
              className="shadow-md hover:shadow-lg transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Animated bottom border */}
      <motion.div
        className="h-1 bg-gradient-to-r from-blue-500 to-purple-600"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={{ transformOrigin: 'left' }}
      />
    </motion.header>
  );
};

export default Header;