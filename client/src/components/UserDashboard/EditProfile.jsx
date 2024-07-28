import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { StoreContext } from "../../context/StoreContext";

const EditProfile = () => {
  const { token, loading } = useContext(StoreContext);
  const [error, setError] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try{
        const response = await axios.get("http://localhost:4000/auth/getUser", {
          withCredentials: true,
        });
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
    
    axios.put(`http://localhost:4000/auth/${user._id}`, user, { withCredentials: true })
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
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={user?.username || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={user?.address || ''}
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
        <button type="submit" className='btn'>Update Profile</button>
      </form>
    </div>
  );
};

export default EditProfile;
