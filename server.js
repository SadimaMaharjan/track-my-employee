const inquirer = require("inquirer");
const express = require("express");
// get the client
const mysql = require("mysql2");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

// connect to the database

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "",
    database: employeetracker_db,
  },
  console.log("Connected to the EmployeeTracker database")
);

db.connect((err) => {
  if (err) throw err;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

function startProgram() {
  inquirer
    .prompt({
      type: "list",
      name: "menu",
      message: "What would you like to do?",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add A Department",
        "Add A Role",
        "Add An Employee",
        "Update An Employee Role",
        "Update Employee Managers",
        "View Employees By Manager",
        "View Employees By Department",
        "Delete Department",
        "Delete Roles",
        "Delete Employees",
        "View Total Utilised Budget Of A Department",
      ],
    })
    .then((answers) => {});
}

startProgram();
