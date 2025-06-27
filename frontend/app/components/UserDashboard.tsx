'use client';

import { useAuth } from '../contexts/AuthContext';

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
        <h3>Dashboard</h3>
        <p>You are logged in as a {getRoleDisplayName(user?.role || '')}.</p>
        
        {/* Role-specific content can be added here */}
        {user?.role === 'student' && (
          <div className="student-content">
            <h4>Student Features</h4>
            <ul>
              <li>View available tutoring sessions</li>
              <li>Book appointments with tutors</li>
              <li>Track your learning progress</li>
            </ul>
          </div>
        )}
        
        {user?.role === 'tutor' && (
          <div className="tutor-content">
            <h4>Tutor Features</h4>
            <ul>
              <li>Manage your tutoring sessions</li>
              <li>View student requests</li>
              <li>Update your availability</li>
            </ul>
          </div>
        )}
        
        {user?.role === 'admin' && (
          <div className="admin-content">
            <h4>Admin Features</h4>
            <ul>
              <li>Manage all users</li>
              <li>Monitor system activity</li>
              <li>Configure system settings</li>
            </ul>
          </div>
        )}
      </div>
      
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
} 