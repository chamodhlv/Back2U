import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';

import FoundItemsList from "./pages/FoundItemsList/FoundItemsList";
import ReportFoundItem from "./pages/ReportFoundItem/ReportFoundItem";
import FoundItemDetails from "./pages/FoundItemDetails/FoundItemDetails";
import SubmitClaim from "./pages/SubmitClaim/SubmitClaim";
import ManageClaims from "./pages/ManagerClaims/ManagerClaims";
import CampusNotices from "./pages/CampusNotices/CampusNotices";
import AdminNotices from "./pages/AdminNotices/AdminNotices";
import CreateNotice from "./pages/CreateNotice/CreateNotice";

const AuthRedirect = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <AuthRedirect>
                <Login />
              </AuthRedirect>
            }
          />
          <Route
            path="/register"
            element={
              <AuthRedirect>
                <Register />
              </AuthRedirect>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          
          <Route path="*" element={<Navigate to="/" replace />} />


          {/* Found Items Routes */}
      <Route path="/found-items" element={<FoundItemsList/>} />
      <Route path="/report" element={<ReportFoundItem/>} />
      <Route path="/found/:id" element={<FoundItemDetails/>} />
      <Route path="/claim/:id" element={<SubmitClaim/>} />
      <Route path="/manage/:id" element={<ManageClaims/>} />

      {/* Campus Notices Routes */}
      <Route path="/notices" element={<CampusNotices/>} />
      <Route path="/admin/notices" element={<AdminNotices/>} />
      <Route path="/admin/notices/create" element={<CreateNotice/>} />
      <Route path="/admin/notices/edit/:id" element={<adminCreateNotice/>} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
