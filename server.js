var mysql = require("mysql");
var inquirer = require("inquirer");


const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '6yq2wwaw',
    database: 'employeedb'
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Welcome to employee DB tracker!!")
    runTracker();

});

function runTracker() {
    console.log( " -------------------------------------------------------------------------------------------------------------- ")
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View ALL Employees",
                "View ALL Employees By Department",
                "View ALL Employees By Manager",
                "Add New Employee",
                "Update Employee info"
            ]
        }).then((answer) => {
            switch (answer.action) {
                case "View ALL Employees":
                    displayAll();
                    break;
                case "View ALL Employees By Department":
                    getDepartment();
                    break;
                case "View ALL Employees By Manager":
                    displayManager();
                    break;
                case "Add New Employee":
                    addEmployee()
                    break;
                case "Update Employee info":
                    getEmployee();
                    break;
            }
        });

};

//start functions 
// -------------------------------------------------------------
// View all employee
function displayAll() {
 

    var query = "select employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, employee.manager_id ";
    query += "FROM employee ";
    query += "inner join role ";
    query += "ON employee.role_id = role.id ";
    query += "inner join department ";
    query += "ON department.id = role.department_id  ";
    
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log( " --------------------------------View all employee------------------------------------------------------ ");
        console.table(res);
    });
    runTracker();

};


// View ALL Employees By Department
function getDepartment() {
    console.log( " -------------------------------------------------------------------------------------------------------------- ");

    var departmentArray = [];
    var query = "SELECT name from department";

    connection.query(query, (err, res) => {
        for (let i = 0; i < res.length; i++) {
            departmentArray.push(res[i].name);

        }

        displayDepartment(departmentArray)
    })
};

function displayDepartment(departmentArray) {

    inquirer
        .prompt({
            name: "department",
            type: "list",
            message: " What department would you like to search for its employees?",
            choices: departmentArray
        })
        .then((answer) => {

            var query = "select employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, employee.manager_id ";
            query += "FROM employee ";
            query += "inner join role ";
            query += "ON employee.role_id = role.id ";
            query += "inner join department ";
            query += "on department.id = role.department_id ";
            query += 'WHERE department.name = "' + answer.department + '";';

            
            connection.query(query, function (err, res) {

                console.log("---------------View ALL Employees By Department---------------------");
                console.table(res);
            });
           
            runTracker();
        });

};

//View ALL Employees By Manager

function displayManager() {
   

    connection.query("SELECT * FROM employee where manager_id = 2 ", function (err, res) {
        console.log("---------------View ALL Employees By Manager---------------------");
        console.table(res);
    });
    runTracker();
};

//Add New Employee
function addEmployee() {
    console.log("ID references: 1- CEO, 2- manager, 3- sales, 4 -CFO");
    console.log ("if he/she do have Manager, his ID is 2!");
    inquirer
        .prompt([
            {
                name: "firstName",
                type: "input",
                message: "What's the new employee's first name?"
            },
            {
                name: "lastName",
                type: "input",
                message: "What's the new employee's last name?"
            },
            {
                name: "title",
                type: "input",
                message: "What's his/her title (please using the ID)?"
            },
            {
                name: "manager",
                type: "input",
                message: "What's his/her manager ID?"
            }
        ])
        .then((answer) => {
            var first_Name = answer.firstName;
            var last_Name = answer.lastName;
            var title = parseInt(answer.title);
            var manager = parseInt(answer.manager);
     
            
            if (title !== null) {


                var query = "INSERT INTO employee (first_Name, last_Name, role_id, manager_id) VALUES (?, ?, ?, ?)";
              
                connection.query(query, [first_Name,last_Name,title,manager],function (err, res) {
                    if (err) throw err;
                    
                    
                    
                })
                console.log("successfully inserted! ");
                runTracker();
            };

        });
};

//Update Employee

function getEmployee() {

    var employeeArray = [];
    var query = "select first_name, last_name FROM employee";

    connection.query(query, (err, res) => {

        for (let i = 0; i < res.length; i++) {
            var firstName = res[i].first_name;
            var lastName = res[i].last_name;
            var fullName = firstName + " " + lastName;
            employeeArray.push({ "first_name": firstName, "last_name": lastName, "fullName": fullName });

        }

        getEmployeeName(employeeArray);

    })
};

function getEmployeeName(employeeArray) {
    var newArray = [];

    for (let i = 0; i < employeeArray.length; i++) {
        newArray.push(employeeArray[i].fullName);

    };

    inquirer
        .prompt({
            name: "employee",
            type: "list",
            message: " Who do you want to update?",
            choices: newArray
        })
        .then((answer) => {
            
                for (let i = 0; i < employeeArray.length; i++) {
                    if (answer.employee === employeeArray[i].fullName) {

                        var first_Name = employeeArray[i].first_name;
                        var last_Name = employeeArray[i].last_name;
                        updateEmployee(first_Name, last_Name);

                    }
                }
        });

};

function updateEmployee(first_Name, last_Name) {
    console.log(" You are updating " + first_Name + " " + last_Name);

    inquirer
        .prompt({
            name: "choice",
            type: "list",
            choices: ["Update his/her role", "Update his/her manager"]
        })
        .then((answer) => {
            if (answer.choice === "Update his/her role") {
                console.log("Role ID references: 1- CEO, 2- manager, 3- sales, 4 -CFO");
                inquirer
                    .prompt({
                        name: "roleId",
                        type: "input",
                        message: " What role would you like to update for its employees? ( please using the role ID) "
                    })
                    .then((answer) => {

                        var query = 'UPDATE employee SET employee.role_id =' + answer.roleId;
                        query += ' WHERE first_name = "' + first_Name + '"';
                        query += ' and last_name = "' + last_Name + '"';

                        connection.query(query, function (err, res) {
                            if (err) throw err;
                            
                        });
                        console.log("Succesfully updated!");
                        runTracker();
                    });
            };

            if (answer.choice === "Update his/her manager") {
                inquirer
                    .prompt({
                        name: "managerId",
                        type: "input",
                        message: " Please enter your manager's ID "
                    })
                    .then((answer) => {

                        var query = 'UPDATE employee SET employee.manager_id =' + answer.managerId;
                        query += ' WHERE first_name = "' + first_Name + '"';
                        query += ' and last_name = "' + last_Name + '"';

                        connection.query(query, function (err, res) {
                            if (err) throw err;

                            
                        });
                        
                        console.log("Succesfully updated!");
                        runTracker();
                    });
            }
        });

};


