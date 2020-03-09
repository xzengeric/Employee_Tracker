DROP DATABASE IF EXISTS employeedb;
create database employeedb;
use employeedb;

CREATE TABLE department (
	id INTEGER(11) AUTO_INCREMENT NOT NULL,
	name VARCHAR(30),
    PRIMARY KEY (id)
);

CREATE TABLE role (
	id INTEGER(11) AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL, 
    salary DECIMAL(10,2) NOT NULL, 
    department_id INTEGER(11) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
	id INTEGER(11) AUTO_INCREMENT NOT NULL,
    first_Name VARCHAR(30) NOT NULL, 
    last_Name VARCHAR(30) NOT NULL, 
    role_id INTEGER(11) NOT NULL, 
    manager_id INTEGER(11),
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES role(id)
);


-- date for testing

INSERT INTO department (name) VALUES ('Department A');
INSERT INTO department (name) VALUES ('Department B');
INSERT INTO department (name) VALUES ('Department C');

INSERT INTO role (title,salary,department_id) VALUES ('CEO',1235000.88,1);
INSERT INTO role (title,salary,department_id) VALUES ('manger',235000.23,2);
INSERT INTO role (title,salary,department_id) VALUES ('sales',35000.99,2);
INSERT INTO role (title,salary,department_id) VALUES ('CFO',835000.65,3);


INSERT INTO employee (first_Name, last_Name, role_id) values ('Eric', 'the CEO',1);
INSERT INTO employee (first_Name, last_Name, role_id) values ('Eric', 'the manager',2);
INSERT INTO employee (first_Name, last_Name, role_id, manager_id) values ('Peter', 'the sales',3,2);
INSERT INTO employee (first_Name, last_Name, role_id, manager_id) values ('John', 'the sales',3,2);
INSERT INTO employee (first_Name, last_Name, role_id, manager_id) values ('Danny', 'the sales',3,2);
INSERT INTO employee (first_Name, last_Name, role_id, manager_id) values ('Sharon', 'the sales',3,2);
INSERT INTO employee (first_Name, last_Name, role_id) values ('Kelly', 'the CFO',4);