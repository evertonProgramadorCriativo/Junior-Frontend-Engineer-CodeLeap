import React, { createContext, useContext, useState } from 'react';

// Create Context for authentication
const AuthContext = createContext();

// Provider component to wrap the application
export const AuthProvider = ({ children }) => {
  // State to track current authenticated user
  const [user, setUser] = useState(null);

  // Register new user by setting username
  const signUp = (username) => {
    setUser(username);
  };

  // Clear current user (logout)
  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};