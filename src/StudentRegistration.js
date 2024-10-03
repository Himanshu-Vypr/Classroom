// StudentRegistration.js
import React, { useState, useEffect } from "react";
import styles from "./StudentRegistration.module.css";

function StudentRegistration({ classrooms }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [classroomId, setClassroomId] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (window.database) {
      const studentData = { name, address, rollNumber, classroomId };
      window.database
        .addStudent(studentData)
        .then(() => {
          setName("");
          setAddress("");
          setRollNumber("");
          setClassroomId("");
        })
        .catch((error) => console.error("Failed to add student:", error));
    }
  };

  return (
    <div className={styles.container}>
      <h2>Student Registration</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="Roll Number"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
        />
        <select
          value={classroomId}
          onChange={(e) => setClassroomId(e.target.value)}
        >
          <option value="">Select Classroom</option>
          {classrooms.map((classroom) => (
            <option key={classroom.id} value={classroom.id}>
              {classroom.name}
            </option>
          ))}
        </select>
        <button type="submit">Register Student</button>
      </form>
    </div>
  );
}

export default StudentRegistration;
