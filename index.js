// import modules and assign variable
const inquirer = require("inquirer");
const mysql = require("mysql2/promise");
const cTable = require("console.table");
require("dotenv").config();

// import getData.js module and assign variable
const getData = require("./modules/getData.js");

// Asking the user to select an option
const starterQuestion = {
  name: "action",
  type: "list",
  message: "Please choose an option.",
  choices: [
    "Exit",
    "View all Employees",
    "View all Employees By Department",
    "View all Employees By Manager",
    "Add Employee",
    "Remove Employee",
    "Update Employee Role",
    "Update Employee Manager",
    "View all Roles",
    "Add a Role",
    "Remove a Role",
    "View all Departments",
    "Add a Department",
    "Remove a Department",
    "View the Total Utilized Budget of a Department",
  ],
};

// call the main function
main();

// main function connects to database to ask user to selecct an option 
// check for errors and terminal connection afterwards
async function main() {
  try {
    await connect();
    await prompt();
  } catch (error) {
    console.log(error);
  } finally {
    connection.end();
  }
}

// the connect function connects to the database with the info provided 
// console logs that it is connected
async function connect() {
  connection = await mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.password,
    database: "employee_trackerDB",
  });
  console.log("connected as id " + connection.threadId);
}

// prompt function prompts the user the starter question and based on the selection a function is called 
async function prompt() {
  const answer = await inquirer.prompt(starterQuestion);
  switch (answer.action) {
    case "Exit":
      break;
    case "View all Employees":
      await viewEmployees();
      break;
    case "View all Employees By Department":
      await viewEmployeesByDepartment();
      break;
    case "View all Employees By Manager":
      await viewEmployeesByManager();
      break;
    case "Add Employee":
      await addEmployee();
      break;
    case "Remove Employee":
      await removeEmployee();
      break;
    case "Update Employee Role":
      await updateEmployeeRole();
      break;
    case "Update Employee Manager":
      await updateEmployeeManager();
      break;
    case "View all Roles":
      await viewRoles();
      break;
    case "Add a Role":
      await addRole();
      break;
    case "Remove a Role":
      await removeRole();
      break;
    case "View all Departments":
      await viewDepartments();
      break;
    case "Add a Department":
      await addDepartment();
      break;
    case "Remove a Department":
      await removeDepartment();
      break;
    case "View the Total Utilized Budget of a Department":
      await utilizedBudget();
      break;
  }
}

// the viewEmployees function shows all the employees with info 
// takes data from 3 tables in the DB and joins the 3 tables (employees, role, department)
// console log the data in a table 
async function viewEmployees() {
  const [
    rows,
  ] = await connection.query(`SELECT E1.id, E1.first_name, E1.last_name, title, name AS department, salary, CONCAT( E2.first_name, ' ', E2.last_name) as manager
  FROM employee AS E1
  LEFT JOIN role ON E1.role_id = role.id
  LEFT JOIN department ON role.department_id = department.id
  LEFT JOIN employee AS E2 ON E2.id = E1.manager_id`);
  console.log("\n\n");
  console.table(rows);
  console.log("\n\n");
  await prompt();
}

// the viewEmployeesByDepartment function shows all the employees in a department 
// takes data from 3 tables in the DB and joins the 3 tables (employees, role, department)
// console log the data in a table 
async function viewEmployeesByDepartment() {
  const departments = await getData.getDepartments();
  const answer = await inquirer.prompt({
    name: "department",
    message: "What department would you like to see?",
    type: "list",
    choices: departments,
  });
  const departmentId = await getData.getDepartmentId(answer.department);
  const [rows] = await connection.query(
    `SELECT CONCAT(E1.first_name, ' ', E1.last_name) as employee, title, salary, CONCAT( E2.first_name, ' ', E2.last_name) as manager
  FROM employee AS E1
  LEFT JOIN role ON E1.role_id = role.id
  LEFT JOIN department ON role.department_id = department.id
  LEFT JOIN employee AS E2 ON E2.id = E1.manager_id
  WHERE ?`,
    {
      department_id: departmentId,
    }
  );
  console.log("\n\n");
  console.table(rows);
  console.log("\n\n");
  await prompt();
}

