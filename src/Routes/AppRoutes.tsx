import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import Login from "../Pages/Login";
import Home from "../Pages/Home";
import { useAuth } from "../Hooks/auth";


// const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
//   const user = useAuth();
//   console.log(user);
//   return user != null ? children : <Navigate to="/" />
// };

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const  user  = useAuth(); // Destructure user from useAuth
  console.log(user);
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
