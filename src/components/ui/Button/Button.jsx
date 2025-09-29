import React from 'react';
import './Button.css';

const Button = ({ children, variant = 'primary', disabled = false, ...props }) => {
  return (
    <button
      className={`btn btn-${variant} ${disabled ? 'disabled' : ''}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;