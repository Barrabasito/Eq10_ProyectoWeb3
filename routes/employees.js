const express = require('express');
const router = express.Router();
const employeesController = require('../controllers/employees');
const branchesController = require('../controllers/branches');

router.get('/employees', async (req, res) => {
    try {
        let employees = await employeesController.getEmployees();
        res.json(employees);
    } catch (ex) {
        res.status(500).json({ message: ex.message });
    }
});

router.get('/employee/:id', async (req, res) => {
    try {
        let employee = await employeesController.getEmployee(req.params.id);
        res.json(employee);
    } catch (ex) {
        res.status(500).json({ message: ex.message });
    }
});

router.post('/employee', async (req, res) => {
    try {
        let employee = await employeesController.createEmployee(req.body.names, req.body.surnames, req.body.birthdate, req.body.rfc, req.body.employeeAddress, req.body.email, req.body.workArea, req.body.salary, req.body.branchId);
        let branchEmployee = await branchesController.updateQuantityEmployees(req.body.branchId);
        res.json(employee);
    } catch (ex) {
        res.status(500).json({ message: ex.message });
    }
});

router.put('/employee', async (req, res) => {
    try {
        let employee = await employeesController.updateAmount(req.body.IdEmployee, req.body.amountSalesInMoney);
        res.json(employee);
    } catch (ex) {
        res.status(500).json({ message: ex.message });
    }
});

module.exports = router;
