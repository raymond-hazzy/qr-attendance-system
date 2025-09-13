// src/App.tsx - Verify your routing
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import QRCodePage from './pages/QRCodePage';
import LecturerScanner from './pages/LecturerScanner';
import AttendanceList from './pages/AttendanceList';
import LecturerDashboard from './pages/LecturerDashboard';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('authToken');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('authToken');
  return !token ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />

          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/qr-attendance" 
            element={
              <ProtectedRoute>
                <QRCodePage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/lecturer-scanner" 
            element={
              <ProtectedRoute>
                <LecturerScanner />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/attendance-list" 
            element={
              <ProtectedRoute>
                <AttendanceList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/lecturer-dashboard" 
            element={
              <ProtectedRoute>
                <LecturerDashboard />
              </ProtectedRoute>
            } 
          />

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<div className="min-h-screen flex items-center justify-center">404 - Page Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;