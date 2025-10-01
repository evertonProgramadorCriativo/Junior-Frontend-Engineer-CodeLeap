import { useState, useCallback } from 'react';
import api from '../services/api';

export const usePosts = () => {
  // State management for posts, loading, and errors
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
    setLoading(true);
    try {
      const newPost = await api.createPost(postData);
      // Add new post and maintain sort order
      setPosts(prevPosts => {
        const updatedPosts = [newPost, ...prevPosts];
        return updatedPosts.sort(
          (a, b) => new Date(b.created_datetime) - new Date(a.created_datetime)
        );
      });
      return newPost;
    } catch (err) {
      throw new Error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update existing post with optimistic UI
  const updatePost = useCallback(async (id, postData) => {
    setLoading(true);
    
    // Save previous state for potential rollback
    let previousPosts = posts;
    
    try {
      // Optimistic update - update immediately
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === id ? { ...post, ...postData } : post
        )
      );

      const updatedPost = await api.updatePost(id, postData);
      
      // Update with server data (for calculated fields)
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === id ? { ...post, ...updatedPost } : post
        )
      );
      
      return updatedPost;
    } catch (err) {
      // Revert to previous state on error
      setPosts(previousPosts);
      throw new Error(err.message);
    } finally {
      setLoading(false);
    }
  }, [posts]);

  // Delete post with optimistic UI
  const deletePost = useCallback(async (id) => {
    setLoading(true);
    
    // Save deleted post for potential rollback
    let postToDelete = posts.find(post => post.id === id);
    
    try {
      // Optimistic update - remove immediately
      setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
      
      await api.deletePost(id);
    } catch (err) {
      // Revert on error
      if (postToDelete) {
        setPosts(prevPosts => {
          const restoredPosts = [...prevPosts, postToDelete];
          return restoredPosts.sort(
            (a, b) => new Date(b.created_datetime) - new Date(a.created_datetime)
          );
        });
      }
      throw new Error(err.message);
    } finally {
      setLoading(false);
    }
  }, [posts]);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
  };
};