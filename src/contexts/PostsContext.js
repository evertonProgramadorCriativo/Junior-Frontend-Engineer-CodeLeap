import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

// Create Context for posts management
const PostsContext = createContext();

// Local storage for images (in-memory since localStorage is not supported)
const imageStore = new Map();

// Provider component to wrap the application
export const PostsProvider = ({ children }) => {
  // State management for posts, loading status, and errors
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all posts from API and merge with local images
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getPosts();
      
      // Merge API posts with locally stored images
      const postsWithImages = data.results.map(post => ({
        ...post,
        image: imageStore.get(post.id) || post.image || null
      }));
      
      // Sort posts by most recent date
      const sortedPosts = postsWithImages.sort(
        (a, b) => new Date(b.created_datetime) - new Date(a.created_datetime)
      );
      
      console.log('Posts fetched with images:', sortedPosts);
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
      console.log('Creating post with data:', postData);
      
      // Separate image from post data
      const { image, ...postDataWithoutImage } = postData;
      
      // Send post to API without image
      const newPost = await api.createPost(postDataWithoutImage);
      console.log('Post created in API:', newPost);
      
      // Store image locally if provided
      if (image) {
        imageStore.set(newPost.id, image);
        newPost.image = image;
        console.log('Image stored locally for post:', newPost.id);
      }
      
      await fetchPosts(); // Refresh posts list
    } catch (err) {
      throw new Error(err.message);
    }
  }, [fetchPosts]);

  // Update existing post
  const updatePost = useCallback(async (id, postData) => {
    try {
      console.log('Updating post:', id, postData);
      
      // Separate image from post data
      const { image, ...postDataWithoutImage } = postData;
      
      // Send update to API without image
      await api.updatePost(id, postDataWithoutImage);
      console.log('Post updated in API');
      
      // Update or remove image locally
      if (image) {
        imageStore.set(id, image);
        console.log('Image updated locally for post:', id);
      } else {
        imageStore.delete(id);
        console.log('Image removed locally for post:', id);
      }
      
      await fetchPosts(); // Refresh posts list
    } catch (err) {
      throw new Error(err.message);
    }
  }, [fetchPosts]);

  // Delete post
  const deletePost = useCallback(async (id) => {
    try {
      await api.deletePost(id);
      
      // Remove image from local storage
      imageStore.delete(id);
      console.log('Image removed from local storage for post:', id);
      
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