import { motion } from 'framer-motion';
import { forwardRef } from 'react';

const Card = forwardRef(({ 
  children, 
  variant = 'default',
  padding = 'md',
  className = '',
  hover = true,
  animated = true,
  gradient = false,
  ...props 
}, ref) => {
  const baseClasses = 'bg-white border border-gray-100 transition-all duration-300';
  
  const variants = {
    default: 'rounded-2xl shadow-soft',
    elevated: 'rounded-2xl shadow-card',
    flat: 'rounded-xl border-2',
    glass: 'rounded-2xl bg-white bg-opacity-20 backdrop-blur-lg border border-white border-opacity-20',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const hoverClasses = hover ? 'hover:shadow-card-hover hover:-translate-y-1' : '';
  const gradientClasses = gradient ? 'bg-gradient-to-br from-white via-blue-50 to-purple-50' : '';
  
  const cardClasses = `${baseClasses} ${variants[variant]} ${paddings[padding]} ${hoverClasses} ${gradientClasses} ${className}`;

  const cardContent = (
    <div ref={ref} className={cardClasses} {...props}>
      {children}
    </div>
  );

  if (!animated) {
    return cardContent;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
    >
      {cardContent}
    </motion.div>
  );
});

Card.displayName = 'Card';

// Card Header component
const CardHeader = ({ children, className = '' }) => (
  <div className={`pb-4 border-b border-gray-100 ${className}`}>
    {children}
  </div>
);

// Card Body component
const CardBody = ({ children, className = '' }) => (
  <div className={`py-4 ${className}`}>
    {children}
  </div>
);

// Card Footer component
const CardFooter = ({ children, className = '' }) => (
  <div className={`pt-4 border-t border-gray-100 ${className}`}>
    {children}
  </div>
);

// Card Title component
const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-gray-900 font-display ${className}`}>
    {children}
  </h3>
);

// Card Description component
const CardDescription = ({ children, className = '' }) => (
  <p className={`text-gray-600 ${className}`}>
    {children}
  </p>
);

// Export all components
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Title = CardTitle;
Card.Description = CardDescription;

export default Card;