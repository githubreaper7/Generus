import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import "./ngoList.css";

const NgoCard = ({ ngo }) => {
  return (
    <>
    {/* <div className="ngoInfoHeading">
        <p></p>
    </div> */}
    <div className="ngo-card">
      <h2 className="ngo-name">{ngo.username}</h2>
      <p className="ngo-description">{ngo.description}</p>
      <div className="ngo-details">
        <div className="ngo-location">
          <FaMapMarkerAlt className="location-icon" />
          <span>{ngo.location}</span>
        </div>
        <div className="ngo-contact">
          <FaPhoneAlt className="phone-icon" />
          <span>{ngo.contactNumber}</span>
        </div>
      </div>
    </div>
    </>
    
  );
};

const NgoList = () => {
  const [ngos, setNgos] = useState([]);
  const [totalNgos, setTotalNgos] = useState(0); // Track total number of NGOs
  const [currentPage, setCurrentPage] = useState(1);
  const ngosPerPage = 10;

  useEffect(() => {
    axios
      .get(`http://localhost:4000/auth/ngos?page=${currentPage}&limit=${ngosPerPage}`)
      .then((response) => {
        if (response.data.status) {
          setNgos(response.data.ngos);
          setTotalNgos(response.data.total); // Set the total number of NGOs
        }
      })
      .catch((error) => {
        console.error("Error fetching NGOs:", error);
      });
  }, [currentPage]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="ngo-list-container">
        <div className="ngoInfoHeading">
            <h1>NGOs who joined hands..</h1>
    </div>
      <div className="ngo-list">
        {ngos.map((ngo) => (
          <NgoCard key={ngo._id} ngo={ngo} />
        ))}
      </div>
      <Pagination
        ngosPerPage={ngosPerPage}
        totalNgos={totalNgos} // Use the state variable for total NGOs
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

const Pagination = ({ ngosPerPage, totalNgos, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalNgos / ngosPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="pagination-nav">
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

export default NgoList;
