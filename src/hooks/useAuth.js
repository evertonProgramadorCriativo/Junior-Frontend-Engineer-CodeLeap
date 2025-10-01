import { useState } from 'react';

export const useAuth = () => {
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

  return {
    user,
    setUser, // Direct state setter for user
    signUp,  // User registration function  
    signOut, // User logout function
  };
};