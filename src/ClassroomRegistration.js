// ClassroomRegistration.js
import React, { useState, useEffect } from "react";
import styles from "./ClassroomRegistration.module.css";

function ClassroomRegistration() {
  const [classroomName, setClassroomName] = useState("");
  const [classrooms, setClassrooms] = useState([]);

  useEffect(() => {
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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (window.database) {
      window.database
        .addClassroom(classroomName)
        .then(() => {
          loadClassrooms();
          setClassroomName("");
        })
        .catch((error) => console.error("Failed to add classroom:", error));
    }
  };

  return (
    <div className={styles.container}>
      <h2>Classroom Registration</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Classroom Name"
          value={classroomName}
          onChange={(e) => setClassroomName(e.target.value)}
        />
        <button type="submit">Add Classroom</button>
      </form>

      <h3>Existing Classrooms</h3>
      <ul>
        {classrooms.map((classroom) => (
          <li key={classroom.id}>{classroom.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default ClassroomRegistration;
