import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Navigation from './components/navigation/Navigation';
import { useAuth } from './contexts/AuthContext';
import { usePosts } from './contexts/PostsContext';
import { useUserProfile } from './contexts/UserProfileContext';
import SignUpModal from './components/forms/SignUpModal/SignUpModal';
import CreatePostForm from './components/forms/CreatePostForm/CreatePostForm';
import PostCard from './components/posts/PostCard/PostCard';
import ProfilePage from './components/pages/ProfilePage';
import UsersPage from './components/pages/UsersPage';

// Home Page Component
function HomePage() {
  const { user } = useAuth();
  const { posts, loading, error, fetchPosts, createPost } = usePosts();

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Create new post with user data and timestamp
  const handleCreatePost = async (postData) => {
    const postWithUser = {
      ...postData,
      username: user,
      created_datetime: new Date().toISOString()
    };
    
    try {
      await createPost(postWithUser);
    } catch (err) {
      alert('Error creating post: ' + err.message);
    }
  };

  return (
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
          posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          !loading && <p>No posts yet. Create the first one!</p>
        )}
      </div>
    </>
  );
}

function App() {
  const { user, signUp } = useAuth();
  const { loadProfile } = useUserProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Show signup modal if no user is logged in
  useEffect(() => {
    if (!user) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
      // Load user profile when user logs in
      loadProfile(user);
    }
  }, [user, loadProfile]);

  // Handle user signup and close modal
  const handleUserSignUp = (username) => {
    signUp(username);
    setIsModalOpen(false);
  };

  return (
    <Router>
      <Layout>
        {user ? (
          <>
            <Navigation />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/users" element={<UsersPage />} /> 
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </>
        ) : (
          <SignUpModal 
            isOpen={isModalOpen} 
            onSignUp={handleUserSignUp}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </Layout>
    </Router>
  );
}

export default App;