import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useUserProfile } from '../../contexts/UserProfileContext';
import './Navigation.css';

const Navigation = () => {
  const { user, signOut } = useAuth();
  const { userProfile } = useUserProfile();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  if (!user) return null;

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            <FaHome /> Home
          </Link>

          <Link
            to="/profile"
            className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
          >
            <FaUser /> Perfil
          </Link>
          <Link
            to="/users"
            className={`nav-link ${isActive('/users') ? 'active' : ''}`}
          >
            <FaUsers /> Usuários
          </Link>
        </div>
        <div className="nav-user">
          {userProfile?.avatar ? (
            <img
              src={userProfile.avatar}
              alt={user}
              className="nav-avatar"
            />
          ) : (
            <div className="nav-avatar-placeholder">
              <FaUser size={16} />
            </div>
          )}
          <span className="user-name">{user}</span>
          <button onClick={signOut} className="nav-logout" title="Sair">
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;