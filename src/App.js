import React, { useState, useEffect } from 'react';
import Layout from './components/layout/Layout';
import { useAuth } from './hooks/useAuth';
import SignUpModal from './components/forms/SignUpModal/SignUpModal';
import { usePosts } from './hooks/usePosts';
import CreatePostForm from './components/forms/CreatePostForm/CreatePostForm';

function App() {
  const { user, signUp } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { posts, loading, error, fetchPosts, createPost } = usePosts();

  useEffect(() => {
    fetchPosts();

  }, [fetchPosts]);

  useEffect(() => {
    console.log('Posts updated:', posts);
  }, [posts]);

  useEffect(() => {
    if (!user) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [user]);

  const handleUserSignUp = (username) => {
    signUp(username);
    setIsModalOpen(false);
  };

  // função recebe os dados do formulário
  const handleCreatePost = (postData) => {
    const postWithUser = {
      ...postData, // title e content do formulário
      username: user, //  usuário do useAuth
      created_datetime: new Date().toISOString()
    };
    
    console.log('Post criado:', postWithUser);
    
    // Envia para a API via usePosts hook
    createPost(postWithUser);
  };

  return (
    <Layout>
      {user ? (
        <>
          <h1>Welcome, {user}!</h1>
          
          {/*  Passa a função handleCreatePost como prop */}
          <CreatePostForm onCreatePost={handleCreatePost} />
          
          <div style={{ padding: '20px' }}>
            {loading && <p>Carregando...</p>}
            {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
            
            <h2>Posts:</h2>
            {posts.length > 0 ? (
              posts.map(post => (
                <div 
                  key={post.id} 
                  style={{ 
                    border: '1px solid #ccc', 
                    borderRadius: '8px',
                    margin: '10px 0', 
                    padding: '15px',
                    backgroundColor: '#f9f9f9'
                  }}
                >
                  <h3 style={{ margin: '0 0 10px 0' }}>{post.title}</h3>
                  <p style={{ margin: '0 0 10px 0' }}>{post.content}</p>
                  <small style={{ color: '#666' }}>
                    By: {post.username} | ID: {post.id}
                  </small>
                </div>
              ))
            ) : (
              !loading && <p>No posts yet. Create the first one!</p>
            )}
          </div>
        </>
      ) : (
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