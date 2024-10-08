import React, { useState,useEffect, useContext } from "react";
import Navbar from "./Navbar";
import ActiveDonations from './ActiveDonations';
import EditProfile from './EditNgoProfile';
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { IoMenu } from "react-icons/io5";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Accepted from "./Accepted";

const NgoDashboard = () => {
  const [selectedOption, setSelectedOption] = useState("active-donations");
  const { token } = useContext(StoreContext);
  const navigate=useNavigate();
  const [active, setActive] = useState("user-navbar")

  useEffect(() => {
    if (!token) {
      navigate('/'); // Navigate to home page if no token is present
    }
  }, [token, navigate]);
 
  const renderContent = () => {
    switch (selectedOption) {
      case "active-donations":
        return <ActiveDonations />;
      case "accepted-donations":
        return <Accepted />
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

  if (!token) return null;
    
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

export default NgoDashboard;
