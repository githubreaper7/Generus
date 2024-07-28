import React, { useState,useEffect, useContext } from "react";
import Navbar from "./Navbar";
import ActiveDonations from './ActiveDonations';
import EditProfile from './EditProfile';

import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";


const NgoDashboard = () => {
  const [selectedOption, setSelectedOption] = useState("active-donations");
  const { token } = useContext(StoreContext);
  const navigate=useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/'); // Navigate to home page if no token is present
    }
  }, [token, navigate]);

  const renderContent = () => {
    switch (selectedOption) {
      case "active-donations":
        return <ActiveDonations />;
      case "editProfile":
        return <EditProfile />;
      default:
        return null;
    }
  };
 
   
  return ( 
    <div className="ngo-dashboard-container"> 
      <div className="ngo-navbar">
        <Navbar onSelectOption={setSelectedOption} />
      </div>
      <div className="ngo-dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default NgoDashboard;
