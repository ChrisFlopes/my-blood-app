import React, { useState, useEffect } from "react";
import axios from "axios";
import './_ScheduledBloodWorks.css';

const ScheduledBloodWorks = ({ patient_id }) => {
  const [bloodWorkTypes, setBloodWorkTypes] = useState([]);
  const [bloodWorks, setBloodWorks] = useState([]);
  const [filteredBloodWorks, setFilteredBloodWorks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [newBloodWork, setNewBloodWork] = useState({
    blood_work_type: "",
    appointmentDate: "",
    appointmentTime: ""
  });

  useEffect(() => {
    if (patient_id) {
      fetchBloodWorks();
    }
    fetchBloodWorkTypes();
  }, [patient_id]);

  const fetchBloodWorks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:3000/api/patients/${patient_id}/scheduledbloodworks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setBloodWorks(response.data);
      setFilteredBloodWorks(response.data);
    } catch (error) {
      console.error("Error fetching blood works:", error);
    }
  };

  const fetchBloodWorkTypes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/blood_work_types", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBloodWorkTypes(response.data);
    } catch (error) {
      console.error("Error fetching blood work types:", error);
    }
  };

  const handleFilterChange = (filter) => {
    setFilter(filter);

    if (filter === "all") {
      setFilteredBloodWorks(bloodWorks);
    } else if (filter === "accepted") {
      setFilteredBloodWorks(bloodWorks.filter((work) => work.approved && !work.cancelled));
    } else if (filter === "rejected") {
      setFilteredBloodWorks(bloodWorks.filter((work) => work.rejected));
    } else if (filter === "cancelled") {
      setFilteredBloodWorks(bloodWorks.filter((work) => work.cancelled));
    } else if (filter === "pending") {
      setFilteredBloodWorks(bloodWorks.filter((work) => !work.approved && !work.rejected && !work.cancelled));
    }
  };

  const handleAddBloodWork = () => {
    setShowModal(true);
  };

  const handleSubmitBloodWorkRequest = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:3000/api/patients/${patient_id}/scheduledbloodworks`, {
        blood_work_type_id: newBloodWork.blood_work_type,
        appointment_time: `${newBloodWork.appointmentDate}T${newBloodWork.appointmentTime}`
      },
      { headers: 
        { Authorization: `Bearer ${token}` }
      });

     setShowModal(false);
     setNewBloodWork({ blood_work_type: "", appointmentDate: "", appointmentTime: "" });

     fetchBloodWorks();
    } catch (error) {
      console.error("Error adding blood work:", error);
    }
  };

  const handleCancelBloodWork = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:3000/api/patients/${patient_id}/scheduledbloodworks/${id}/cancel`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchBloodWorks();
    } catch (error) {
      console.error("Error cancelling blood work:", error);
    }
  };

  return (
    <div className="scheduled-blood-works-container">
      <h1 className="scheduled-blood-works-title">Scheduled Blood Works</h1>
      <div>
        <label htmlFor="filter">Filter: </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => handleFilterChange(e.target.value)}
        >
          <option value="all">All</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <button onClick={handleAddBloodWork} style={{ marginTop: "10px" }}>
        Add Blood Work
      </button>

      <table className="scheduled-blood-works-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Blood Work Type</th>
            <th>Appointment Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredBloodWorks.length > 0 ? (
            filteredBloodWorks.map((work) => (
              <tr key={work.id}>
                <td>{work.patient_name}</td>
                <td>{work.blood_work_type_name}</td>
                <td>{new Date(work.appointment_time).toLocaleString()}</td>
                <td>
                  {work.approved
                    ? "Accepted"
                    : work.rejected
                    ? "Rejected"
                    : work.cancelled
                    ? "Cancelled"
                    : "Pending"}
                </td>
                <td>
                  {!work.cancelled && !work.rejected && (
                    <button
                      onClick={() => handleCancelBloodWork(work.id)}
                      style={{ color: "red" }}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No blood works found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Schedule Blood Work</h2>
            <form>
              <div>
                <label htmlFor="bloodWorkType">Blood Work Type:</label>
                <select
                  id="bloodWorkType"
                  value={newBloodWork.blood_work_type}
                  onChange={(e) => setNewBloodWork({ ...newBloodWork, blood_work_type: e.target.value })}
                >
                  <option value="">Select a Blood Work Type</option>
                  {bloodWorkTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="appointmentDate">Appointment Date:</label>
                <input
                  type="date"
                  id="appointmentDate"
                  value={newBloodWork.appointmentDate}
                  onChange={(e) => setNewBloodWork({ ...newBloodWork, appointmentDate: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="appointmentTime">Appointment Time:</label>
                <input
                  type="time"
                  id="appointmentTime"
                  value={newBloodWork.appointmentTime}
                  onChange={(e) => setNewBloodWork({ ...newBloodWork, appointmentTime: e.target.value })}
                />
              </div>
              <div>
                <button type="button" onClick={handleSubmitBloodWorkRequest}>
                  Submit
                </button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduledBloodWorks;