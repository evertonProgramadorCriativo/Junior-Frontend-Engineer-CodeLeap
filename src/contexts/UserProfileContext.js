import React, { createContext, useContext, useState } from 'react';

// Create Context for user profile management
const UserProfileContext = createContext();

// In-memory database for user profiles
const profileDatabase = new Map();

// Provider component to wrap the application
export const UserProfileProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);

  // Load user profile from in-memory database when username changes
  const loadProfile = (username) => {
    if (!username) {
      setUserProfile(null);
      return;
    }

    const existingProfile = profileDatabase.get(username);
    if (existingProfile) {
      setUserProfile(existingProfile);
    } else {
      // Create default profile for new user
      const defaultProfile = {
        username: username,
        name: '',
        age: '',
        address: '',
        email: '',
        avatar: null,
        createdAt: new Date().toISOString()
      };
      profileDatabase.set(username, defaultProfile);
      setUserProfile(defaultProfile);
    }
  };

  // Save or update user profile
  const saveProfile = (username, profileData) => {
    const updatedProfile = {
      ...profileData,
      username: username,
      updatedAt: new Date().toISOString()
    };
    
    profileDatabase.set(username, updatedProfile);
    setUserProfile(updatedProfile);
    return updatedProfile;
  };

  // Get profile for specific user
  const getProfile = (username) => {
    return profileDatabase.get(username);
  };

  // Check if profile is complete
  const isProfileComplete = (profile) => {
    if (!profile) return false;
    return !!(profile.name && profile.age && profile.address && profile.email);
  };

  return (
    <UserProfileContext.Provider
      value={{
        userProfile,
        loadProfile,
        saveProfile,
        getProfile,
        isProfileComplete
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

// Custom hook to access user profile context
export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};