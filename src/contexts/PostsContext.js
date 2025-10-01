import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

// Create Context for posts management
const PostsContext = createContext();

// Provider component to wrap the application
export const PostsProvider = ({ children }) => {
  // State management for posts, loading status, and errors
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all posts from API
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getPosts();
      // Sort posts by most recent date
      const sortedPosts = data.results.sort(
        (a, b) => new Date(b.created_datetime) - new Date(a.created_datetime)
      );
      setPosts(sortedPosts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new post
  const createPost = useCallback(async (postData) => {
    try {
      await api.createPost(postData);
      await fetchPosts(); // Refresh posts list
    } catch (err) {
      throw new Error(err.message);
    }
  }, [fetchPosts]);

  // Update existing post
  const updatePost = useCallback(async (id, postData) => {
    try {
      await api.updatePost(id, postData);
      await fetchPosts(); // Refresh posts list
    } catch (err) {
      throw new Error(err.message);
    }
  }, [fetchPosts]);

  // Delete post
  const deletePost = useCallback(async (id) => {
    try {
      await api.deletePost(id);
      await fetchPosts(); // Refresh posts list
    } catch (err) {
      throw new Error(err.message);
    }
  }, [fetchPosts]);

  return (
    <PostsContext.Provider
      value={{
        posts,
        loading,
        error,
        fetchPosts,
        createPost,
        updatePost,
        deletePost,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};

// Custom hook to access posts context
export const usePosts = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
};