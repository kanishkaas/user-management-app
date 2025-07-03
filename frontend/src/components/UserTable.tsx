import React from "react";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  pan_number: string;
}

interface Props {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

const UserTable: React.FC<Props> = ({ users, onEdit, onDelete }) => {
  return (
    <>
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>First</th>
            <th>Last</th>
            <th>Email</th>
            <th>Phone</th>
            <th>PAN</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.email}</td>
                <td>{user.phone_number}</td>
                <td>
                  <span style={{ letterSpacing: 1 }}>
                    {"*".repeat(user.pan_number.length - 4) +
                      user.pan_number.slice(-4)}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => onEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this user?"
                        )
                      ) {
                        onDelete(user.id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
};

export default UserTable;
