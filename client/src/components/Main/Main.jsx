import React from 'react'
import './main.css'
import { BsListCheck } from "react-icons/bs";
import { RiUser3Fill } from "react-icons/ri";
import { FaHandsHelping } from "react-icons/fa";

const Data = [
  {
    id: 1,
    imgSrc: <RiUser3Fill />,
    title: "Login to our website",
    description: "Login with your registered credentials"
  },
  {
    id: 2,
    imgSrc: <BsListCheck />,
    title: "Provide details",
    description: "Provide all the necessary details of the items you wish to donate"
  },
  {
    id: 3,
    imgSrc: <FaHandsHelping />,
    title: "Response from NGO",
    description: "We'll connect you to the NGO that accepts your donations"
  }
] 
 
const Main = () => {
  return (
    <>
    <section className="main container section">
      <div className="steps-container">
      <div className="secTitle">
        <h3 className="title">
          How to proceed
        </h3>
      </div>
 
      <div className="secContent grid">
        {Data.map(({id, imgSrc, title, description}) => {
          return(
            <div key={id} className='singleCard'>

            <div className="card-icon">{imgSrc}</div>
              
              <div className="cardInfo">
                <h4 className="destTitle">{title}</h4>
                <div className="desc">
                  <p>{description}</p>
                </div>
              </div>

            </div>
          )
        })}
      </div>
      </div>
      
      

    </section>

    
    </>
  )
}

export default Main 