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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PatientTestResults = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestResults();
  }, []);

  const fetchTestResults = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3000/api/blood_test_results",
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
    return <p>Loading test results...</p>;
  }

  return (
    <div>
      <h2>Blood Test Results</h2>
      {Object.keys(testResults).map((bloodWorkType) => {
        const data = {
          labels: testResults[bloodWorkType].map((result) =>
            new Date(result.measured_at).toLocaleDateString()
          ),
          datasets: [
            {
              label: `${bloodWorkType} (${testResults[bloodWorkType][0].measured_unit})`,
              data: testResults[bloodWorkType].map(
                (result) => result.measured_value
              ),
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
            },
          ],
        };

        return (
          <div key={bloodWorkType} style={{ marginBottom: "40px" }}>
            <h3>{bloodWorkType}</h3>
            <Line data={data} />
          </div>
        );
      })}
    </div>
  );
};

export default PatientTestResults;