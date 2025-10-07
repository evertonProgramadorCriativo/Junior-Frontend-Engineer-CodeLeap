import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useUserProfile } from '../../contexts/UserProfileContext';
import Button from '../ui/Button/Button';
import { Input } from '../ui/Input/Input';
import AvatarUpload from '../ui/AvatarUpload/AvatarUpload';
 
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaBirthdayCake, FaSave } from 'react-icons/fa';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user } = useAuth();
  const { userProfile, saveProfile, isProfileComplete } = useUserProfile();
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    address: '',
    email: '',
    avatar: null
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Load profile data when component mounts or profile changes
  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        age: userProfile.age || '',
        address: userProfile.address || '',
        email: userProfile.email || '',
        avatar: userProfile.avatar || null
      });
      
      // Auto-enable editing if profile is not complete
      if (!isProfileComplete(userProfile)) {
        setIsEditing(true);
      }
    }
  }, [userProfile, isProfileComplete]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (avatarUrl) => {
    console.log('Avatar changed:', avatarUrl);
    
    setFormData(prev => ({
      ...prev,
      avatar: avatarUrl
    }));
    
    // Auto-save avatar immediately
    saveProfile(user, {
      ...formData,
      avatar: avatarUrl
    });
    
    setSaveMessage('Foto de perfil atualizada!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    if (!formData.name.trim() || !formData.age || 
        !formData.address.trim() || !formData.email.trim()) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Por favor, insira um email válido');
      return;
    }

    // Validate age
    if (formData.age < 1 || formData.age > 120) {
      alert('Por favor, insira uma idade válida');
      return;
    }

    // Save profile
    saveProfile(user, formData);
    setIsEditing(false);
    setSaveMessage('Perfil salvo com sucesso!');
    
    // Clear success message after 3 seconds
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleCancel = () => {
    // Reset form to current profile data
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        age: userProfile.age || '',
        address: userProfile.address || '',
        email: userProfile.email || '',
        avatar: userProfile.avatar || null
      });
    }
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <h2>Access Denied</h2>
          <p>You need to be logged in to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <AvatarUpload
            currentAvatar={formData.avatar}
            onAvatarChange={handleAvatarChange}
            size={120}
            editable={true}
          />
          <h1>{user}'s Profile</h1>
          {!isProfileComplete(userProfile) && (
            <p className="incomplete-warning">Complete your profile to continue</p>
          )}
        </div>

        {saveMessage && (
          <div className="save-message success">
            {saveMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="name">
              <FaUser /> Full Name
            </label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="John Smith"
              disabled={!isEditing}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">
              <FaBirthdayCake /> Age
            </label>
            <Input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="25"
              min="1"
              max="120"
              disabled={!isEditing}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope /> Email
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
              disabled={!isEditing}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">
              <FaMapMarkerAlt /> Address
            </label>
            <Input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="123 Main St - City, State"
              disabled={!isEditing}
              required
            />
          </div>

          <div className="profile-actions">
            {isEditing ? (
              <>
                <Button type="submit" variant="success">
                  <FaSave /> Save Profile
                </Button>
                {isProfileComplete(userProfile) && (
                  <Button type="button" variant="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                )}
              </>
            ) : (
              <Button type="button" variant="primary" onClick={() => setIsEditing(true)}>
                
            <Link
            to="/users"
            className='nav-link-profile'
          >
             Edit Profile
          </Link>
              </Button>
            )}
          </div>
        </form>

        {userProfile?.updatedAt && (
          <div className="profile-footer">
            <small>
              Last updated: {new Date(userProfile.updatedAt).toLocaleString('en-US')}
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;