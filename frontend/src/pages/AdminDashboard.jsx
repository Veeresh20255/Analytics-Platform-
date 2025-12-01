import React, { useEffect, useState } from 'react';
import { getAllUploads } from '../api/api';
import { getAllUsers, deleteUser as deleteUserApi } from '../api/admin';
import '../Stylesheets/styles.css'

export default function AdminDashboard() {
  const [uploads, setUploads] = useState([]);
  const [users, setUsers] = useState([]);

  const loadData = async () => {
    try {
      const [uploadsRes, usersRes] = await Promise.all([getAllUploads(), getAllUsers()]);
      setUploads(uploadsRes.uploads || []);
      setUsers(usersRes.users || []);
    } catch (err) {
      console.error('Error loading admin data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUserApi(id);
        loadData();
      } catch (err) {
        alert(err?.response?.data?.message || err.message);
      }
    }
  };

  return (
    <div className="admin">
      <h2>Admin Dashboard</h2>

      {/* Summary */}
      <div className="admin-summary">
        <p><strong>Total Uploads:</strong> {stats.totalUploads}</p>
        <p><strong>Total Users:</strong> {stats.totalUsers}</p>
      </div>

      <h3>Users</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => deleteUser(u._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* All uploads */}
      <h3>All Uploads</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>User</th>
            <th>File</th>
            <th>Uploaded</th>
          </tr>
        </thead>
        <tbody>
          {uploads.map(u => (
            <tr key={u._id}>
              <td>{u.user?.name} ({u.user?.email})</td>
              <td>{u.originalName}</td>
              <td>{new Date(u.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
