-- insert the values into employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Jason', 'Reddington', 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Kimberly', 'Perry', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Lily', 'Porter', 3, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Zak', 'Baker', 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Trina', 'Yen', 5, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Ivan', 'Brown', 6, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Peter', 'Williams', 7, 6);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Robert', 'Gray', 3, 2);


-- insert the values into role table 
INSERT INTO role (title, salary, department_id)
VALUES ('Sales Lead', 100000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ('Sales Person', 80000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ('Lead Engineer', 150000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ('Software Engineer', 120000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ('Accountant', 125000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ('Legal Team Lead', 250000, 4);
INSERT INTO role (title, salary, department_id)
VALUES ('Lawyer', 190000, 4);

-- insert the values into the department role 
INSERT INTO department (name)
VALUES ('Sales');
INSERT INTO department (name)
VALUES ('Engineering');
INSERT INTO department (name)
VALUES ('Finance');
INSERT INTO department (name)
VALUES ('Legal');