'use client';

import { useState } from 'react';
import API from '../../utils/api';

interface CreateMeetingFormProps {
  onMeetingCreated: () => void;
  onCancel: () => void;
}

export default function CreateMeetingForm({ onMeetingCreated, onCancel }: CreateMeetingFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [duration, setDuration] = useState(60); // Default 60 minutes
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await API.post('/meetings', {
        title,
        description,
        scheduledTime,
        duration,
      });
      
      setTitle('');
      setDescription('');
      setScheduledTime('');
      setDuration(60);
      onMeetingCreated();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create meeting');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-meeting-form">
      <h3>Create New Meeting</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Meeting Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter meeting title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Enter meeting description"
            rows={3}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="scheduledTime">Scheduled Time</label>
          <input
            id="scheduledTime"
            type="datetime-local"
            value={scheduledTime}
            onChange={e => setScheduledTime(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="duration">Duration</label>
          <select
            id="duration"
            value={duration}
            onChange={e => setDuration(Number(e.target.value))}
            required
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>1 hour</option>
            <option value={90}>1.5 hours</option>
            <option value={120}>2 hours</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? 'Creating...' : 'Create Meeting'}
          </button>
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
        </div>

        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
} 