import React, { useContext, useState } from "react";
import './userDashboard.css';
import { StoreContext } from "../../context/StoreContext";
import { useNavigate, Link } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { BiSolidDonateHeart } from "react-icons/bi";

const Navbar = ({ onSelectOption, removeNav }) => {

  const {token, setToken}=useContext(StoreContext);
  const navigate=useNavigate();
  const [selected, setSelected] = useState("myDonations");


  const handleOptionClick = (option) => {
    onSelectOption(option);
    setSelected(option);
    removeNav(); // Close the navbar when an option is clicked
  };

  const logout=()=>{
    localStorage.removeItem("token")
    setToken("");
    navigate("/");
  } 
 
  return (
    <nav className="dashboard-navbar">
      <ul className="user-options">
        <li className="nav-tag"><h1><BiSolidDonateHeart className="nav-tag-icon" />Gener<span>us</span></h1></li>
        <li className="back-home">
          <button><Link to="/" className="home-icon">
            <h1><IoHome className="icon" />Home</h1>
          </Link></button>
        </li> 
        <li>
          <button className={selected === "myDonations" ? "active": ""} 
          onClick={() => handleOptionClick("myDonations")}>My Donations</button>
        </li>
        <li>
          <button className={selected === "editProfile" ? "active": ""}
          onClick={() => handleOptionClick("editProfile")}>Edit Profile</button>
        </li>
        <li onClick={logout}>
          <button onClick={() => handleOptionClick("logout")} className="logout-button">Logout</button>
        </li> 
      </ul>
    </nav>
  ); 
};

export default Navbar;
