import React, {useContext, useEffect, useState} from 'react'
import { useNavigate, Link } from "react-router-dom";
import './home.css'
import video from '../../assets/cover_video.mp4'
import Main from '../Main/Main'
import { StoreContext } from '../../context/StoreContext';

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const {token}=useContext(StoreContext);
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

  const handleJoinUs = () => {
    if(token){
      navigate('/donate');
    }
    else{
      navigate('/choose');
    }
  };

  return ( 
    <>
    <section className="home">
      <div className="overlay"></div>
      <div className='video-container'>
      <video src={video} muted autoPlay loop type='video/mp4' id="background-video"></video> 

      </div> 
        
        <div className="homeContent container">
          <div className="textDiv">
            <h1 className="smallText">
              Be a reason someone smiles!
            </h1>
            <button className="homeTitle btn home-button" onClick={handleJoinUs}>Join us</button>
          </div>
        </div>

        {token && <div className="pay-pop">
          <button onClick={() => setShowDialog(true)}>Donate Amount</button>
        </div>}
        {showDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <p>Click proceed to make payment to an NGO</p>
            <div className="dialog-buttons">
            <button><Link to="/ngoInfo">Proceed</Link></button>
            <button onClick={() => setShowDialog(false)}>Close</button>

            </div>
          </div>
        </div>
      )}
    </section>
        <Main/> 
    
    </>

  )
}

export default Home