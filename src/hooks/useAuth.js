import { useState } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);

  const signUp = (username) => {
    setUser(username);
  };

  const signOut = () => {
    setUser(null);
  };

  return {
    user,
    setUser, 
    signUp,
    signOut,
  };
};