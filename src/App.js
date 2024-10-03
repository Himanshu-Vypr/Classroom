import React, { useEffect, useState } from "react";
import ClassroomRegistration from "./ClassroomRegistration";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  // Function to load users from the database
  const loadUsers = () => {
    if (window.database) {
      window.database
        .getUsers()
        .then((data) => {
          setUsers(data);
        })
        .catch((error) => console.error("Failed to load users:", error));
    }
  };

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent form from reloading the page

    if (window.database) {
      window.database
        .addUser(name) // Pass the user input to addUser
        .then(() => {
          loadUsers(); // Reload users after successfully adding
          setName(""); // Reset the form
        })
        .catch((error) => console.error("Failed to add user:", error));
    }
  };

  return (
    <div>
      <h1>Users List</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>

      <h2>Add New User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter user name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Add User</button>
      </form>

      <ClassroomRegistration />
    </div>
  );
}

export default App;
