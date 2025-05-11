import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import './_DoctorsPatientTestResults.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DoctorsPatientTestResults = ({ patient_id }) => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestResults();
  }, [patient_id]);

  const fetchTestResults = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/api/patients/${patient_id}/blood_test_results`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTestResults(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching test results:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="loading-message">Loading test results...</p>;
  }

  return (
    <div className="test-results-container">
      <h2 className="test-results-title">Patient Blood Test Results</h2>
      {testResults.map((result) => {
        const data = {
          labels: result[1].map((entry) =>
            entry.measured_at ? new Date(entry.measured_at).toLocaleDateString() : "N/A"
          ),
          datasets: [
            {
              label: `${result[0].name} (${result[1][0]?.measured_unit || "N/A"})`,
              data: result[1].map((entry) => entry.measured_value || 0),
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
            },
          ],
        };

        return (
          <div key={result[0].name} className="test-result-chart">
            <h3 className="chart-title">{result[0].name}</h3>
            <Line data={data} />
          </div>
        );
      })}
    </div>
  );
};

export default DoctorsPatientTestResults;