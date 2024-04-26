import "./App.css";
import "./assets/css/main.css";
import "./assets/css/custom-styles.css";
import Login from "./components/pages/authentication/Login";
import Register from "./components/pages/authentication/Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Verification from "./components/pages/authentication/Verification";
import ForgotPassword from "./components/pages/authentication/ForgotPassword";
import ResetPassword from "./components/pages/authentication/ResetPassword";
import Profile from "./components/pages/profile/Profile";
import Messenger from "./components/pages/messenger/Messenger";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat" element={<Messenger />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
