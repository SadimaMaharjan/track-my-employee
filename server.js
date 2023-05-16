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

function viewAllEmployees() {
  const sqlQuery =
    "SELECT employee.id AS id,employee.first_name,employee.last_name,role.title,department.name AS department,salary,CONCAT(manager.first_name,' ',manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id=role.id LEFT JOIN department ON department.id=role.department_id LEFT JOIN employee AS manager ON employee.manager_id=manager.id ORDER BY employee.id";
  db.query(sqlQuery, (err, result) => {
    if (err) throw err;
    console.table(result);
    startProgram();
  });
}

// Add A Department
function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      name: "department_name",
      message: "Enter the department name you want to add: ",
    })
    .then((answers) => {
      const sqlQuery = "INSERT INTO department (name) VALUES (?)";
      const params = [answers.department_name];
      db.query(sqlQuery, params, (err, result) => {
        if (err) throw err;
        console.log(`${params} department successfully added to the database!`);
        startProgram();
      });
    });
}

// Add a new role
function addRole() {
  let departments = {
    name: [],
    id: [],
  };
  db.query("SELECT * FROM department", (err, result) => {
    if (err) throw err;
    for (i of result) {
      departments.name.push(i.name);
      departments.id.push(i.id);
    }
  });
  //const departmentList = result.map((data) => data.name);

  inquirer
    .prompt([
      { type: "input", name: "title", message: "Enter job title: " },
      {
        type: "input",
        name: "salary",
        message: "Enter salary for the role: ",
        validate: (salary) => {
          if (isNaN(salary) || salary < 0) {
            return "Please enter a number";
          }
          return true;
        },
      },
      {
        type: "list",
        name: "department",
        message: "Select the department associated with this role: ",
        choices: departments.name,
      },
    ])
    .then((answer) => {
      const title = answer.title;
      const salary = answer.salary;
      const departmentIndex = departments.name.indexOf(answer.department);
      const department_id = departments.id[departmentIndex];
      const params = [title, salary, department_id];
      const sqlQuery =
        "INSERT INTO role (title,salary,department_id) VALUES (?,?,?)";
      db.query(sqlQuery, params, (err, result) => {
        if (err) throw err;
        console.log(`${title}  successfully added to the roles in database!`);
        startProgram();
      });
    });
}
startProgram();
