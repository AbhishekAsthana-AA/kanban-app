import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import Login from "../Pages/Login";
import Home from "../Pages/Home";
import { useAuth } from "../Hooks/auth";

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const  user  = useAuth(); // Destructure user from useAuth
  if (user === undefined) {
    // Optionally show a loading spinner or placeholder here
    return <div>Loading...</div>;
  }
  return user ? children : <Navigate to="/" replace />;
};

export default function AppRoutes() {
  const  user  = useAuth();
  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" replace /> : <Login />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Home />
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
