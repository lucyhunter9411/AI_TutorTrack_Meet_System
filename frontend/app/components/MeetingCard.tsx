'use client';

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

interface MeetingCardProps {
  meeting: Meeting;
  onDelete?: (id: string) => void;
  showDeleteButton?: boolean;
}

export default function MeetingCard({ meeting, onDelete, showDeleteButton = false }: MeetingCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) {
        return `${hours} hour${hours > 1 ? 's' : ''}`;
      } else {
        return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minutes`;
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="meeting-card">
      <div className="meeting-header">
        <h3 className="meeting-title">{meeting.title}</h3>
        <span className={`status-badge ${getStatusColor(meeting.status)}`}>
          {meeting.status}
        </span>
      </div>
      
      <div className="meeting-content">
        <p className="meeting-description">{meeting.description}</p>
        
        <div className="meeting-details">
          <div className="detail-item">
            <span className="detail-label">Scheduled:</span>
            <span className="detail-value">{formatDate(meeting.scheduledTime)}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Duration:</span>
            <span className="detail-value">{formatDuration(meeting.duration)}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Tutor:</span>
            <span className="detail-value">{meeting.tutorId.email}</span>
          </div>
          
          {meeting.studentId && (
            <div className="detail-item">
              <span className="detail-label">Student:</span>
              <span className="detail-value">{meeting.studentId.email}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="meeting-actions">
        <button className="join-btn">
          Join Meeting
        </button>
        
        {showDeleteButton && onDelete && (
          <button 
            className="delete-btn"
            onClick={() => onDelete(meeting._id)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
} 