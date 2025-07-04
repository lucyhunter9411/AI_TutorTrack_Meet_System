'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import API from '../../utils/api';
import MeetingCard from './MeetingCard';
import CreateMeetingForm from './CreateMeetingForm';

interface Meeting {
  _id: string;
  title: string;
  description: string;
  scheduledTime: string;
  duration: number;
  status: string;
  tutorId: {
    _id: string;
    email: string;
    role: string;
  };
  studentId?: {
    _id: string;
    email: string;
    role: string;
  };
}

export default function MeetingsList() {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const endpoint = user?.role === 'tutor' ? '/meetings/my-meetings' : '/meetings';
      const response = await API.get(endpoint);
      setMeetings(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch meetings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMeetings();
    }
  }, [user]);

  const handleDeleteMeeting = async (meetingId: string) => {
    try {
      await API.delete(`/meetings/${meetingId}`);
      fetchMeetings(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete meeting');
    }
  };

  const handleMeetingCreated = () => {
    setShowCreateForm(false);
    fetchMeetings(); // Refresh the list
  };

  if (loading) {
    return <div className="loading">Loading meetings...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="meetings-list">
      <div className="meetings-header">
        <h2>
          {user?.role === 'tutor' ? 'My Meetings' : 'All Available Meetings'}
        </h2>
        
        {user?.role === 'tutor' && (
          <button 
            className="add-meeting-btn"
            onClick={() => setShowCreateForm(true)}
          >
            + Create Meeting
          </button>
        )}
      </div>

      {showCreateForm && (
        <div className="create-meeting-overlay">
          <CreateMeetingForm
            onMeetingCreated={handleMeetingCreated}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      {meetings.length === 0 ? (
        <div className="no-meetings">
          <p>
            {user?.role === 'tutor' 
              ? 'You haven\'t created any meetings yet.' 
              : 'No meetings available at the moment.'
            }
          </p>
        </div>
      ) : (
        <div className="meetings-grid">
          {meetings.map((meeting) => (
            <MeetingCard
              key={meeting._id}
              meeting={meeting}
              onDelete={handleDeleteMeeting}
              showDeleteButton={user?.role === 'tutor'}
            />
          ))}
        </div>
      )}
    </div>
  );
} 