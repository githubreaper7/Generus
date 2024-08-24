import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { StoreContext } from "../../context/StoreContext";

const EditNgoProfile = () => {
  const { token, loading } = useContext(StoreContext);
  const [error, setError] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try{
        const response = await axios.get("http://localhost:4000/auth/getNgo", {
          withCredentials: true,
        });
        // console.log(response);
        setUser(response.data);
      }
      catch(error){
        setError(error.response?.data?.message || 'Error fetching donations!!!');
      }finally {
        setLoadingData(false);
      }
    };

    if (!loading && token) {
      fetchUser();
    } else if(!loading) {
      setLoadingData(false);
      setError('No token found');
    }
  }, [token, loading]);

  // useEffect(() => {
  //   console.log('User state:', user); // Log state after setting it
  // }, [user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevState => ({ ...prevState, [name]: value }));
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    
    axios.put(`http://localhost:4000/auth/editNgo/${user._id}`, user, { withCredentials: true })
      .then(response => {
        console.log('Profile updated:', response.data);
        alert('Profile updated successfully!');
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div className="edit-profile">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>NGO Name</label>
          <input
            type="text"
            name="username"
            value={user?.username || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={user?.location || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Contact Number</label>
          <input
            type="text"
            name="contactNumber"
            value={user?.contactNumber || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={user?.description || ''}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className='btn'>Update Profile</button>
      </form>
    </div>
  );
};

export default EditNgoProfile;