// the viewEmployeesByManager function shows all the employees that work for a manager
// takes data from 3 tables in the DB and joins the 3 tables (employees, role, department)
// console log the data in a table 
async function viewEmployeesByManager() {
  const managers = await getData.getNames();
  const answer = await inquirer.prompt({
    name: "manager",
    message: "Which manager's employees do you want to see?",
    type: "list",
    choices: managers,
  });
  const employeeId = await getData.getEmployeeId(answer.manager);
  const [rows] = await connection.query(
    `SELECT  CONCAT( E1.first_name, ' ', E1.last_name) as employee, name AS department, title, salary
  FROM employee AS E1
  LEFT JOIN role ON E1.role_id = role.id
  LEFT JOIN department ON role.department_id = department.id
  LEFT JOIN employee AS E2 ON E2.id = E1.manager_id
  WHERE E1.manager_id = ${employeeId}`
  );
  console.log("\n\n");
  console.table(rows);
  console.log("\n\n");
  await prompt();
}

// the addEmployee function givers users the ability to add employee to the employee table 
// the user is asked questions about the employee 
// data is put into the DB
async function addEmployee() {
  const names = await getData.getNames();
  names.unshift("None");
  const roles = await getData.getRoles();

  const answer = await inquirer.prompt([
    {
      name: "firstName",
      message: "What is the employee's first name?",
    },
    {
      name: "lastName",
      message: "What is the employee's last name?",
    },
    {
      name: "role",
      message: "What is the employees's role?",
      type: "list",
      choices: roles,
    },
    {
      name: "employee",
      message: "Who is the employee's manager?",
      type: "list",
      choices: names,
    },
  ]);

  let employeeId;

  if (answer.employee === "None") {
    employeeId = null;
  } else {
    employeeId = await getData.getEmployeeId(answer.employee);
  }

  const roleId = await getData.getRoleId(answer.role);

  const [results] = await connection.query("INSERT INTO employee SET ?", {
    first_name: answer.firstName,
    last_name: answer.lastName,
    role_id: roleId,
    manager_id: employeeId,
  });
  await prompt();
}

// the removeEmployee function lets the user remove an employee 
// the user is asked what employee to remove 
// the data is put in the DB 
async function removeEmployee() {
  const names = await getData.getNames();
  const answer = await inquirer.prompt({
    name: "employee",
    message: "Which employee do you want to remove?",
    type: "list",
    choices: names,
  });
  const employeeId = await getData.getEmployeeId(answer.employee);

  const [results] = await connection.query("DELETE FROM employee WHERE ?", {
    id: employeeId,
  });
  await prompt();
}

// the updateEmployeeRole function lets the user update an employees role 
// the user is asked questions about the employee and role 
// updated employee is put in the DB
async function updateEmployeeRole() {
  const names = await getData.getNames();
  const roles = await getData.getRoles();
  const answer = await inquirer.prompt([
    {
      name: "employee",
      message: "Which employee do you want to update?",
      type: "list",
      choices: names,
    },
    {
      name: "role",
      message: "What is their new role?",
      type: "list",
      choices: roles,
    },
  ]);
  const roleId = await getData.getRoleId(answer.role);
  const employeeId = await getData.getEmployeeId(answer.employee);

  const [results] = await connection.query(`UPDATE employee SET ? WHERE ?`, [
    {
      role_id: roleId,
    },
    {
      id: employeeId,
    },
  ]);
  await prompt();
}

