import React from 'react';
import authStore from '../store/store';
import { Navigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const currentUser = authStore((state) => state.currentUser);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1 className="profile-title">My Profile</h1>
        <div className="profile-details">
          <div className="profile-field">
            <span className="field-label">Name:</span>
            <span className="field-value">{currentUser.name}</span>
          </div>
          <div className="profile-field">
            <span className="field-label">Email:</span>
            <span className="field-value">{currentUser.email}</span>
          </div>
          <div className="profile-field">
            <span className="field-label">Role:</span>
            <span className="field-value">{currentUser.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 