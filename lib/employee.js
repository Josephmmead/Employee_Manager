class Employee {
    constructor(firstName, lastName, roleId, managerId) {
        this.first = firstName
        this.last = lastName
        this.id = roleId
        this.manager = managerId
    }

    getFirstName() {
        return this.firstName
    }

    getLastName() {
        return this.lastName
    }

    getId() {
        return this.roleId
    }

    getManagerId() {
        return this.managerId
    }

    getEmployee() {
        return "Employee"
    }

}

module.exports = Employee