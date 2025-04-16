import React from 'react';

const Card = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  ...props
}) => {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-md overflow-hidden
        ${hoverable ? 'transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;