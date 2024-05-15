const express = require('express');
const router = express.Router();
const salesController = require('../controllers/sales');
const employeesController = require('../controllers/employees');

router.get('/sales', async (req, res) => {
    try {
        let sales = await salesController.getSales();
        res.json(sales);
    } catch (ex) {
        res.status(500).json({ message: ex.message });
    }
});

router.get('/sale/:id', async (req, res) => {
    try {
        let sale = await salesController.getSale(req.params.id);
        res.json(sale);
    } catch (ex) {
        res.status(500).json({ message: ex.message });
    }
});

router.get('/employeesales/:id', async (req, res) => {
    try {
        let sales = await salesController.getSalesByEmployeeId(req.params.id);
        res.json(sales);
    } catch (ex) {
        res.status(500).json({ message: ex.message });
    }
});

router.post('/sale', async (req, res) => {
    try {
        let sale = await salesController.createSale(req.body.employeeId, req.body.saleDate, req.body.soldProducts, req.body.prices);
        let employeeSale = await employeesController.updateAmount(req.body.employeeId, req.body.prices.reduce((a, b) => a + b, 0));
        res.json(sale);
    } catch (ex) {
        res.status(500).json({ message: ex.message });
    }
});

module.exports = router;
