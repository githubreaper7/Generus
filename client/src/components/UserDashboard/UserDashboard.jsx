import React, { useState, useContext, useEffect } from "react";
import {Link} from "react-router-dom";
import Navbar from "./Navbar";
import MyDonations from './MyDonations';
import EditProfile from './EditProfile';
import './userDashboard.css';
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { IoHome } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { IoIosCloseCircleOutline } from "react-icons/io";

const UserDashboard = () => {
  const [selectedOption, setSelectedOption] = useState("myDonations");
  const { token } = useContext(StoreContext);
  const navigate = useNavigate();
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);
  const [active, setActive] = useState("user-navbar")

  useEffect(() => {
    if (!token) {
      navigate('/'); // Navigate to home page if no token is present
    }
  }, [token, navigate]);

  
  const renderContent = () => {
    switch (selectedOption) {
      case "myDonations":
        return <MyDonations />;
      case "editProfile":
        return <EditProfile />;
      default:
        return null;
    }
  };

  const showNav = () => {
    setActive("user-navbar nav-visible");
  }; 
  const removeNav = () => {
    setActive("user-navbar");
  };

 
  if (!token) return null; // Prevent rendering the dashboard if no token

  return (
    <div className="user-dash">
      
      <div className="dashboard-container">
          <div className={active}>
            <Navbar onSelectOption={setSelectedOption} removeNav={removeNav}/>
            <div onClick={removeNav} className="close-menu">
            <IoIosCloseCircleOutline className="icon" />
          </div>
          </div>
          <div onClick={showNav} className="user-menu">
          <IoMenu />
        </div>
          <div className="user-dashboard-content">
            {renderContent()}
          </div>
      </div>
    </div>

  );
}

export default UserDashboard;