// the updateEmployeeManager function lets the user update an employee manager 
// the user is asked about the employee and manager
// the updated employee info is put in the DB 
async function updateEmployeeManager() {
  const names = await getData.getNames();

  const answer = await inquirer.prompt([
    {
      name: "employee",
      message: "Which employee do you want to update?",
      type: "list",
      choices: names,
    },
    {
      name: "manager",
      message: "What is their new manager?",
      type: "list",
      choices: names,
    },
  ]);
  const employeeId = await getData.getEmployeeId(answer.employee);
  const managerId = await getData.getEmployeeId(answer.manager);

  const [results] = await connection.query(`UPDATE employee SET ? WHERE ?`, [
    {
      manager_id: managerId,
    },
    {
      id: employeeId,
    },
  ]);
  await prompt();
}

// the viewRoles function lets the user view the existing roles in DB 
// data is shown in the terminal
async function viewRoles() {
  const [rows] = await connection.query(`SELECT title AS roles FROM role`);
  console.log("\n\n");
  console.table(rows);
  console.log("\n\n");
  await prompt();
}

// the addRole function lets a user add a role to the roles table 
// The user is asked questions about the role 
// the data is put in the DB 
async function addRole() {
  const departments = await getData.getDepartments();
  const answer = await inquirer.prompt([
    {
      name: "newRole",
      message: "What is the new role you want to add?",
    },
    {
      name: "salary",
      message: "What is the salary for this role?",
    },
    {
      name: "department",
      message: "Which department does this role belong to?",
      type: "list",
      choices: departments,
    },
  ]);
  const departmentId = await getData.getDepartmentId(answer.department);

  const [results] = await connection.query("INSERT INTO role SET ?", {
    title: answer.newRole,
    salary: answer.salary,
    department_id: departmentId,
  });
  await prompt();
}

// the removeRole function lets a user remove an existing role from the DB 
// They are asked which role to remove
async function removeRole() {
  const roles = await getData.getRoles();
  const answer = await inquirer.prompt({
    name: "role",
    message: "Which role do you want to remove?",
    type: "list",
    choices: roles,
  });
  const roleId = await getData.getRoleId(answer.role);

  const [results] = await connection.query("DELETE FROM role WHERE ?", {
    id: roleId,
  });
  await prompt();
}

// the viewDepartments function lets the user view all the departments
// puts the department names and shows them in a table 
async function viewDepartments() {
  const [rows] = await connection.query(
    `SELECT name AS departments FROM department`
  );
  console.log("\n\n");
  console.table(rows);
  console.log("\n\n");
  await prompt();
}

// the addDepartment function lets the user add new department into the DB
// the user is asked the name of the department they want to add 
async function addDepartment() {
  const answer = await inquirer.prompt({
    name: "newDepartment",
    message: "What is the name of the new department?",
  });
  const [results] = await connection.query("INSERT INTO department SET ?", {
    name: answer.newDepartment,
  });
  await prompt();
}

// the removeDepartment function lets the user remove a department from the DB 
// the user is asked which department they want to remove 
async function removeDepartment() {
  const departments = await getData.getDepartments();
  const answer = await inquirer.prompt({
    name: "department",
    message: "Which department do you want to remove?",
    type: "list",
    choices: departments,
  });
  const departmentId = await getData.getDepartmentId(answer.department);
  const [results] = await connection.query("DELETE FROM department WHERE ?", {
    id: departmentId,
  });
  await prompt();
}

// the utilizedBudget console logs a table with the utilized budgets for a department x
// the user is asked what department they want to seee 
async function utilizedBudget() {
  const departments = await getData.getDepartments();
  const answer = await inquirer.prompt({
    name: "department",
    message: "Which department's utilized budget would you like to see?",
    type: "list",
    choices: departments,
  });
  const departmentId = await getData.getDepartmentId(answer.department);
  const [employeeSalaries] = await connection.query(
    `SELECT salary FROM role WHERE?`,
    {
      department_id: departmentId,
    }
  );
  let sum = 0;
  employeeSalaries.forEach((item) => {
    sum += parseInt(item.salary);
  });
  let budgetArray = [
    { department: answer.department, total_utilized_budget: sum },
  ];
  console.log("\n\n");
  console.table(budgetArray);
  console.log("\n\n");
  await prompt();
}