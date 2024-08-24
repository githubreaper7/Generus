import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { BiSolidDonateHeart } from "react-icons/bi";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { TbGridDots } from "react-icons/tb";
import { jwtDecode } from 'jwt-decode';
import { StoreContext } from "../../context/StoreContext";

const Navbar = () => {

  const {token}=useContext(StoreContext);
  const [active, setActive] = useState("navBar");
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const showNav = () => {
    setActive("navBar activeNavbar");
  }; 

  const removeNav = () => {
    setActive("navBar");
  };

  const handleDashboardClick = () => {
 
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const role = decoded.role;
        // console.log('Token:', token);
        // console.log('Role:', role);

        if (role === 'user') {
          navigate('/userDashboard');
        } else if (role === 'ngo') {
          navigate('/ngoDashboard');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  const closeNavOnItemClick = () => {
    setIsOpen(false)
    removeNav();
    
  };

  return (
    <section className="navBarSection">
      <header className="header flex">
        <div className="logoDiv">
          <a href="/" className="logo flex">
            <h1><BiSolidDonateHeart className="icon" />Gener<span>us</span></h1>
          </a> 
        </div>

        <div className={active}>
          <ul className="navLists flex">
            <li className="navItem">
              <Link to="/" className="navLink"  onClick={closeNavOnItemClick}>
                Home
              </Link>
            </li>
            <li className="navItem">
              <Link to="/about" className="navLink"  onClick={closeNavOnItemClick}>
                About
              </Link>
            </li>
            <li className="navItem">
              <a href="/ngoInfo" className="navLink"  onClick={closeNavOnItemClick}>
                NGOs
              </a>
            </li>
            {/* {token?(
              <li className="navItem">
              <p className="navLink" onClick={handleDashboardClick} style={{ cursor: 'pointer' }}>
                Dashboard
              </p>
            </li>
            ):(
              null
            )} */}
 
            {token ? ( 
              <button className="btn-profile-icon" onClick={handleDashboardClick}>
                <FaUser />
              </button>
            ) : (

              <div className="dropdown" ref={dropdownRef}>
                <button onClick={toggleDropdown} className="btn">
                  Login/Register
                </button>
                {isOpen && (
                  <div className="dropdown-content">
                    <Link to="/userLogin" onClick={closeNavOnItemClick} className="drop-options">Donator</Link>
                    <Link to="/ngoLogin" onClick={closeNavOnItemClick} className="drop-options">NGO</Link>
                  </div>
                )}
              </div>
            )}
          </ul>

          <div onClick={removeNav} className="closeNavBar">
            <IoIosCloseCircleOutline className="icon" />
          </div>
        </div>

        <div onClick={showNav} className="toggleNavbar">
          <TbGridDots className="icon" />
        </div>
      </header>
    </section>
  );
};

export default Navbar;