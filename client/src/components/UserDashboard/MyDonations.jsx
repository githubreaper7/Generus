import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext'
import './userDashboard.css';
import { MdDelete } from "react-icons/md";
import { IoMdTime } from "react-icons/io";

const MyDonations = () => {
  const { token, loading } = useContext(StoreContext);
  const [donations, setDonations] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [donationToDelete, setDonationToDelete] = useState(null);
 
  const customLabels = {
    menClothes: "Men's Clothes",
    womenClothes: "Women's Clothes",
    blanketsShawls: "Blankets/Shawls",
    childrenClothes: "Children's Clothes",
    other: "Other",
    summer: "Summer",
    winter: "Winter",
    allSeason: "All season",
    newCondition: "New",
    used: "Used",
    needsMinorRepairs: "Needs Repairs",
    weekdays: "Weekdays",
    weekends: "Weekends"

  };

  useEffect(() => {
    const fetchDonations = async () => {
      console.log("Token before API request:", token); 
      try {
        const response = await axios.get('http://localhost:4000/user-donations', {
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
          withCredentials: true,
        });
        setDonations(response.data);
        console.log(response.data)
      } catch (error) {
        setError(error.response?.data?.message || 'Error fetching donations!!!');
      } finally {
        setLoadingData(false);
      }
    };

    if (!loading && token) {
      fetchDonations();
    } else if(!loading) {
      setLoadingData(false);
      setError('No token found');
    }
  }, [token, loading]);

  if (loading) return <p>Loading...</p>;
  if (loadingData) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
 
  
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:4000/delete-donation/${donationToDelete}`, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
        withCredentials: true,
      });
      setDonations(donations.filter(donation => donation._id !== donationToDelete));
      setShowDialog(false);
      setDonationToDelete(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Error deleting donation');
    }
  };

  const handleConfirm = async (id) => {
    try {
      await axios.post(`http://localhost:4000/user-accept/${id}`, {}, {
        withCredentials: true,
      });
      setDonations(donations.filter(donation => donation._id !== id));
      alert("Pickup confirmed!");
    } catch (error) {
      setError(error.response?.data?.message || 'Error confirming donation');
    }
  };

  const openDialog = (id) => {
    setDonationToDelete(id);
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setDonationToDelete(null);
  };

  const renderClothingItems = (clothingItems) => {
   
    let timeoutId = null;
    const handleMouseEnter = (event) => {
      console.log('enter');
      const currentCircle = event.currentTarget;
      const circles = currentCircle.parentNode.children;
      clearTimeout(timeoutId);
      Array.from(circles).forEach(circle => {
        if (circle !== currentCircle) {
          circle.classList.add('hide');
        } else {
          circle.classList.add('active');
        }
      });
    };
  
    const handleMouseLeave = (event) => {
      console.log('leave');
      const currentCircle = event.currentTarget;
      const circles = currentCircle.parentNode.children;
      timeoutId = setTimeout(() => {
        Array.from(circles).forEach(circle => {
          circle.classList.remove('active');
          circle.classList.remove('hide');
        });
    }, 200);
      
    };

  
    return (
      <div className="circles-container">
        {clothingItems.filter(item => item.selected).map(item => (
          <div className="item-circle" key={item.type} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {customLabels[item.type][0]}
            <div className='circle-info'>{customLabels[item.type].slice(1)} </div>
            {item.description && (
              <div className='circle-info'>: {item.description}</div>
            )}
           
          </div>
        ))}
      </div>
    );
  };

  const renderSeason = (season) => {
    return Object.keys(season)
      .filter(key => season[key])
      .map(key => customLabels[key]) 
      .join(', ');
  };

  const renderCondition = (condition) => {
    return Object.keys(condition)
      .filter(key => condition[key])
      .map(key => customLabels[key]) 
      .join(', ');
  };
 
  const renderPreferredDay = (preferredDay) => {
    if (preferredDay === 'weekdays') {
      return customLabels.weekdays;
    } else if (preferredDay === 'weekends') {
      return customLabels.weekends;
    } else {
      return preferredDay; 
    }
  };

  return (

    <div className='dash-user'>
      <h1 className='table-heading'>My Donations</h1>
      <table className='my-donations-table'>
        <thead>
          <tr>
            <th>Clothing Items</th>
            <th>Season</th>
            <th>Quantity</th>
            <th>Condition</th>
            <th>Preferred Day</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Delete</th>
          </tr>
        </thead> 
        <tbody> 
          {donations.map(donation => (
            <tr key={donation._id}>
              <td>{renderClothingItems(donation.clothingItems)}</td>
              <td>{renderSeason(donation.season)}</td>
              <td>{donation.quantity}</td>
              <td>{renderCondition(donation.condition)}</td>
              <td>{renderPreferredDay(donation.preferredDay)}</td>
              <td>{donation.status === 'Pending' ? (
                  <div className='pending'><IoMdTime />Pending</div>
                ) : donation.status === 'Accepted by NGO' ? (
                  <button className='accept-button' onClick={() => handleConfirm(donation._id)}>Confirm</button>
                ) : (
                  <div className='confirmed'>Confirmed</div>
                )}</td>
              <td>{new Date(donation.createdAt).toLocaleDateString()}
              {donation.createdAt && (
                <div> {new Date(donation.createdAt).toLocaleDateString('en-US', { weekday: 'long' })}</div>
              )} 
              </td>
              <td>
                <button className='delete-item' onClick={() => openDialog(donation._id)}><MdDelete /></button>
              </td>
            </tr>
          ))}
        </tbody> 
      </table>

      {showDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <p>Are you sure you want to delete?</p>
            <div className="dialog-buttons">
              <button onClick={handleDelete}>Yes</button>
              <button onClick={closeDialog}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
    // <div className='donations-card-container'>
    //   <div>
    //     <h1>My Donations</h1>
    //     <ul>
    //       {donations.map((donation) => (
    //         <li key={donation._id} className='each-card'>
    //           <h4>Clothing Items: </h4>
    //           {donation.clothingItems.filter(item =>
    //             item.selected &&
    //             (item.type === 'menClothes' || item.type === 'womenClothes' || item.type === 'blanketsShawls')
    //           ).length > 0 && (
    //               <div className='clothing-items'>
    //                 {donation.clothingItems.filter(item =>
    //                   item.selected &&
    //                   (item.type === 'menClothes' || item.type === 'womenClothes' || item.type === 'blanketsShawls')
    //                 ).map(item => (
    //                   <span key={item.type} className='clothing-item'>
    //                     <span className='first-row'>{item.type}</span>
    //                   </span>
    //                 ))}
    //               </div>
    //             )}

    //           {donation.clothingItems.filter(item =>
    //             item.selected &&
    //             item.type === 'childrenClothes'
    //           ).length > 0 && (
    //               <div className='clothing-items'>
    //                 {donation.clothingItems.filter(item =>
    //                   item.selected &&
    //                   item.type === 'childrenClothes'
    //                 ).map(item => (
    //                   <span key={item.type} className='clothing-item'>
    //                     <span className='first-row'>{item.type}</span>
    //                     {item.childrenAgeGroups && (
    //                       <span>
    //                         {Object.keys(item.childrenAgeGroups)
    //                           .filter(key => key !== '_id')
    //                           .map(group => (
    //                             item.childrenAgeGroups[group] && (
    //                               <span key={group} className='age-group'>
    //                                 {group}
    //                               </span>
    //                             )
    //                           ))}
    //                       </span>
    //                     )}
    //                   </span>
    //                 ))}
    //               </div>
    //             )}

    //           {donation.clothingItems.filter(item =>
    //             item.selected &&
    //             item.type !== 'menClothes' &&
    //             item.type !== 'womenClothes' &&
    //             item.type !== 'blanketsShawls' &&
    //             item.type !== 'childrenClothes'
    //           ).length > 0 && (
    //               <div className='clothing-items'>
    //                 {donation.clothingItems.filter(item =>
    //                   item.selected &&
    //                   item.type !== 'menClothes' &&
    //                   item.type !== 'womenClothes' &&
    //                   item.type !== 'blanketsShawls' &&
    //                   item.type !== 'childrenClothes'
    //                 ).map(item => (
    //                   <span key={item.type} className='clothing-item'>
    //                     <span className='first-row'>{item.type}</span>
    //                     {item.description && (
    //                       <span className='rendered-desc'>{item.description}</span>
    //                     )}
    //                   </span>
    //                 ))}
    //               </div>
    //             )}


    //           <div className="row">
    //             <span><b>Quantity: </b></span>
    //             <span>{donation.quantity}</span>
    //           </div>

    //           {Object.values(donation.season).some(value => value) && (
    //     <div className='clothing-items'>
    //       <span><b>Season:</b></span>
    //       {Object.keys(donation.season).filter(key => donation.season[key]).map(key => (
    //         <span key={key} className='first-row'>{key}</span>
    //       ))}
    //     </div>
    //   )}

    //     {Object.values(donation.condition).some(value => value) && (
    //             <div className='clothing-items'>
    //               <span><b>Condition:</b></span>
    //               {Object.keys(donation.condition).filter(key => donation.condition[key]).map(key => (
    //                 <span key={key} className='first-row'>{key}</span>
    //               ))}
    //             </div>
    //           )}

    //           <div className="clothing-items">
    //           <p><b>Preferred Day: </b>{donation.preferredDay}</p>
    //           {donation.specialInstructions && (
    //             <>
    //               <span><b>Special Instructions:</b></span>
    //               <span className='rendered-desc'>{donation.specialInstructions}</span>
    //             </>
    //           )}
    //           </div>

    //           <div className="clothing-items">
    //           <span><b>Created At: </b>{donation.createdAt ? new Date(donation.createdAt).toLocaleDateString() : 'N/A'}</span>
    //           {donation.createdAt && (
    //             <span>, {new Date(donation.createdAt).toLocaleDateString('en-US', { weekday: 'long' })}</span>
    //           )}
    //           </div>

    //         </li>
    //       ))}
    //     </ul>
    //   </div>
    // </div>
  )
}

export default MyDonations
