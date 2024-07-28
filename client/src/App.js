import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import DonorForm from "./components/DonorForm";
import Choose from "./components/Choose";
import UserSignup from "./components/Signup/UserSignup";
import UserLogin from "./components/Login/UserLogin";
import NgoLogin from "./components/Login/NgoLogin";
import UserDashboard from "./components/UserDashboard/UserDashboard";
import NgoDashboard from "./components/NgoDashboard/NgoDashboard";
import About from "./components/About/About";
import EditProfile from './components/UserDashboard/EditProfile';
import NgoInfo from "./components/Ngo/NgoInfo";

function App() {
  const location = useLocation();
  const hideNavbarPaths = ["/userDashboard", "/ngoDashboard", "/editProfile/:id"];

  return (
    <>
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <MainRoutes />
    </>
  );
}

function MainRoutes() {
  const location = useLocation();
  const hideFooterPaths = ["/userDashboard", "/ngoDashboard", "/editProfile/:id"];

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/ngoInfo" element={<NgoInfo/>} />
        <Route path="/donate" element={<DonorForm />} />
        <Route path="/choose" element={<Choose />} />
        <Route path="/userSignup" element={<UserSignup />} />
        <Route path="/userLogin" element={<UserLogin />} />
        <Route path="/ngoLogin" element={<NgoLogin />} />
        <Route path="/userDashboard" element={<UserDashboard />} />
        <Route path="/ngoDashboard" element={<NgoDashboard />} />
        <Route path="/editProfile/:id" element={<EditProfile />} />
      </Routes>
      {!hideFooterPaths.includes(location.pathname) && <Footer />}
    </>
  );
}

export default App;
