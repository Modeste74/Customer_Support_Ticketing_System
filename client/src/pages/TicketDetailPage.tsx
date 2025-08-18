import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import  { motion } from "framer-motion";

interface Message {
  sender: string;
  message: string;
  timestamp: string;
}

interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: string;
  messages: Message[];
  createdAt: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
}

const POLL_INTERVAL_MS = 5000;

function TicketDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const token = user?.token;
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [reply, setReply] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [replyError, setReplyError] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [statusUpdateError, setStatusUpdateError] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchTicket = async () => {
	  setFetchError('');
      try {
        const res = await api.get(`/tickets/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTicket(res.data); // Update state with the fetched ticket data
      } catch (err: any) {
        console.error("Failed to load ticket:", err);
        // Set error message for display to the user
        setFetchError(err.response?.data?.message || 'Failed to load ticket details. Please try again.');
      } finally {
        setIsLoading(false);
      }
  };

  // Initial fetch
  useEffect(() => {
    // Only Fetch if a token and ID exist (user is authenticated and ID is available)
    if (token && id && user?._id) {
      setIsLoading(true);
      fetchTicket();
    } else if (!token) {
      setIsLoading(false);
      setFetchError('Authentication required to view ticket.');
    } else {
      setIsLoading(false)
      setFetchError('Ticket ID is missing.');
    }
  }, [id, token, user?._id]);

  // Polling for new messages
  useEffect(() => {
    if (!token || !id || !user?._id) return;
    const intervalId = setInterval(() => {
      fetchTicket();
    }, POLL_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [id, token, user?._id]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) {
      setReplyError('Reply cannot be empty.');
      return;
    }
    setIsSendingReply(true); // Set sending status to true
    setReplyError(''); // Clear any previous reply errors

    try {
      await api.put(
        `/tickets/${id}/reply`,
        { message: reply },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReply(''); // Clear the reply input field after successful submission
      await fetchTicket();
    } catch (err: any) {
      console.error("Failed to send reply:", err); // Log error for debugging
      setReplyError(err.response?.data?.message || 'Failed to send reply. Please try again.');
    } finally {
      setIsSendingReply(false);
	  }
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatusUpdateError(''); 
    setIsUpdatingStatus(true);

    try {
      const res = await api.put(
        `/tickets/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setTicket(res.data.ticket);
    } catch (err: any) {
      console.error("Failed to change status:", err);
      setStatusUpdateError(err.response?.data?.message || 'Failed to change status. Please try again.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // safe check for whether the message was sent the Logged-in user
  const isSender = (msgSender: string | {_id: string}) => {
    if (!user) return false;
    if (typeof msgSender === 'string') {
      return msgSender === user._id;
    }
    return msgSender?._id === user._id;
  };

  // --- Conditional Rendering for Loading and Errors ---
  if (isLoading) {
    return <p style={{ padding: "1rem", textAlign: "center" }}>Loading ticket details...</p>;
  }

  if (!user?._id) {
    return <p style={{ padding: "1 rem", textAlign: "center" }}>Authenticating user...</p>
  }

  if (fetchError) {
    return <p style={{ padding: '1rem', color: 'red', textAlign: 'center' }}>{fetchError}</p>
  }

  if (!ticket) return <p style={{ padding: "1rem", textAlign: "center" }}>Ticket not found.</p>;

  if (!ticket || !user) {
    return <p style={{ padding: "1rem", textAlign: "center" }}>Loading ticket details...</p>;
  }

  console.log('Logged-in user ID:', user?._id);
  console.log('Ticket object:', ticket);
  console.log('Ticket creator user object:', ticket?.user);
  console.log('Ticket creator ID (from ticket):', (ticket?.user as any)?._id || ticket?.user); // Try to get _id or the raw value
  console.log('Are IDs matching (ticket owner check)?', ticket?.user?._id === user?._id);
  console.log('Is user admin?', user?.role === 'admin');


  
  // Styling
  const containerStyle = {
    maxWidth: "768px",
    margin: "1rem auto",
    backgroundColor: "#fff",
    padding: "1.5rem",
    borderRadius: "0.5rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.88)",
    borderTop: "4px solid #3b82f6",
  };

  const titleStyle = {
    fontSize: "1.75rem",
    fontWeight: "700",
    color: "#1a202c",
    marginBottom: "0.5rem",
  };

  const infoStyle = {
    color: "#4a5568",
    fontSize: "0.95rem",
    marginBottom: "0.75rem",
  };

  const descriptionStyle = {
    marginBottom: "1rem",
    whiteSpace: "pre-line",
  };

  const messageContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  const messageBubble = (isSender: boolean) : React.CSSProperties => ({
    padding: "1rem",
    boxShadow: "0 1px 2px rbga(0,0,0,0.05)",
    borderRadius: "1rem",
    backgroundColor: isSender ? "#77be8bff" : "#9aa2aaff",
    maxWidth: "75%",
    alignSelf: isSender ? "flex-end" : "flex-start",
    textAlign: isSender ? "right" : "left",
    marginLeft: isSender ? "auto" : "unset",
    marginRight: isSender ? "unset" : "auto",
  });

  const messageMetaStyle = {
    fontSize: "0.75rem",
    color: "#6b7280",
  }

  // --- Main Component Render ---
  return (
    <div style={containerStyle}>
      {/* Display ticket basic information */}
      <h2 style={titleStyle}>{ticket.title}</h2>
      <p style={infoStyle}>Status:
        <span
          style={{
            textTransform: "capitalize",
            marginLeft: "0.5rem",
            padding: "0.25rem 0.75rem",
            borderRadius: "9999px",
            fontWeight: "600",
            fontSize: "0.8rem",
            backgroundColor: ticket.status === 'open' ? '#fffbeb' :
                       ticket.status === 'in progress' ? '#eff6ff' :
                       '#f3f4f6', // For closed
            color: ticket.status === 'open' ? '#92400e' :
                  ticket.status === 'in progress' ? '#1e40af' :
                  '#4b5563', // For closed
          }}>
            {ticket.status}
        </span>
      </p>

      {/* Status Update Section (Visible only to Admin or Ticket Owner) */}
      {/* Check if user is admin OR if user is the ticket creator */}
      {(user?.role === 'admin' || ticket.user._id === user?._id) && (
        <div className='mb-4'>
          <label
            htmlFor="status-select"
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '4px',
            }}
          >Update Status</label>
          <select
            id="status-select" // Add ID for accessibility
            value={ticket.status} // Controlled component: value reflects current ticket status
            onChange={handleStatusChange} // Call the new handler on change
            style={{
              display: 'block',
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginTop: '4px',
              fontSize: '14px',
              backgroundColor: isUpdatingStatus ? '#f3f3f3' : 'white',
              cursor: isUpdatingStatus ? 'not-allowed' : 'pointer',
            }}
            disabled={isUpdatingStatus} // Disable select while status is being updated
          >
            {/* Options for Admin: All statuses */}
            {user?.role === 'admin' ? (
              <>
                <option value="open">Open</option>
                <option value="in progress">In Progress</option>
                <option value="closed">Closed</option>
              </>
            ) : (
              // Options for Regular User (Ticket Owner): Only 'Closed'
              <>
                {/* Display current status if not 'closed' and user is not admin */}
                {ticket.status !== 'closed' && <option value={ticket.status} disabled>{ticket.status} (Current)</option>}
                <option value="closed">Close Ticket</option>
              </>
            )}
          </select>
          {statusUpdateError && <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>{statusUpdateError}</p>} {/* Display status update error */}
        </div>
      )}

      <p style={descriptionStyle}>{ticket.description}</p>

      {/* Message Section */}
      <h3
        style={{
          fontSize: '1.5rem',
          lineHeight: '28px',
          fontWeight: 600,
          marginTop: '2rem',
          marginBottom: '1rem',
          color: '#2d3748',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: '#e2e8f0',
          paddingBottom: '0.75rem'
        }}
        >
          Messages
        </h3>
      <div style={messageContainerStyle}>
        {/* Map through each message and display it */}
        {ticket.messages.map((msg, index) => (
          // Use a unique key for each message. If your backend provides a message._id, use that.
          // Otherwise, index can be used if messages are not reordered/deleted in the middle.
          
          <motion.div
            key={index} // Prefer msg._id if available, fallback to index
            style={messageBubble(isSender(msg.sender))}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <p style={{ fontSize: '0.9rem', lineHeight: '1.4', color: '#2d3748' }}>{msg.message}</p>
            <p style={messageMetaStyle}>
              Sent by {isSender(msg.sender) ? 'You' : 'Agent'} at {new Date(msg.timestamp).toLocaleString()}
            </p>
          </motion.div>
        ))}
        {/* Display message if no messages exist yet */}
        {ticket.messages.length === 0 && <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '20px' }}> No messages yet</p>}
      </div>

      {/* Reply Form */}
      <form onSubmit={handleReply} style={{ marginTop: '2rem' }}>
        {/* Display an error related to sending a reply */}
        {replyError && (
          <p style={{ color: '#ef4444', marginBottom: '0.5rem' }}>
            {replyError}
          </p>
        )}

        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Type your reply..."
          style={{
            width: '100%',
            border: '1px solid #cbd5e1',
            borderRadius: '0.375rem',
            padding: '0.75rem',
            marginBottom: '0.75rem',
            outline: 'none',
            resize: 'vertical',
            boxShadow: 'none',
            transition: 'all 0.2s ease-in-out',
            fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
            height: '100px',
            backgroundColor: isSendingReply ? '#f8fafc' : 'white',
            cursor: isSendingReply ? 'not-allowed' : 'auto',
          }}
          rows={3}
          disabled={isSendingReply}
          onFocus={(e) => {
            e.target.style.boxShadow = '0 0 0 2px #3b82f6';
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = 'none';
          }}
        ></textarea>

        <button
          type="submit"
          disabled={isSendingReply}
          style={{
            backgroundColor: '#2563eb',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: isSendingReply ? 'not-allowed' : 'pointer',
            opacity: isSendingReply ? 0.6 : 1,
            transition: 'all 0.2s ease-in-out',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
          onMouseOver={(e) => {
            if (!isSendingReply) {
              e.currentTarget.style.backgroundColor = '#1d4ed8';
            }
          }}
          onMouseOut={(e) => {
            if (!isSendingReply) {
              e.currentTarget.style.backgroundColor = '#2563eb';
            }
          }}
        >
          {isSendingReply ? 'Sending...' : 'Send Reply'}
        </button>
      </form>
    </div>
  );
}

export default TicketDetailPage;