import React, { useState, useEffect } from 'react';
import Layout from './components/layout/Layout';
import { useAuth } from './contexts/AuthContext';
import { usePosts } from './contexts/PostsContext';
import SignUpModal from './components/forms/SignUpModal/SignUpModal';
import CreatePostForm from './components/forms/CreatePostForm/CreatePostForm';
import PostCard from './components/posts/PostCard/PostCard';

function App() {
  // Authentication and state management
  const { user, signUp } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { posts, loading, error, fetchPosts, createPost } = usePosts();

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Log posts when they update
  useEffect(() => {
    console.log('Posts updated:', posts);
  }, [posts]);

  // Show signup modal if no user is logged in
  useEffect(() => {
    if (!user) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [user]);

  // Handle user signup and close modal
  const handleUserSignUp = (username) => {
    signUp(username);
    setIsModalOpen(false);
  };

  // Create new post with user data and timestamp
  const handleCreatePost = (postData) => {
    const postWithUser = {
      ...postData, // Form data (title and content)
      username: user, // Current user from auth
      created_datetime: new Date().toISOString()
    };
    
    console.log('Post created:', postWithUser);
    
    // Send to posts context
    createPost(postWithUser);
  };

  return (
    <Layout>
      {user ? (
        // Main app view when user is logged in
        <>
          <h1>Welcome, {user}!</h1>
          
          {/* Post creation form */}
          <CreatePostForm onCreatePost={handleCreatePost} />
          
          {/* Posts display section */}
          <div style={{ padding: '20px' }}>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            
            <h2>Posts:</h2>
            {posts.length > 0 ? (
              // Render all posts
              posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              !loading && <p>No posts yet. Create the first one!</p>
            )}
          </div>
        </>
      ) : (
        // Show signup modal when no user is logged in
        <SignUpModal 
          isOpen={isModalOpen} 
          onSignUp={handleUserSignUp}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </Layout>
  );
}

export default App;