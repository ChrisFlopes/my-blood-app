import React, { useEffect, useState } from "react";
import axios from "axios";
import './ManageUsers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get("http://localhost:3000/api/users");
    setUsers(response.data);
  };

  const handleRoleChange = async (userId, role, isChecked) => {
    try {
      if (isChecked) {
        await axios.post(
          `http://localhost:3000/api/users/${userId}/roles`,
          { role },
          { withCredentials: true }
        );
      } else {
        await axios.delete(
          `http://localhost:3000/api/users/${userId}/roles`,
          { data: { role } },
          { withCredentials: true }
        );
      }

      setUsers((prevUsers) =>
        prevUsers.map(user =>
          user.id === userId
            ? { ...user, roles: isChecked ? [...user.roles, role] : user.roles.filter(r => r !== role) }
            : user
        )
      );
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <div className="manage-users-container">
      <h1 className="manage-users-title">Manage Users</h1>
      <table className="manage-users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Roles</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {["admin", "doctor", "lab_tech", "patient"].map((role) => (
                  <label key={role}>
                    <input
                      type="checkbox"
                      checked={user.roles?.includes(role)}
                      onChange={(e) => {
                        handleRoleChange(user.id, role, e.target.checked);}
                      }
                    />
                    {role}
                  </label>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageUsers;