import React, { useState, useEffect } from 'react';
import Layout from './components/layout/Layout';
import { useAuth } from './hooks/useAuth';
import SignUpModal from './components/forms/SignUpModal/SignUpModal';
import { usePosts } from './hooks/usePosts';
import Button from './components/ui/Button/Button';
function App() {
  const { user, setUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {  posts, loading, error, fetchPosts, createPost } = usePosts();

  useEffect(() => {
    fetchPosts();
    // Check if user exists

    if (!user) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [user, fetchPosts]);

  const handleUserSignUp = (username) => {
    // saves the user or not
    
    setUser(username);
    setIsModalOpen(false);
  };

  const testCreatePost = async () => {
    try {
      const newPost = {
        username: "Edaurdo",
        title: "teste 01",
        content: "enviando teste poster"
      };
      await createPost(newPost);
      console.log(" CREATE funcionou!");
    } catch (err) {
      console.error(" CREATE falhou:", err);
    }
  };

  console.log(posts, loading, error);

  return (
    <Layout>
      {user ? (
        <h1>Welcome, {user}!</h1>
      ) : (
        <SignUpModal 
          isOpen={isModalOpen} 
          onSignUp={handleUserSignUp}
          onClose={() => setIsModalOpen(false)}
        />
      )}

       <div style={{ padding: '20px' }}>
         <Button variant="primary" onClick={testCreatePost}>
          Testar Apenas CREATE
        </Button>

      
        {loading && <p>Carregando...</p>}
        {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
        
        <h2>Posts Carregados:</h2>
        {posts.map(post => (
          <div key={post.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <small>ID: {post.id}</small>
          </div>
        ))}
      </div>
    </Layout>
  );
}

export default App;