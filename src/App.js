import React, { useState, useEffect } from 'react';
import Layout from './components/layout/Layout';
import { useAuth } from './hooks/useAuth';
import SignUpModal from './components/forms/SignUpModal/SignUpModal';


function App() {
  const { user, setUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Check if user exists
    if (!user) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [user]);

  const handleUserSignUp = (username) => {
    // saves the user or not
    
    setUser(username);
    setIsModalOpen(false);
  };

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
    </Layout>
  );
}

export default App;