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
                "Update Employee role",
                "Update Employee manager_id"
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
                case "Update Employee role":
                    getEmployee();
                    break;
                case "Update Employee manager_id":
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
    console.log(query);
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
    });
    runTracker();

};


// View ALL Employees By Department
function getDepartment() {
    var departmentArray = [];
    var query = "SELECT name from department";

    connection.query(query, (err, res) => {
        for (let i = 0; i < res.length; i++) {
            departmentArray.push(res[i].name);

        }
        console.log("this is the department array:", departmentArray);
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
            console.log(answer.department);



            var query = "select employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, employee.manager_id ";
            query += "FROM employee ";
            query += "inner join role ";
            query += "ON employee.role_id = role.id ";
            query += "inner join department ";
            query += "on department.id = role.department_id ";
            query += 'WHERE department.name = "' + answer.department + '";';

            console.log(query);
            connection.query(query, function (err, res) {
                console.log("---------------View ALL Employees By Department---------------------");
                console.table(res);
            });
            runTracker();
        });

};

//View ALL Employees By Manager

function displayManager() {

    connection.query("SELECT * FROM `employee` where manager_id IS NOT NULL ", function (err, res) {
        console.log("---------------View ALL Employees By Manager---------------------");
        console.table(res);
    });
    runTracker();
};

//Add New Employee
function addEmployee() {
   
    inquirer
        .prompt(
            {
                name: "firstName",
                type: "input",
                message: "What's the new employee's first name"
            },
            {
                name: "lastName",
                type: "input",
                message: "What's the new employee's last name"
            },
            {
                name: "title",
                type: "input",
                message: "What's his/her title"
            },
            {
                name: "department",
                type: "input",
                message: "What's his/her department"
            })
        .then((answer) => {
            var first_Name = answer.firstName;
            var last_Name = answer.lastName;
            var title = answer.title;
            var departmentName = answer.department;
            var title = answer.title;

            if (title != null && departmentName != null) {

                var query = `INSERT INTO employeedb.employee (first_name, last_name) VALUES (' ${first_Name}', '${last_Name}', '${title}', '${departmentName}')`;

                connection.query(query, function (err, res) {
                    if (err) throw err;
                    console.log("successfully inserted! ")
                })
                runTracker();
            }

        })
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
            employeeArray.push({"first_name":firstName, "last_name" :lastName, "fullName":fullName});

        }
        console.log("this is the department array:", employeeArray);
        getEmployeeName(employeeArray);

    })
};

function getEmployeeName(employeeArray) {
    var newArray =[];

    for (let i = 0; i < employeeArray.length; i++) {
        newArray.push(employeeArray[i].fullName);
        
    };


    inquirer
        .prompt({
            name: "employee",
            type: "list",
            message: " Who do you want to update his/her role?",
            choices: newArray
        })
        .then((answer) => {
            console.log("i am here");
            for (let i = 0; i < employeeArray.length; i++) {
                if (answer.employee === employeeArray[i].fullName) {

                    var first_Name =  employeeArray[i].first_name;
                    var last_Name = employeeArray[i].last_name;
                    updateEmployeeRole(first_Name,last_Name);
                }  
            }
        });

};

function updateEmployeeRole(first_Name,last_Name) {
    console.log(first_Name);
    console.log(last_Name);

    
}

