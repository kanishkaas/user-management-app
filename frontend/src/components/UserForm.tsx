// src/components/UserForm.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  pan_number: string;
}

interface Props {
  editingUser: User | null;
  setEditingUser: (user: User | null) => void;
  onUserSaved: () => void; // added this prop usage
}

const UserForm: React.FC<Props> = ({
  editingUser,
  setEditingUser,
  onUserSaved,
}) => {
  const [form, setForm] = useState<User>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    pan_number: "",
  });
  const [showPAN, setShowPAN] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (editingUser) setForm(editingUser);
  }, [editingUser]);

  const validatePAN = (pan: string) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { first_name, last_name, email, phone_number, pan_number } = form;

    if (!first_name || !last_name || !email || !phone_number || !pan_number) {
      setMessage("All fields are required");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setMessage("Invalid email format");
      return;
    }

    if (!/^\d{10}$/.test(phone_number)) {
      setMessage("Phone must be 10 digits");
      return;
    }

    if (!validatePAN(pan_number)) {
      setMessage("PAN format invalid (e.g. ABCDE1234F)");
      return;
    }

    try {
      if (editingUser) {
        await axios.put(
          `http://localhost:5000/api/users/${editingUser.id}`,
          form
        );
        setMessage("User updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/users", form);
        setMessage("User created successfully");
      }

      setForm({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        pan_number: "",
      });
      setEditingUser(null);

      onUserSaved();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setMessage(err.response.data.error || "Server error");
      } else {
        setMessage("Server error");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {message && <div className="alert alert-info">{message}</div>}

      <div className="row g-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="First Name"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Last Name"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Phone Number"
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6 position-relative">
          <input
            type={showPAN ? "text" : "password"}
            className="form-control"
            placeholder="PAN Number"
            name="pan_number"
            value={form.pan_number}
            onChange={handleChange}
          />
          <button
            type="button"
            className="position-absolute top-50 end-0 translate-middle-y me-2"
            style={{
              background: "none",
              border: "none",
              padding: "2px 6px",
              fontSize: "1rem",
              cursor: "pointer",
            }}
            onClick={() => setShowPAN(!showPAN)}
          >
            {showPAN ? "🙈" : "👁️"}
          </button>
        </div>
        <div className="col-md-12">
          <button type="submit" className="btn btn-success">
            {editingUser ? "Update User" : "Create User"}
          </button>
          {editingUser && (
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => {
                setEditingUser(null);
                setForm({
                  first_name: "",
                  last_name: "",
                  email: "",
                  phone_number: "",
                  pan_number: "",
                });
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default UserForm;
