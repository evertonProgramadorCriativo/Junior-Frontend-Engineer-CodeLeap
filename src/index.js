import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './contexts/AuthContext';
import { PostsProvider } from './contexts/PostsContext';
import { UserProfileProvider } from './contexts/UserProfileContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <UserProfileProvider>
        <PostsProvider>
          <App />
        </PostsProvider>
      </UserProfileProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();