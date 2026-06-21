import React from 'react';

export const Button = ({ children, variant = 'primary', onClick, type = 'button', disabled = false, className = '', icon }) => {
  const getClassName = () => {
    switch (variant) {
      case 'primary': return 'btn btn-primary';
      case 'secondary': return 'btn btn-secondary';
      case 'danger': return 'btn btn-danger';
      case 'success': return 'btn btn-success';
      default: return 'btn btn-primary';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${getClassName()} ${className}`}
    >
      {icon && <i className={icon}></i>}
      {children}
    </button>
  );
};

export default Button;
