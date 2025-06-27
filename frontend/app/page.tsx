'use client';

import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import UserDashboard from './components/UserDashboard';
import styles from './page.module.css';

export default function Home() {
  const { user, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  if (loading) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <h1>Loading...</h1>
        </main>
      </div>
    );
  }

  if (user) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <UserDashboard />
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>AI TutorTrack Meet System</h1>
        <p>Welcome to the comprehensive tutoring and meeting management system</p>
        
        <div className="auth-container">
          <div className="auth-tabs">
            <button 
              className={`tab ${showLogin ? 'active' : ''}`}
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
            <button 
              className={`tab ${!showLogin ? 'active' : ''}`}
              onClick={() => setShowLogin(false)}
            >
              Register
            </button>
          </div>
          
          <div className="auth-content">
            {showLogin ? <LoginForm /> : <RegisterForm />}
          </div>
        </div>
      </main>
    </div>
  );
}
