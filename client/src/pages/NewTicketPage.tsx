import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";


function NewTicketPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const token = user?.token;
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(''); // Clear previous errors
    setIsLoading(true); // Start loading

    try {
      await api.post(
        '/tickets',
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTitle(''); // clear text ater submission
      setDescription(''); // clear text ater submission
      navigate('/'); // Go back to the Dashboard
    } catch (err: any) {
      console.error("Failed to submit ticket:", err);
      setSubmitError(err.response?.data?.message || 'Failed to submit ticket. Please try again.');
    } finally {
        setIsLoading(false); // End loading, whether success or fail
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "2rem auto",
        backgroundColor: "white",
        padding: "1.5rem",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "600",
          marginBottom: "1rem",
          color: "#111827",
        }}
      >
        Submit a New Tickect
      </h2>
      {submitError && (
        <p style={{ color: "#DC2626", marginBottom: "0.75rem" }}>
          {submitError}
        </p>
      )}
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
        <div>
            <label
              style={{ display: "block", fontSize: "0.875rem", fontWeight: 500 }}
            >
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                border: "1px solid #D1D5DB",
                borderRadius: "6px",
                marginTop: "0.25rem",
                fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
              }}
            />
        </div>
        <div>
            <label
              style={{ display: "block", fontSize: "0.875rem", fontWeight: 500 }}
            >
              Description
            </label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                border: "1px solid #D1D5DB",
                borderRadius: "6px",
                marginTop: "0.25rem",
                minHeight: "120px",
                resize: "vertical",
                fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
              }}
            />
        </div>
        <button
          type="submit"
          disabled={isLoading} // Disable button when loading
          style={{
            backgroundColor: isLoading ? "#3B82F6" : "#2563EB",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            fontWeight: 500,
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.7 : 1,
            transition: "background-color 0.2s ease",
          }}
          onMouseOver={(e) => {
            if (!isLoading)
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "#1D4ED8";
          }}
          onMouseOut={(e) => {
            if (!isLoading)
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "#2563EB";
          }}
        >
          {isLoading ? 'Submitting...' : 'Submit Ticket'}
          {/* Submit Ticket */}
        </button>
      </form>
    </div>
  );
}

export default NewTicketPage;