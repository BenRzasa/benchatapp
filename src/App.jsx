import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import AuthContext from "./context/AuthContext";
import { useContext } from "react";
import MainPage from "./pages/MainPage";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import WelcomePage from "./pages/WelcomePage";
import "./styles/global.css";

const App = () => {
  const { user, loading } = useContext(AuthContext);

  // Show a loading spinner or placeholder while validating the token
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Welcome Page (first page loaded) */}
        <Route path="/" element={<WelcomePage />} />

        {/* Public routes (no authentication required) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes (authentication required) */}
        <Route
          path="/mainpage"
          element={user ? <MainPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/login" />}
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;