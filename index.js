const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");
const { removeRole, removeDepartment, updateEmployeeManager, findAllRoles, createRole } = require("./db");
require("console.table");

init();

// Display logo text, load main prompts
function init() {
  const logoText = logo({ name: "Employee Manager" }).render();

  console.log(logoText);

  loadMainPrompts();

}

async function loadMainPrompts() {
  const { choice } = await prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        {
          name: "View All Employees",
          value: "VIEW_EMPLOYEES"
        },
        {
          name: "View All Employees By Department",
          value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
        },
        {
          name: "View All Employees By Manager",
          value: "VIEW_EMPLOYEES_BY_MANAGER"
        },
        {
          name: "Add Employee",
          value: "ADD_EMPLOYEE"
        },
        {
          name: "Remove Employee",
          value: "REMOVE_EMPLOYEE"
        },
        {
          name: "Update Employee Role",
          value: "UPDATE_EMPLOYEE_ROLE"
        },
        {
          name: "update Employee Manager",
          value: "UPDATE_EMPLOYEE_MANAGER"
        },
        {
          name: "View All Roles",
          value: "VIEW_ALL_ROLES"
        },
        {
          name: "Add Roles",
          value: "ADD_ROLE"
        },
        {
          name: "Remove Role",
          value: "REMOVE_ROLE"
        },
        {
          name:"View all Departments",
          value:"VIEW_DEPARTEMENTS"
        },
        {
          name: "Add Department",
          value: "ADD_DEPARTMENT"
        },
        {
          name: "Remove Department",
          value: "REMOVE_DEPARTMENT"
        },
        {
          name: "Exit",
          value: "Exit"
        }
      ]
    }
  ]);

  // Call the appropriate function depending on what the user chose
  switch (choice) {
    case "VIEW_EMPLOYEES":
      return viewEmployees();
    case "VIEW_EMPLOYEES_BY_DEPARTMENT":
      return viewEmployeesByDepartment();
    case "VIEW_EMPLOYEES_BY_MANAGER":
      return viewEmployeesByManager();
    case "ADD_EMPLOYEE":
      return addEmployee();
    case "REMOVE_EMPLOYEE":
      return removeEmployee();
    case "UPDATE_EMPLOYEE_ROLE":
      return updateEmployeeRole();
    case "UPDATE_EMPLOYEE_MANAGER":
      return updateEmployeesManager();
    case "VIEW_ALL_ROLES":
      return viewRoles();
    case "ADD_ROLE":
      return addRole();
    case "REMOVE_ROLE":
      return voidRole();
    case "VIEW_DEPARTEMENTS":
      return findAllDepartments();
    case "ADD_DEPARTMENT":
      return addDepartment();
    case "REMOVE_DEPARTMENT":
      return voidDepartment();
    default:
      return exit();
  }
}

async function viewEmployees() {
  const employees = await db.findAllEmployees();

  console.log("\n");
  console.table(employees);

  loadMainPrompts();
}

async function viewEmployeesByDepartment() {
  const departments = await db.findAllDepartments();

  const departmentChoices = departments.map(({ id, name }) => ({
    name: name,
    value: id
  }));

  const { departmentId } = await prompt([
    {
      type: "list",
      name: "departmentId",
      message: "What department would you like to see employees for?",
      choices: departmentChoices
    }
  ]);

  const employees = await db.findAllEmployeesByDepartment(departmentId);

  console.log("\n");
  console.table(employees);

  loadMainPrompts();
}

async function viewEmployeesByManager() {
  const managers = await db.findAllEmployees();

  const managerChoices = managers.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { managerId } = await prompt([
    {
      type: "list",
      name: "managerId",
      message: "What employee do you want to see direct reports for?",
      choices: managerChoices
    }
  ]);

  const employees = await db.findAllEmployeesByManager(managerId);

  console.log("\n");

  if (employees.length === 0) {
    console.log("The selected employee has no direct reports");
  } else {
    console.table(employees);
  }

  loadMainPrompts();
}

