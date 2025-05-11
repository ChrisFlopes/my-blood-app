import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './_DoctorPatients.css';

const DoctorPatients = ({ user }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, [user]);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token");
      const doctorId = user?.doctor_id;

      if (!doctorId) {
        console.error("Doctor ID is missing in the user object.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `http://localhost:3000/api/doctors/${doctorId}/patients`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPatients(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching patients:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading patients...</p>;
  }

  const handleRowClick = (patientId) => {
    navigate(`/patients/${patientId}`);
  }

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="doctor-patients-container">
      <h1 className="doctor-patients-title">My Patients</h1>
      <input
        type="text"
        placeholder="Search by patient name or email"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />
      <table className="doctor-patients-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Contact Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.map((patient) => (
            <tr
              key={patient.id}
              onClick={() => handleRowClick(patient.id)}
              style={{ cursor: "pointer" }}
            >
              <td>{patient.name}</td>
              <td>{patient.email}</td>
              <td>{patient.contact_number}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button 
          className="dashboard-button" 
          onClick={() => navigate(`/doctors/${user.doctor_id}/assign-patients`)}
        >
          Assign new Patient
        </button>
      </div>
    </div>
  );
};

export default DoctorPatients;