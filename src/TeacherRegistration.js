// TeacherRegistration.js
import React, { useState } from "react";
import styles from "./TeacherRegistration.module.css";

function TeacherRegistration({ classrooms }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [classroomId, setClassroomId] = useState("");
  const [subject, setSubject] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (window.database) {
      const teacherData = { name, address, classroomId, subject };
      window.database
        .addTeacher(teacherData)
        .then(() => {
          setName("");
          setAddress("");
          setClassroomId("");
          setSubject("");
        })
        .catch((error) => console.error("Failed to add teacher:", error));
    }
  };

  return (
    <div className={styles.container}>
      <h2>Teacher Registration</h2>
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
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
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
        <button type="submit">Register Teacher</button>
      </form>
    </div>
  );
}

export default TeacherRegistration;
