import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import EmailNotification from "./components/EmailNotification";
import AuthorizationsPage from "./components/AuthorizationsPage";
import AuthorizationDetail from "./components/AuthorizationDetail";
import Navigation from "./components/Navigation";
import { authorizations, getRecentPermissionChanges } from "./data/dummy-data";

// Email page wrapper
function EmailPage() {
  const navigate = useNavigate();
  const recentChanges = getRecentPermissionChanges(1);

  const handleSeeDetails = (
    authId: string,
    dateRange: { from: Date; to: Date }
  ) => {
    navigate(`/authorization/${authId}`, {
      state: { autoOpenDrawer: true, dateRange },
    });
  };

  return (
    <EmailNotification
      permissionChanges={recentChanges}
      onSeeDetails={handleSeeDetails}
    />
  );
}

// Authorizations page wrapper
function AuthorizationsPageWrapper() {
  const navigate = useNavigate();

  const handleNavigateToDetail = (authId: string) => {
    navigate(`/authorization/${authId}`);
  };

  return <AuthorizationsPage onNavigateToDetail={handleNavigateToDetail} />;
}

// Authorization detail page wrapper
function AuthorizationDetailWrapper() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const authorization = id
    ? authorizations.find((auth) => auth.id === id)
    : null;

  if (!authorization) {
    return <Navigate to="/authorizations" replace />;
  }

  const handleViewChanges = () => {
    // This will be handled by the component itself
  };

  const handleNavigateToList = () => {
    navigate("/authorizations");
  };

  return (
    <AuthorizationDetail
      authorization={authorization}
      onViewChanges={handleViewChanges}
      onNavigateToList={handleNavigateToList}
    />
  );
}

// Layout wrapper with navigation
function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const showNavigation = !location.pathname.startsWith("/authorization/");

  return (
    <div className="min-h-screen bg-gray-50">
      {showNavigation && (
        <div className="container">
          <Navigation />
        </div>
      )}
      {children}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Email Notification Route */}
          <Route path="/email" element={<EmailPage />} />

          {/* Authorizations List Route */}
          <Route
            path="/authorizations"
            element={<AuthorizationsPageWrapper />}
          />

          {/* Authorization Detail Route */}
          <Route
            path="/authorization/:id"
            element={<AuthorizationDetailWrapper />}
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/email" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
