import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

interface Ticket {
  _id: string;
  title: string;
  status: string;
  createdAt: string;
  user?: {
    name?: string;
    email?: string;
  };
}

const getStatusBadgeStyle = (status: string): React.CSSProperties => {
  const baseStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "0.25rem 0.75rem",
    fontSize: "0.75rem",
    fontWeight: 600,
    borderRadius: "9999px",
    textTransform: "uppercase",
    border: "1px solid transparent",
  };
  switch (status) {
    case "open":
      return { ...baseStyle, backgroundColor: "#d1fae5", color: "#065f46", borderColor: "#10b981" };
    case "in progress":
      return { ...baseStyle, backgroundColor: "#fef3c7", color: "#92400e", borderColor: "#f59e0b" };
    case "closed":
      return { ...baseStyle, backgroundColor: "#fee2e2", color: "#991b1b", borderColor: "#ef4444" };
    default:
      return { ...baseStyle, backgroundColor: "#f3f4f6", color: "#1f2937", borderColor: "#9ca3af" };
  }
};

const formatDate = (isoDate: string) => {
  return new Date(isoDate).toLocaleString();
};

function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const token = user?.token;
  if (!user || !token) {
    return (
      <div style={{ textAlign: 'center', padding: '2.5rem', color: '#4b5563' }}>
        Please log in to view your tickets.
      </div>
    );
  }
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 8;

  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true);
      setError('');
      try {
        const route = user?.role === 'admin' ? '/tickets/all' : '/tickets';

        const res = await api.get(route, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTickets(res.data);
      } catch (err: any) {
        console.error("Failed to fetch tickets:", err);
        setError(err.response?.data?.message || 'Failed to load tickets. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTickets();
  }, [token, user?.role]);

  

  const filteredTickets = tickets
    .filter((ticket) => statusFilter === 'all' || ticket.status === statusFilter)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const indexOfLast = currentPage * ticketsPerPage;
  const indexOfFirst = indexOfLast - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  return (
    <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '1.5rem' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937' }}>My Tickets</h1>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1); // Reset to page 1 on filter change
          }}
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            padding: '0.5rem 0.75rem',
            fontSize: '0.875rem',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          }}
        >
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="in progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {user?.role === 'admin' && (
        <p style={{ fontSize: '0.875rem', color: '#2563eb', marginBottom: '1rem' }}>Viewing all system tickets (admin)</p>
      )}

      {isLoading ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              style={{
                padding: '1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '1rem',
                backgroundColor: 'white',
                animation: 'pulse 1.5s infinte',
              }}
            >
              <div style={{ height: '1rem', backgroundColor: '#d1d5db', borderRadius: '0.25rem', width: '75%' }}></div>
              <div style={{ height: '0.75rem', backgroundColor: '#e5e7eb', borderRadius: '0.25rem', width: '50%', marginTop: '0.5rem' }}></div>
              <div style={{ height: '0.75rem', backgroundColor: '#e5e7eb', borderRadius: '0.25rem', width: '66%', marginTop: '0.5rem' }}></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p style={{ color: '#ef4444' }}>{error}</p>
      ) : currentTickets.length === 0 ? (
        <p style={{ color: '#4b5563' }}>No tickets submitted yet.</p>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {currentTickets.map((ticket) => (
              <div
                key={ticket._id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '0.75rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  padding: '1.25rem',
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <Link to={`/tickets/${ticket._id}`} className="flex flex-col h-full justify-between">
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem', color: '#1f2937' }}>
                      {ticket.title}
                    </h3>

                    {user?.role === 'admin' && ticket.user?.name && ticket.user?.email && (
                      <p style={{ fontSize: '0.75rem', color: '#4b5563', marginBottom: '0.25rem' }}>
                        Created by: {ticket.user.name} ({ticket.user.email})
                      </p>
                    )}

                    <span
                      style={{
                        ...getStatusBadgeStyle(ticket.status),
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        borderRadius: '9999px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {ticket.status === 'open' && '🟢'}
                      {ticket.status === 'in progress' && '🟡'}
                      {ticket.status === 'closed' && '🔴'}
                      {ticket.status}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                    Created: {formatDate(ticket.createdAt)}
                  </p>
                </Link>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem', gap: '0.5rem' }}>
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                disabled={currentPage === idx + 1}
                style={{
                  padding: '0.25rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  backgroundColor: currentPage === idx + 1 ? '#3b82f6' : 'white',
                  color: currentPage === idx + 1 ? 'white' : '#374151',
                  cursor: currentPage === idx + 1 ? 'not-allowed' : 'pointer',
                }}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );

}

export default Dashboard;