import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageBloodWork = () => {
  const [bloodWorkTypes, setBloodWorkTypes] = useState([]);

  useEffect(() => {
    fetchBloodWorkTypes();
  }, []);

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

  const toggleActivation = async (id, isActive) => {
    try {
      setBloodWorkTypes((prev) =>
        prev.map((type) =>
          type.id === id ? { ...type, active: !isActive } : type
        )
      );

      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:3000/api/blood_work_types/${id}/toggle_activation`, {
        isActive: !isActive,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBloodWorkTypes((prev) =>
        prev.map((type) =>
          type.id === id ? { ...type, isActive: !isActive } : type
        )
      );
    } catch (error) {
      console.error("Error toggling activation:", error);

      setBloodWorkTypes((prev) =>
        prev.map((type) =>
          type.id === id ? { ...type, active: isActive } : type
        )
      );
    }
  };

  const updateMinMax = async (id, newMin, newMax) => {
    try {
      // want to add logic to prevent unnecessary updates
      // const currentType = bloodWorkTypes.find((type) => type.id === id);
      // if (currentType.min === newMin && currentType.max === newMax) return;

      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:3000/api/blood_work_types/${id}`, 
        { 
          blood_work_type: { 
            min: newMin,
            max: newMax 
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBloodWorkTypes((prev) =>
        prev.map((type) =>
          type.id === id ? { ...type, min: newMin, max: newMax } : type
        )
      );
    } catch (error) {
      console.error("Error updating min/max:", error);
    }
  };

  return (
    <div>
      <h1>Manage Blood Work Types</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Units</th>
            <th>Min</th>
            <th>Max</th>
            <th>Active</th>
          </tr>
        </thead>
        <tbody>
          {bloodWorkTypes.map(type => (
            <tr key={type.id}>
              <td>{type.name}</td>
              <td>{type.units}</td>
              <td>
                <input
                  type="number"
                  value={type.min}
                  onChange={(e) =>
                    setBloodWorkTypes((prev) =>
                      prev.map((t) =>
                        t.id === type.id ? { ...t, min: e.target.value } : t
                      )
                    )
                  }
                  onBlur={() => updateMinMax(type.id, type.min, type.max)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={type.max}
                  onChange={(e) =>
                    setBloodWorkTypes((prev) =>
                      prev.map((t) =>
                        t.id === type.id ? { ...t, max: e.target.value } : t
                      )
                    )
                  }
                  onBlur={() => updateMinMax(type.id, type.min, type.max)}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={type.active}
                  onChange={() => toggleActivation(type.id, type.active)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageBloodWork;