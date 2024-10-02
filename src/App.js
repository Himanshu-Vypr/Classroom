import React, { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (window.database) {
      window.database
        .getUsers()
        .then((data) => {
          setUsers(data);
        })
        .catch((error) => console.error("Failed to load users:", error));
    }
  }, []);

  return (
    <div>
      <h1>Users List</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
