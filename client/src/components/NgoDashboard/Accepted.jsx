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

const Accepted = () => {
  const [donations, setDonations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [donationsPerPage] = useState(10);
  const [error, setError] = useState(null);
  const [selectedDonator, setSelectedDonator] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:4000/accepted-donations")
      .then((response) => {
        if (response.data.status) {
          setDonations(response.data.donations);
          console.log(donations);
        }
      })
      .catch((error) => {
        console.error("Error fetching donations:", error);
      });
  }, []);

  const handleViewDetails = async (email) => {
    try {
      const response = await axios.get(`http://localhost:4000/auth/donation-details/${email}`);
      setSelectedDonator(response.data.donator);
    } catch (error) {
      console.error('Error fetching donation details:', error);
      setError('Error fetching donation details');
    }
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
            <th>Status</th>
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
              <td>
                {donation.status === 'Accepted by NGO' && <span className="requested">Requested</span>}
                {donation.status === 'Fully Accepted' && <button onClick={() => handleViewDetails(donation.email)} className="confirmed">View Details</button>}</td>
                
            </tr>
          ))}
        </tbody>
      </table>
      {selectedDonator && (
  <div className="donator-details">
    <h3>Donator Details</h3>
    <p><strong>Email:</strong> {selectedDonator.email}</p>
    <p><strong>Address:</strong> {selectedDonator.address}</p>
    <p><strong>Contact Number:</strong> {selectedDonator.contactNumber}</p>
    <button onClick={() => setSelectedDonator(null)}>Close</button>
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

export default Accepted;
