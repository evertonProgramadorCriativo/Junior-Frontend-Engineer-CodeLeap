import React, { createContext, useContext, useState, useCallback } from 'react';

const UserProfileContext = createContext();
const profileDatabase = new Map();

export const UserProfileProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  // Update the list of all users (MOVED TO TOP)
  const updateAllUsersList = useCallback(() => {
    const users = Array.from(profileDatabase.values());
    setAllUsers(users);
  }, []);

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
    
    updateAllUsersList();
  }, [updateAllUsersList]); // 

  // Save or update user profile
  const saveProfile = useCallback((username, profileData) => {
    const updatedProfile = {
      ...profileData,
      username: username,
      updatedAt: new Date().toISOString()
    };
    
    profileDatabase.set(username, updatedProfile);
    setUserProfile(updatedProfile);
    
    updateAllUsersList();
    
    return updatedProfile;
  }, [updateAllUsersList]); 

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
  }, [updateAllUsersList]); 

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

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};