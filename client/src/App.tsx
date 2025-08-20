import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from "./components/ProtectedRoute";
import NewTicketPage from "./pages/NewTicketPage";
import TicketDetailPage from './pages/TicketDetailPage';


function App() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Routes>
          <Route path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ticket"
            element={
              <ProtectedRoute>
                <NewTicketPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets/:id"
            element={
              <ProtectedRoute>
                <TicketDetailPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </>
    
  );
}

export default App;
