import React, { createContext, useContext, useState, useCallback } from 'react';

// Create Context for user profile management
const UserProfileContext = createContext();

// In-memory database for user profiles
const profileDatabase = new Map();

// Provider component to wrap the application
export const UserProfileProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  // Load user profile from in-memory database when username changes
  const loadProfile = useCallback((username) => {
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
    
    // Update all users list
    updateAllUsersList();
  }, []);

  // Save or update user profile
  const saveProfile = useCallback((username, profileData) => {
    const updatedProfile = {
      ...profileData,
      username: username,
      updatedAt: new Date().toISOString()
    };
    
    profileDatabase.set(username, updatedProfile);
    setUserProfile(updatedProfile);
    
    // Update all users list
    updateAllUsersList();
    
    return updatedProfile;
  }, []);

  // Update the list of all users
  const updateAllUsersList = useCallback(() => {
    const users = Array.from(profileDatabase.values());
    setAllUsers(users);
  }, []);

  // Get profile for specific user
  const getProfile = useCallback((username) => {
    return profileDatabase.get(username);
  }, []);

  // Get all registered users
  const getAllUsers = useCallback(() => {
    return Array.from(profileDatabase.values());
  }, []);

  // Check if profile is complete
  const isProfileComplete = useCallback((profile) => {
    if (!profile) return false;
    return !!(profile.name && profile.age && profile.address && profile.email);
  }, []);

  // Delete user profile
  const deleteProfile = useCallback((username) => {
    profileDatabase.delete(username);
    updateAllUsersList();
  }, []);

  return (
    <UserProfileContext.Provider
      value={{
        userProfile,
        allUsers,
        loadProfile,
        saveProfile,
        getProfile,
        getAllUsers,
        isProfileComplete,
        deleteProfile,
        updateAllUsersList
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