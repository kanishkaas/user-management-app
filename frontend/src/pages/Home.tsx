import React, { useState, useEffect } from "react";
import UserForm from "../components/UserForm";
import UserTable from "../components/UserTable";
import ExcelUpload from "../components/ExcelUpload";
import DownloadTemplate from "../components/DownloadTemplate";
import { ToastContainer } from "react-toastify";
import axios from "axios";

const Home: React.FC = () => {
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers(); 
  }, []);

const handleDelete = async (id: number) => {
  if (window.confirm("Are you sure you want to delete this user?")) {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      fetchUsers(); 
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  }
};

  return (
    <div className="container mt-4">
      <h2 className="text-center">User Management</h2>
      <UserForm
        editingUser={editingUser}
        setEditingUser={setEditingUser}
        onUserSaved={fetchUsers} 
      />

      <hr />
      <ExcelUpload
        onUploadSuccess={() => {
          fetchUsers(); 
          console.log("Upload successful");
        }}
      />

      <DownloadTemplate />
      <hr />
      <UserTable users={users} onEdit={setEditingUser} onDelete={handleDelete} />

      <ToastContainer />
    </div>
  );
};

export default Home;
