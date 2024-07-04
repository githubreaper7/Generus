import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './navbar.css'
import { BiColor, BiSolidDonateHeart } from "react-icons/bi";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { TbGridDots } from "react-icons/tb";

const Navbar = () => {
    const [active, setActive] = useState('navBar')

    const showNav = () => {
        setActive('navBar activeNavbar')
    }

    const removeNav = () => {
        setActive('navBar')
    }

  return (
    <section className="navBarSection">
        <header className="header flex">
            <div className="logoDiv">
                <a href="#" className="logo flex">
                    <h1><BiSolidDonateHeart className="icon"/>Donate.</h1>
                </a>
            </div>

            <div className={active}>
                <ul className="navLists flex">
                    <li className="navItem">
                        <Link to="/" className='navLink'>Home</Link>
                        {/* <a href="#" className="navLink">Home</a> */}
                    </li>
                    <li className="navItem">
                        <a href="#" className="navLink">About Us</a>
                    </li>
                    <li className="navItem">
                        <a href="#" className="navLink">NGOs</a>
                    </li>

                    <button className="btn">
                        <Link to="/userSignup">Login/Register</Link>
                    </button>
                </ul>

                <div onClick={removeNav} className="closeNavBar">
                <IoIosCloseCircleOutline className='icon'/>

                </div>

                <div className={active}>
                    <ul className="navLists flex">
                        <li className="navItem">
                            <Link to="/" className='navLink'>Home</Link>
                        </li>
                        <li className="navItem">
                            <a href="#" className="navLink">About Us</a>
                        </li>
                        <li className="navItem">
                            <a href="#" className="navLink">NGOs</a>
                        </li>

                        <button className="btn">
                            <Link to="/userSignup">Login/Register</Link>
                        </button>
                    </ul>

                    <div onClick={removeNav} className="closeNavBar">
                        <IoIosCloseCircleOutline className='icon' />
                    </div>
                </div>

                <div onClick={showNav} className="toggleNavbar">
                    <TbGridDots className='icon' />
                </div>

            </header>
        </section>
    )
}

export default Navbar
