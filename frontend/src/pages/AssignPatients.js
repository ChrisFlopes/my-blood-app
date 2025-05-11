import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const AssignPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignedPatients, setAssignedPatients] = useState({});
  const { doctorId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`http://localhost:3000/api/patients`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response)
      console.log(response.data[0].doctors_ids)
      const initialAssignedPatients = {};
      response.data.forEach((patient) => {
        initialAssignedPatients[patient.id] = patient.doctors_ids.includes(parseInt(doctorId));
      });

      setPatients(response.data);
      setAssignedPatients(initialAssignedPatients)
      setLoading(false);
    } catch (error) {
      console.error("Error fetching patients:", error);
      setLoading(false);
    }
  };

  const handleCheckboxChange = async (patientId, isChecked) => {
    try {
      const token = localStorage.getItem("token");
      const url = isChecked
        ? `http://localhost:3000/api/doctors/${doctorId}/assign_patients`
        : `http://localhost:3000/api/doctors/${doctorId}/unassign_patients`;

      await axios.post(
        url,
        { patient_id: patientId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAssignedPatients((prevState) => ({
        ...prevState,
        [patientId]: isChecked,
      }));

      console.log(
        `Patient ${isChecked ? "assigned to" : "unassigned from"} doctor`
      );
    } catch (error) {
      console.error(
        `Error ${isChecked ? "assigning" : "unassigning"} patient:`,
        error.response?.data?.errors || error.message
      );
    }
  };

  if (loading) {
    return <p>Loading patients...</p>;
  }

  return (
    <div className="doctor-patients-container">
      <h1 className="doctor-patients-title">All Patients</h1>
      <table className="doctor-patients-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Contact Number</th>
            <th>Assigned</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.name}</td>
              <td>{patient.email}</td>
              <td>{patient.contact_number}</td>
              <td>
                <input
                  type="checkbox"
                  checked={assignedPatients[patient.id] || false}
                  onChange={(e) =>
                    handleCheckboxChange(patient.id, e.target.checked)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button className="dashboard-button" onClick={() => navigate("/dashboard")}>
          Back
        </button>
      </div>
    </div>
  );
};

export default AssignPatients;