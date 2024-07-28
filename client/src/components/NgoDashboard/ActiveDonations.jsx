// components/ActiveDonations.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./activeDonations.css";

const itemTypeNames = {
  menClothes: "Men's Clothes",
  womenClothes: "Women's Clothes",
  blanketsShawls: "Blankets & Shawls",
  childrenClothes: "Children's Clothes",
  other: "Other"
}; 

const preferredDayNames = {
  weekdays: "Weekdays",
  weekends: "Weekends"
};

const ActiveDonations = () => {
  const [donations, setDonations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [donationsPerPage] = useState(10);
  const [error, setError] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [donationToAccept, setDonationToAccept] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:4000/donations")
      .then((response) => {
        if (response.data.status) {
          setDonations(response.data.donations);
        }
      })
      .catch((error) => {
        console.error("Error fetching donations:", error);
      });
  }, []);
 
  const handleAccept = async () => {
    try {
      await axios.post(`http://localhost:4000/accept-donation/${donationToAccept}`, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
        withCredentials: true,
      }); 
      setDonations(donations.filter(donation => donation._id !== donationToAccept));
      setShowDialog(false);
      alert('Invite sent to user successfully!');
      setDonationToAccept(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Error accepting donation');
    }
  };
 
  const openDialog = (id) => {
    setDonationToAccept(id);
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setDonationToAccept(null);
  };


  const indexOfLastDonation = currentPage * donationsPerPage;
  const indexOfFirstDonation = indexOfLastDonation - donationsPerPage;
  const currentDonations = donations.slice(
    indexOfFirstDonation,
    indexOfLastDonation
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="dash-user">
      <h2>Active Donations</h2>
      <table className="my-donations-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Items</th>
            <th>Quantity</th>
            <th>Condition</th>
            <th>Special Instructions</th>
            <th>Preferred Day</th>
            <th>Date</th>
            <th>Claim</th>
          </tr>
        </thead>
        <tbody>
          {currentDonations.map((donation) => (
            <tr key={donation._id}>
              <td>{donation.email}</td>
              <td>
                {donation.clothingItems
                  .filter((item) => item.selected)
                  .map((item, index) => (
                    <div key={index}>{itemTypeNames[item.type]}</div>
                  ))}
              </td> 
              <td>{donation.quantity}</td>
              <td>
                {donation.condition.newCondition && <div>New</div>}
                {donation.condition.used && <div>Used</div>}
                {donation.condition.needsMinorRepairs && (
                  <div>Needs Minor Repairs</div>
                )}
              </td> 
              <td>{donation.specialInstructions}</td>
              <td>{preferredDayNames[donation.preferredDay]}</td>
              <td>{new Date(donation.createdAt).toLocaleDateString()}</td>
              <td>{donation.status === 'Pending' && (
                  <button onClick={() => openDialog(donation._id)}>Accept</button>
                )}
                {donation.status === 'Accepted by NGO' && <span>Accepted</span>}
                {donation.status === 'Fully Accepted' && <span>Confirmed</span>}</td>
                
            </tr>
          ))}
        </tbody>
      </table>
      {showDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <p>Are you sure you want to accept this donation?</p>
            <div className="dialog-buttons">
              <button onClick={handleAccept}>Yes</button>
              <button onClick={closeDialog}>No</button>
            </div>
          </div>
        </div>
      )}
      <Pagination
        donationsPerPage={donationsPerPage}
        totalDonations={donations.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

const Pagination = ({
  donationsPerPage,
  totalDonations,
  paginate,
  currentPage,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalDonations / donationsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`page-item ${number === currentPage ? "active" : ""}`}
          >
            <button onClick={() => paginate(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ActiveDonations;
