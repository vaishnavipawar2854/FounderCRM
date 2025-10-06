import { motion } from 'framer-motion';
import { forwardRef, useState } from 'react';

const Input = forwardRef(({ 
  label,
  type = 'text',
  placeholder = '',
  error = '',
  icon = null,
  className = '',
  required = false,
  disabled = false,
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const baseClasses = 'block w-full bg-white border transition-all duration-200 focus:outline-none';
  const normalClasses = 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20';
  const errorClasses = 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-20';
  const disabledClasses = 'bg-gray-50 text-gray-500 cursor-not-allowed';
  
  const inputClasses = `
    ${baseClasses}
    ${error ? errorClasses : normalClasses}
    ${disabled ? disabledClasses : ''}
    ${icon ? 'pl-12' : 'px-4'}
    py-3 rounded-xl text-gray-900 placeholder-gray-500 shadow-sm
    ${className}
  `;

  return (
    <div className="space-y-2">
      {label && (
        <motion.label 
          className="block text-sm font-medium text-gray-700"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="h-5 w-5 text-gray-400">
              {icon}
            </div>
          </div>
        )}
        
        <motion.input
          ref={ref}
          type={type}
          className={inputClasses}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          {...props}
        />
        
        {/* Focus ring animation */}
        {isFocused && (
          <motion.div
            className="absolute inset-0 rounded-xl ring-2 ring-blue-500 ring-opacity-20 pointer-events-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          />
        )}
      </div>
      
      {error && (
        <motion.p 
          className="text-sm text-red-600"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;