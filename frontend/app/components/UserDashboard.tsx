'use client';

import { useAuth } from '../contexts/AuthContext';
import MeetingsList from './MeetingsList';

export default function UserDashboard() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'student':
        return 'Student';
      case 'tutor':
        return 'Tutor';
      case 'admin':
        return 'Administrator';
      default:
        return role;
    }
  };

  return (
    <div className="user-dashboard">
      <div className="user-info">
        <h2>Welcome, {user?.email}!</h2>
        <p className="role-badge">Role: {getRoleDisplayName(user?.role || '')}</p>
      </div>
      
      <div className="dashboard-content">
        <MeetingsList />
      </div>
      
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
} 