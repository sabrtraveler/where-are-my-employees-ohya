// the getNames function gets the full names of employees from the DB 
// data is returned as an array of strings 
async function getNames() {
  const [namesData] = await connection.query(
    `SELECT first_name, last_name FROM employee`
  );
  const names = [];
  namesData.forEach((element) => {
    let name = `${element.first_name} ${element.last_name}`;
    names.push(name);
  });
  return names;
}

// the getRoles function gets all the roles from the DB 
// data is returned as an array of strings 
async function getRoles() {
  const [rolesData] = await connection.query(`SELECT title FROM role`);
  const roles = [];
  rolesData.forEach((element) => {
    roles.push(element.title);
  });
  return roles;
}

// the getDepartments function gets list of all the departments from the DB
// It returns an array of strings of the different departments
async function getDepartments() {
  const [departmentsData] = await connection.query(
    `SELECT name FROM department`
  );
  const departments = [];
  departmentsData.forEach((element) => {
    departments.push(element.name);
  });
  return departments;
}

// the getEmployeeId function gets an employee id from the DB 
// returns a name id for that user 
async function getEmployeeId(name) {
  const splitName = name.split(" ");
  const firstName = splitName[0];
  const lastName = splitName[1];

  const [employeeIdData] = await connection.query(
    "SELECT id FROM employee WHERE ? AND ?",
    [
      {
        first_name: firstName,
      },
      {
        last_name: lastName,
      },
    ]
  );
  return employeeIdData[0].id;
}

// a role is passed into the function and the id for that role is returned 
// the id is taken from the DB
async function getRoleId(role) {
  const [roleIdData] = await connection.query("SELECT id FROM role WHERE ?", {
    title: role,
  });
  return roleIdData[0].id;
}

// the getDepartment id function gets the department id from the DB that matches the department put into the function 
async function getDepartmentId(department) {
  const [departmentIdData] = await connection.query(
    "SELECT id FROM department WHERE ?",
    {
      name: department,
    }
  );
  return departmentIdData[0].id;
}

// export all functions for use in the index.js file 
module.exports = {
  getNames: getNames,
  getRoles: getRoles,
  getDepartments: getDepartments,
  getEmployeeId: getEmployeeId,
  getRoleId: getRoleId,
  getDepartmentId: getDepartmentId,
};
