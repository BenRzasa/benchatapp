import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import AuthContext from "./context/AuthContext";
import { useContext } from "react";
import MainPage from "./pages/MainPage";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import WelcomePage from "./pages/WelcomePage";
import RoomPage from "./pages/RoomPage";
import "./styles/global.css";

const App = () => {
  const { user } = useContext(AuthContext);
  console.log("User state in App:", user);

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
        <Route
          path="/room/:roomId"
          element={user ? <RoomPage /> : <Navigate to="/login" />}
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;