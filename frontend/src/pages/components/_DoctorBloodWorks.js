import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import "./_DoctorBloodWorks.css";

const DoctorBloodWorks = ({ user }) => {
  const [bloodWorks, setBloodWorks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    if (user && user.doctor_id !== null) {
      fetchDoctorBloodWorks();
    }
  }, [user]);

  const fetchDoctorBloodWorks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3000/api/scheduled_blood_works/doctor_requests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBloodWorks(response.data);
    } catch (error) {
      console.error("Error fetching doctor's blood works:", error);
    }
  };

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:3000/api/scheduled_blood_works/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchDoctorBloodWorks();
    } catch (error) {
      console.error("Error approving blood work:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:3000/api/scheduled_blood_works/${id}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchDoctorBloodWorks();
    } catch (error) {
      console.error("Error rejecting blood work:", error);
    }
  };

  const filteredBloodWorks = bloodWorks.filter((work) => {
    const matchesName = work.patient_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      selectedType === "" || work.blood_work_type_name === selectedType;
    return matchesName && matchesType;
  });

  const bloodWorkTypes = [
    ...new Set(bloodWorks.map((work) => work.blood_work_type_name)),
  ];

  return (
    <div className="doctor-bloodworks-container">
      <h2 className="title">Patients Blood Work Requests</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by patient name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="dropdown"
        >
          <option value="">All Blood Work Types</option>
          {bloodWorkTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <table className="bloodworks-table">
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Blood Work Type</th>
            <th>Appointment Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBloodWorks.length > 0 ? (
            filteredBloodWorks.map((work) => (
              <tr key={work.id}>
                <td>{work.patient_name}</td>
                <td>{work.blood_work_type_name}</td>
                <td>
                  {work.appointment_time
                    ? format(
                        new Date(work.appointment_time),
                        "MMMM dd, yyyy hh:mm:ss a"
                      )
                    : "Invalid Date"}
                </td>
                <td>
                  {work.approved
                    ? "Approved"
                    : work.rejected
                    ? "Rejected"
                    : work.cancelled
                    ? "Cancelled"
                    : "Pending"}
                </td>
                <td>
                  {!work.approved && !work.rejected && !work.cancelled && (
                    <>
                      <button
                        onClick={() => handleApprove(work.id)}
                        className="approve-button"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(work.id)}
                        className="reject-button"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No blood work requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorBloodWorks;