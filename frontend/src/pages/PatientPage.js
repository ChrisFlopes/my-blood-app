import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DoctorsPatientTestResults from "./components/_DoctorsPatientTestResults";
import ScheduledBloodWorks from "./components/_ScheduledBloodWorks";
import './PatientPage.css';
import { FaPen } from "react-icons/fa";

const PatientPage = ({ user }) => {
  const params = useParams();
  const patientId = user?.patient_id || params.id;
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [contactNumber, setContactNumber] = useState("");

  useEffect(() => {
    fetchPatient();
  }, [patientId]);

  const fetchPatient = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:3000/api/patients/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPatient(response.data);
      setContactNumber(response.data.contact_number); // Initialize contact number
      setLoading(false);
    } catch (error) {
      console.error("Error fetching patient data:", error);
      setLoading(false);
    }
  };

  const handleSaveContactNumber = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/users/me`,
        { contact_number: contactNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setPatient({ ...patient, contact_number: contactNumber });
      setIsEditing(false);
      alert("Contact number updated successfully!");
    } catch (error) {
      console.error("Error updating contact number:", error);
      alert("Failed to update contact number. Please try again.");
    }
  };

  const handleExportCsv = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/api/patients/${patientId}/export_csv`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `patient_${patientId}_results.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Failed to export CSV. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!patient) {
    return <p>No patient data found.</p>;
  }

  return (
    <div className="patient-container">
      <h1 className="patient-title">Patient Details</h1>
      <div className="patient-info">
        <p><strong>Name:</strong> {patient.name}</p>
        <p><strong>Email:</strong> {patient.email}</p>
        <p>
          <strong>Contact Number:</strong>{" "}
          {isEditing ? (
            <>
              <input
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="contact-input"
              />
              <button onClick={handleSaveContactNumber} className="save-button">
                Save
              </button>
              <button onClick={() => setIsEditing(false)} className="cancel-button">
                Cancel
              </button>
            </>
          ) : (
            <>
              {patient.contact_number}{" "}
              <FaPen
                onClick={() => setIsEditing(true)}
                className="edit-icon"
                title="Edit Contact Number"
              />
            </>
          )}
        </p>
      </div>
      {user?.doctor_id && (
        <div>
          <DoctorsPatientTestResults patient_id={patientId} />
          <button onClick={handleExportCsv} className="patient-button" style={{ marginBottom: "20px" }}>
            Export Results to CSV
          </button>
        </div>
      )}
      <ScheduledBloodWorks patient_id={patientId} />
    </div>
  );
};

export default PatientPage;