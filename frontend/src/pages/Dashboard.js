import React, { useEffect, useState } from "react";
import axios from "axios";
import DoctorBloodWorks from "./components/_DoctorBloodWorks";
import PatientPage from "./PatientPage";
import DoctorPatients from "./components/_DoctorPatients";
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [csvFile, setCsvFile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleCsvUpload = async () => {
    if (!csvFile) {
      alert("Please select a CSV file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", csvFile);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/api/blood_test_results/import_csv",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("CSV imported successfully!");
    } catch (error) {
      console.error("Error importing CSV:", error);
      alert("Failed to import CSV. Please check the file format.");
    }
  };

  if (!user) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <div className="dashboard-container">
      {user ? (
        <>
          {user.lab_tech_id !== null && (
            <div className="dashboard-section" style={{ marginBottom: "20px" }}>
              <h3>Import Blood Work Results</h3>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files[0])}
              />
              <button className="dashboard-button" onClick={handleCsvUpload}>Import CSV</button>
            </div>
          )}

          {user.patient_id !== null && (
            <div>
              <PatientPage user={user}/>
            </div>
          )}

          {user.doctor_id !== null && (
            <div>
              <DoctorBloodWorks user={user} />
              <DoctorPatients user={user} />
            </div>
          )}

          {user.admin_id !== null && (
            <div> 
              <h2>Admin Tools</h2>
              <button className="dashboard-button" onClick={() => window.location.href="/manage-users"}>Manage Users</button>
              <button className="dashboard-button" onClick={() => window.location.href="/manage-blood-work"}>Manage Blood work</button>
            </div>
          )}

          <button className="dashboard-button" onClick={() => {localStorage.removeItem("token"); window.location.href = "/login";}}>Logout</button>
        </>
      ) : (
        <p className="loading">Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
