const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

let mainWindow;

// Initialize SQLite database
const db = new sqlite3.Database("./sqlite.db", (err) => {
  if (err) {
    console.error("Error opening database: ", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }

  // Ensure the users table exists
  db.run(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)",
    (err) => {
      if (err) {
        console.error("Error creating table: ", err.message);
      } else {
        console.log("Users table ready.");
      }
    }
  );

  db.run(
    "CREATE TABLE IF NOT EXISTS classrooms (id INTEGER PRIMARY KEY, name TEXT)",
    (err) => {
      if (err) {
        console.error("Error creating classrooms table: ", err.message);
      }
    }
  );

  db.run(
    "CREATE TABLE IF NOT EXISTS students (id INTEGER PRIMARY KEY, name TEXT, address TEXT, rollNumber TEXT, classroomId INTEGER, FOREIGN KEY (classroomId) REFERENCES classrooms (id))",
    (err) => {
      if (err) {
        console.error("Error creating students table: ", err.message);
      }
    }
  );

  db.run(
    "CREATE TABLE IF NOT EXISTS teachers (id INTEGER PRIMARY KEY, name TEXT, address TEXT, classroomId INTEGER, subject TEXT, FOREIGN KEY (classroomId) REFERENCES classrooms (id))",
    (err) => {
      if (err) {
        console.error("Error creating teachers table: ", err.message);
      }
    }
  );
});

// Function to create the main window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Preload script
      contextIsolation: true, // Enable context isolation for security
      enableRemoteModule: false,
    },
  });

  mainWindow.loadURL("http://localhost:3000");

  mainWindow.on("closed", () => (mainWindow = null));
}

// Event listener for when the app is ready
app.on("ready", createWindow);

// Quit the app when all windows are closed (except on macOS)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Reactivate the window if the app icon is clicked (macOS)
app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC communication to handle database queries from renderer process (React)
ipcMain.handle("get-users", async () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
      if (err) {
        console.error("Error fetching users: ", err.message);
        reject(err);
      } else {
        resolve(rows); // Send the user data to the renderer
      }
    });
  });
});

// IPC communication to insert a new user into the database
ipcMain.handle("add-user", async (event, userName) => {
  return new Promise((resolve, reject) => {
    db.run("INSERT INTO users (name) VALUES (?)", [userName], function (err) {
      if (err) {
        console.error("Error adding user: ", err.message);
        reject(err);
      } else {
        resolve({ id: this.lastID, name: userName }); // Return new user data
      }
    });
  });
});

ipcMain.handle("get-classrooms", async () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM classrooms", [], (err, rows) => {
      if (err) {
        console.error("Error fetching classrooms: ", err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});

// Add a new classroom
ipcMain.handle("add-classroom", async (event, classroomName) => {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO classrooms (name) VALUES (?)",
      [classroomName],
      function (err) {
        if (err) {
          console.error("Error adding classroom: ", err.message);
          reject(err);
        } else {
          resolve({ id: this.lastID, name: classroomName });
        }
      }
    );
  });
});

// Add a new student
ipcMain.handle("add-student", async (event, studentData) => {
  return new Promise((resolve, reject) => {
    const { name, address, rollNumber, classroomId } = studentData;
    db.run(
      "INSERT INTO students (name, address, rollNumber, classroomId) VALUES (?, ?, ?, ?)",
      [name, address, rollNumber, classroomId],
      function (err) {
        if (err) {
          console.error("Error adding student: ", err.message);
          reject(err);
        } else {
          resolve({ id: this.lastID, name, address, rollNumber, classroomId });
        }
      }
    );
  });
});

// Add a new teacher
ipcMain.handle("add-teacher", async (event, teacherData) => {
  return new Promise((resolve, reject) => {
    const { name, address, classroomId, subject } = teacherData;
    db.run(
      "INSERT INTO teachers (name, address, classroomId, subject) VALUES (?, ?, ?, ?)",
      [name, address, classroomId, subject],
      function (err) {
        if (err) {
          console.error("Error adding teacher: ", err.message);
          reject(err);
        } else {
          resolve({ id: this.lastID, name, address, classroomId, subject });
        }
      }
    );
  });
});

// Close the database connection when the app quits
app.on("quit", () => {
  db.close((err) => {
    if (err) {
      console.error("Error closing the database: ", err.message);
    } else {
      console.log("Database connection closed.");
    }
  });
});
