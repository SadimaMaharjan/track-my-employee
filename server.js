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
    database: "employeetracker_db",
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
        "Delete Role",
        "Delete Employee",
        "View Total Utilised Budget Of A Department",
      ],
    })
    .then((answers) => {
      switch (answers.menu) {
        case "View All Departments":
          viewAllDepartments();
          break;
        case "View All Roles":
          viewAllRoles();
          break;
        case "View All Employees":
          viewAllEmployees();
          break;
        case "Add A Department":
          addDepartment();
          break;
        case "Add A Role":
          addRole();
          break;
        case "Add An Employee":
          addEmployee();
          break;
        case "Update An Employee Role":
          updateEmployeeRole();
          break;
        case "Update Employee Managers":
          updateEmployeeManager();
          break;
        case "View Employees By Manager":
          viewEmployeeByManager();
          break;
        case "View Employees By Department":
          viewemployeesByDepartment();
          break;
        case "Delete Department":
          deleteDepartment();
          break;
        case "Delete Role":
          deleteRole();
          break;
        case "Delete Employee":
          deleteEmployee();
          break;
        case "View Total Utilised Budget Of A Department":
          viewTotalBudget();
          break;
      }
    });
}

//View All Departments
function viewAllDepartments() {
  const sqlQuery =
    "SELECT department.id AS id,department.name AS name FROM department";
  db.query(sqlQuery, (err, result) => {
    if (err) throw err;
    console.table(result);
    startProgram();
  });
}

//View All Roles
function viewAllRoles() {
  const sqlQuery = "SELECT * FROM role";
  db.query(sqlQuery, (err, result) => {
    if (err) throw err;
    console.table(result);
    startProgram();
  });
}
startProgram();
