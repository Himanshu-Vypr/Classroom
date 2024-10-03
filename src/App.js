import React, { useEffect, useState } from "react";
import ClassroomRegistration from "./ClassroomRegistration";
import StudentRegistration from "./StudentRegistration";
import TeacherRegistration from "./TeacherRegistration";
import ClassroomView from "./ClassroomView";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);

  useEffect(() => {
    loadUsers();
    loadClassrooms();
  }, []);

  const loadClassrooms = () => {
    if (window.database) {
      window.database
        .getClassrooms()
        .then((data) => {
          setClassrooms(data);
        })
        .catch((error) => console.error("Failed to load classrooms:", error));
    }
  };

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
    <div className="container">
      <h1 className="homepageHeader">Classroom - Management - Platform</h1>

      <div className="registration-section">
        <ClassroomRegistration />
        <StudentRegistration classrooms={classrooms} />
        <TeacherRegistration classrooms={classrooms} />
      </div>

      <div className="classroom-select">
        <h2>Select Classroom to View</h2>
        <select
          value={selectedClassroom}
          onChange={(e) => setSelectedClassroom(e.target.value)}
        >
          <option value="">Select Classroom</option>
          {classrooms.map((classroom) => (
            <option key={classroom.id} value={classroom.id}>
              {classroom.name}
            </option>
          ))}
        </select>
      </div>

      {selectedClassroom && <ClassroomView classroomId={selectedClassroom} />}

      <div className="footer">
        <p>&copy; 2024 Classroom Management Platform</p>
      </div>
    </div>
  );

  // return (
  //   <div>
  //     {/* <h1>Users List</h1>
  //     <ul>
  //       {users.map((user) => (
  //         <li key={user.id}>{user.name}</li>
  //       ))}
  //     </ul>

  //     <h2>Add New User</h2>
  //     <form onSubmit={handleSubmit}>
  //       <input
  //         type="text"
  //         placeholder="Enter user name"
  //         value={name}
  //         onChange={(e) => setName(e.target.value)}
  //       />
  //       <button type="submit">Add User</button>
  //     </form> */}

  //     <h1>Classroom - Management - Platform</h1>

  //     <ClassroomRegistration />
  //     <StudentRegistration classrooms={classrooms} />
  //     <TeacherRegistration classrooms={classrooms} />
  //     <div>
  //       <h2>Select Classroom to View</h2>
  //       <select
  //         value={selectedClassroom}
  //         onChange={(e) => setSelectedClassroom(e.target.value)}
  //       >
  //         <option value="">Select Classroom</option>
  //         {classrooms.map((classroom) => (
  //           <option key={classroom.id} value={classroom.id}>
  //             {classroom.name}
  //           </option>
  //         ))}
  //       </select>
  //     </div>
  //     {selectedClassroom && <ClassroomView classroomId={selectedClassroom} />}
  //   </div>
  // );
}

export default App;
