import React, { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate, Link } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { BiSolidDonateHeart } from "react-icons/bi";


const Navbar = ({ onSelectOption, removeNav }) => {
  const { setToken } = useContext(StoreContext);
  const navigate = useNavigate();
  const [selected, setSelected] = useState("active-donations");

  const handleOptionClick = (option) => {
    onSelectOption(option);
    setSelected(option);
    removeNav(); // Close the navbar when an option is clicked
  };  

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  }; 
 
  return (
    // <nav className="ngo-dashboard-navbar">
    //   <ul>
    //     <li>
    //       <button onClick={() => onSelectOption("active-donations")}>
    //         Active Donations
    //       </button>
    //     </li>
    //     <li>
    //       <button onClick={() => onSelectOption("editProfile")}>
    //         Edit Profile
    //       </button>
    //     </li>
    //     <li onClick={logout}>
    //       <button onClick={() => onSelectOption("logout")} className="logout-button">
    //         Logout
    //       </button>
    //     </li> 
    //   </ul>
    // </nav>
    <nav className="dashboard-navbar">
    <ul className="user-options">
      <li className="nav-tag"><h1><BiSolidDonateHeart className="nav-tag-icon" />Gener<span>us</span></h1></li>
      <li className="back-home">
        <button><Link to="/" className="home-icon">
          <h1><IoHome className="icon" />Home</h1>
        </Link></button>
      </li> 
      <li>
        <button className={selected === "active-donations" ? "active": ""} 
        onClick={() => handleOptionClick("active-donations")}>All Donations</button>
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
