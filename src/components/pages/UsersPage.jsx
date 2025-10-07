import React, { useState, useEffect } from 'react';
import './UsersPage.css';
import { FaUser, FaBirthdayCake, FaEnvelope, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Consuming Public User API (JSONPlaceholder + Random User API)
      const response = await fetch('https://randomuser.me/api/?results=12');
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      
      // Transforming API data into a suitable format
      const formattedUsers = data.results.map((user, index) => ({
        id: index + 1,
        name: `${user.name.first} ${user.name.last}`,
        age: user.dob.age,
        email: user.email,
        location: `${user.location.city}, ${user.location.country}`,
        image: user.picture.large,
        phone: user.phone
      }));

      setUsers(formattedUsers);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="users-page">
        <div className="loading-container">
          <FaSpinner className="spinner" size={48} />
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="users-page">
        <div className="error-container">
          <h2>Error loading users</h2>
          <p>{error}</p>
          <button onClick={fetchUsers} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="users-page">
      <div className="users-header">
        <h1>
          <FaUser /> Users
        </h1>
        <p className="users-count">
          {users.length} {users.length === 1 ? 'user found' : 'users found'}
        </p>
      </div>

      <div className="users-grid">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <div className="user-card-image">
              <img src={user.image} alt={user.name} />
            </div>
            
            <div className="user-card-content">
              <h3 className="user-name">{user.name}</h3>
              
              <div className="user-info">
                <div className="user-info-item">
                  <FaBirthdayCake className="info-icon" />
                  <span>{user.age} years</span>
                </div>
                
                <div className="user-info-item">
                  <FaEnvelope className="info-icon" />
                  <span>{user.email}</span>
                </div>
                
                <div className="user-info-item">
                  <FaMapMarkerAlt className="info-icon" />
                  <span>{user.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;