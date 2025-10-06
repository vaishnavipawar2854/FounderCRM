import { motion } from 'framer-motion';

const Badge = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  animated = true,
  className = '' 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variants = {
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    purple: 'bg-purple-100 text-purple-800',
    pink: 'bg-pink-100 text-pink-800',
    indigo: 'bg-indigo-100 text-indigo-800',
    gradient: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
    'gradient-success': 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white',
    'gradient-warning': 'bg-gradient-to-r from-amber-500 to-orange-600 text-white',
    'gradient-danger': 'bg-gradient-to-r from-red-500 to-pink-600 text-white',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };

  const badgeClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  const badgeContent = (
    <span className={badgeClasses}>
      {children}
    </span>
  );

  if (!animated) {
    return badgeContent;
  }

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.05 }}
    >
      {badgeContent}
    </motion.span>
  );
};

export default Badge;