async function addEmployee() {
  const roles = await db.findAllRoles();
  const employees = await db.findAllEmployees();

  const employee = await prompt([
    {
      name: "first_name",
      message: "What is the employee's first name?"
    },
    {
      name: "last_name",
      message: "What is the employee's last name?"
    }
  ]);

  const roleChoices = roles.map(({ id, title }) => ({
    name: name,
    value: id
  }));

  const { roleID } = await prompt ([
    {
      type:"list",
      name:"roleID",
      message: "What is this employee's role?",
      choices: roleChoices
    }]);

  employee.role_ID = roleID;

  const managerChoices = employee.map (({ id, first_name, last_name}) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  managerChoices.unshift({ name: "NONE", value: null});

  const { managerID } = await prompt([
    {
      type: "list",
      name: "managerID",
      message: "Who is this employee's manager?",
      choices: managerChoices
    }
  ]);

  employee.manager_ID = managerID;

  await db.addEmployee(employee);

  console.log(`Added ${employee.first_name} ${employee.last_name} to the database`);

  loadMainPrompts();
}

async function removeEmployee() {
  const employees = await db.findAllEmployees();

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee do you want to remove?",
      choices: employeeChoices
    }
  ]);

  await db.removeEmployee(employeeId);

  console.log("Removed employee from the database");

  loadMainPrompts();
}

async function updateEmployeeRole() {
  const employee = await db.findAllEmployees();
  const employeeChoice = employee.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeID } = await prompt([
    {
      type:"list",
      name: "employeeID",
      message: "Which employee would you like to update their role?",
      choices: employeeChoice
    }
  ]);

  const role = await db.findAllRoles();
  const roleChoices = role.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const { roleID } = await prompt([
    {
      type:"list",
      name:"roleID",
      message: "What role would you like to assign this employee?",
      choices: roleChoices
    }
  ]);

  await db.updateEmployeeRole(employeeID, roleID);

  console.log("Updated this employee's role");

  loadMainPrompts();
}

async function updateEmployeesManager(){

  const employee = await db.findAllEmployees();
  const employeeChoices = employee.map(({ id, first_name, last_name}) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeID } = await prompt ([
    {
      type: "list",
      name: "employeeID",
      message: "Which employee would you like to update their manager?",
      choices: employeeChoices
    }
  ]);

  const manager = await db.findAllPossibleManagers(employeeID);
  const managerChoices = manager.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { managerID } = await prompt([
    {
      type:"list",
      name:"managerID",
      message: "Who would you like to set as this employees manager?",
      choices: managerChoices
    }
  ]);

  await db.updateEmployeeManager(employeeID, managerID);

  console.log("This employee's manager has been updated");

  loadMainPrompts();

}

async function viewRoles(){
  const Roles = await db.findAllRoles();

  console.log("\n");
  console.log(Roles);
 
  loadMainPrompts()
}

async function addRole(){
  const department = await db.findAllDepartments();
  const departmentChoices = department.map(({ id, name}) => ({
    name: name,
    vaule: id
  }));

  const role = await prompt ([
    {
      name: "title",
      message: "What is the role?"
    },
    {
      name: "salary",
      message: "What is the salary of this role?"
    },
    {
      type:"list",
      name:"department_id",
      Message:"What department does this role report to?",
      choices: departmentChoices
    }
  ]);

  await db.createRole(role);

  console.log(`Added ${role.title} to the database`);

  loadMainPrompts();
};

async function voidRole() {

 const role = await db.findAllRoles();
 const roleChoices= role.map(({ id, title }) => ({
   name:title,
   value: id
 }));

 const { roleID } = await prompt ([
   {
     type: "list",
     name: "roleID",
     message: " What role would you like to remove?",
     choices: roleChoices
   }
 ]);

 await db.removeRole(roleID);

 console.log("This role has been removed.");

 loadMainPrompts();
}

async function findAllDepartments() {
  const departments = await db.findAllDepartments();

  console.log("\n");
  console.log(departments);
 
  loadMainPrompts()
}

async function addDepartment() {
  const department = await prompt([
    {
      name:"newDepartment",
      message: "What is the name of the department?"
    }
  ]);

  await db.addDepartment(department);
 
  console.log(`The department ${department.newDepartment} has been added.`);

  loadMainPrompts();
}

async function voidDepartment() {

  const department = await db.findAllDepartments();
  const departmentChoices = department.map(({ id, name}) => ({
    name: name,
    value: id
  }));

  const { departmentID } = await prompt([
    {
      type:"list",
      name:"departmentID",
      message:"What department would you like to remove?",
      choices: departmentChoices
    }
  ]);

  await db.removeDepartment(departmentID);

  console.log("This department has been removed");
  
  loadMainPrompts();
}

async function exit() {
    console.log("Goodbye!");
    process.exit();
}



