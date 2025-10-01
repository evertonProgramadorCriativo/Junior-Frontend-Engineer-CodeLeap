import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './contexts/AuthContext';      // NOVO
import { PostsProvider } from './contexts/PostsContext';    // NOVO

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>              {/* NOVO - Envolve tudo */}
      <PostsProvider>           {/* NOVO - Envolve tudo */}
        <App />
      </PostsProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();