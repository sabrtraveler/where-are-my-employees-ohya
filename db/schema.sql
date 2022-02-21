-- if the DB already there then drop it 
DROP DATABASE IF EXISTS employee_trackerDB;
-- create the DB
CREATE DATABASE employee_trackerDB;
-- use the DB
USE employee_trackerDB;

-- create table with name employee with id, firstname, lastname, role id and manager id        
CREATE TABLE employee (
	id INTEGER AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    PRIMARY KEY (id)
);

-- create a table with name role with id, title, salary and department 
CREATE TABLE role (
	id INTEGER AUTO_INCREMENT NOT NULL,
	title VARCHAR(30) NOT NULL,
	salary DECIMAL NOT NULL,
	department_id INTEGER NOT NULL,
	PRIMARY KEY (id)
);

-- create a table with department with id and name 
CREATE TABLE department (
	id INTEGER AUTO_INCREMENT NOT NULL,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);