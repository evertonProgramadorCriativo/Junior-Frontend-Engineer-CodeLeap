import React, { useState, useEffect } from 'react';
import './UsersPage.css';
import { FaUser, FaBirthdayCake, FaEnvelope, FaMapMarkerAlt, FaSpinner, FaEdit, FaTrash } from 'react-icons/fa';
import { useUserProfile } from '../../contexts/UserProfileContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button/Button';
import Modal from '../ui/Modal/Modal';
import { Input } from '../ui/Input/Input';
import AvatarUpload from '../ui/AvatarUpload/AvatarUpload';

const UsersPage = () => {
  const { allUsers, saveProfile, deleteProfile, isProfileComplete } = useUserProfile();
  const { user: currentUser } = useAuth();
  
  const [apiUsers, setApiUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    age: '',
    address: '',
    email: '',
    avatar: null
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://randomuser.me/api/?results=12');
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      
      const formattedUsers = data.results.map((user, index) => ({
        id: index + 1,
        name: `${user.name.first} ${user.name.last}`,
        age: user.dob.age,
        email: user.email,
        location: `${user.location.city}, ${user.location.country}`,
        image: user.picture.large,
        phone: user.phone,
        isApiUser: true
      }));

      setApiUsers(formattedUsers);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name || '',
      age: user.age || '',
      address: user.address || '',
      email: user.email || '',
      avatar: user.avatar || null
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (username) => {
    if (window.confirm(`Are you sure you want to delete ${username}'s profile?`)) {
      deleteProfile(username);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (avatarUrl) => {
    setEditFormData(prev => ({
      ...prev,
      avatar: avatarUrl
    }));
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    
    if (!editFormData.name.trim() || !editFormData.age || 
        !editFormData.address.trim() || !editFormData.email.trim()) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editFormData.email)) {
      alert('Por favor, insira um email válido');
      return;
    }

    if (editFormData.age < 1 || editFormData.age > 120) {
      alert('Por favor, insira uma idade válida');
      return;
    }

    saveProfile(selectedUser.username, editFormData);
    setIsEditModalOpen(false);
    setSelectedUser(null);
    alert('Perfil atualizado com sucesso!');
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

  // Filter only registered users with complete profiles
  const registeredUsers = allUsers.filter(u => isProfileComplete(u));

  return (
    <div className="users-page">
      <div className="users-header">
        <h1>
          <FaUser /> Users
        </h1>
      </div>

      {/* Registered Users Section */}
      {registeredUsers.length > 0 && (
        <div className="registered-users-section">
          <div className="section-header">
            <h2>Registered Users</h2>
            <p className="users-count">
              {registeredUsers.length} {registeredUsers.length === 1 ? 'user' : 'users'} registered
            </p>
          </div>

          <div className="modal-users-grid">
            {registeredUsers.map((user) => (
              <div key={user.username} className="user-card">
                <div className="user-card-image">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      <FaUser size={80} />
                    </div>
                  )}
                </div>
                
                <div className="user-card-content">
                  <div className="user-card-header">
                    <h3 className="user-name">{user.name}</h3>
                    {currentUser === user.username && (
                      <div className="user-actions">
                        <button
                          className="edit-user-btn"
                          onClick={() => handleEditUser(user)}
                          title="Edit profile"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          className="delete-user-btn"
                          onClick={() => handleDeleteUser(user.username)}
                          title="Delete profile"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="user-info">
                    <div className="user-info-item">
                      <FaUser className="info-icon" />
                      <span>@{user.username}</span>
                    </div>

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
                      <span>{user.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* API Users Section */}
      <div className="api-users-section">
        <div className="section-header">
          <h2>Community Users</h2>
          <p className="users-count">
            {apiUsers.length} {apiUsers.length === 1 ? 'user found' : 'users found'}
          </p>
        </div>
    
        <div className="users-grid">
          {apiUsers.map((user) => (
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
      <div className="modal-users-grid">
      <Modal  isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <div className="edit-user-modal">
          <h2>Edit User Profile</h2>
          
          <div className="modal-avatar-section">
            <AvatarUpload
              currentAvatar={editFormData.avatar}
              onAvatarChange={handleAvatarChange}
              size={100}
              editable={true}
            />
          </div>

          <form onSubmit={handleSaveEdit} className="edit-user-form">
            <div className="form-group">
              <label htmlFor="edit-name">
                <FaUser /> Full Name
              </label>
              <Input
                type="text"
                id="edit-name"
                name="name"
                value={editFormData.name}
                onChange={handleInputChange}
                placeholder="John Smith"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-age">
                <FaBirthdayCake /> Age
              </label>
              <Input
                type="number"
                id="edit-age"
                name="age"
                value={editFormData.age}
                onChange={handleInputChange}
                placeholder="25"
                min="1"
                max="120"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-email">
                <FaEnvelope /> Email
              </label>
              <Input
                type="email"
                id="edit-email"
                name="email"
                value={editFormData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-address">
                <FaMapMarkerAlt /> Address
              </label>
              <Input
                type="text"
                id="edit-address"
                name="address"
                value={editFormData.address}
                onChange={handleInputChange}
                placeholder="123 Main St - City, State"
                required
              />
            </div>

            <div className="modal-actions">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="success">
                <FaEdit /> Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal></div>
    </div>
  );
};

export default UsersPage;