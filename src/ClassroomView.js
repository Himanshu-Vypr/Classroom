// ClassroomView.js
import React, { useState, useEffect } from "react";
import styles from "./ClassroomView.module.css";

function ClassroomView({ classroomId }) {
  const [classroomDetails, setClassroomDetails] = useState(null);

  useEffect(() => {
    if (window.database && classroomId) {
      window.database
        .getClassroomDetails(classroomId)
        .then((details) => setClassroomDetails(details))
        .catch((error) =>
          console.error("Failed to load classroom details:", error)
        );
    }
  }, [classroomId]);

  if (!classroomDetails) {
    return <p>Loading classroom details...</p>;
  }

  return (
    <div className={styles.container}>
      <h2>{classroomDetails.classroom.name}</h2>
      <h3>Students</h3>
      <ul>
        {classroomDetails.students.map((student) => (
          <li key={student.id} className="listView">
            {student.name} - Roll No: {student.rollNumber}
          </li>
        ))}
      </ul>
      <h3>Teacher</h3>
      <ul>
        {classroomDetails.teachers.map((teacher) => (
          <li key={teacher.id} className="listView">
            {teacher.name} - Subject: {teacher.subject}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClassroomView;
