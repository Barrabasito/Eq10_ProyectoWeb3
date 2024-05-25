const express = require('express');
const router = express.Router();
const branchesController = require('../controllers/branches');

router.get('/branches', async (req, res) => {
    try {
        let branches = await branchesController.getBranches()
        res.json(branches);
    } catch (ex) {
        res.status(500).json({ message: ex.message });
    }
});

router.get('/branch/:id', async (req, res) => {
    try {
        let branch = await branchesController.getBranch(req.params.id)
        res.json(branch);
    } catch (ex) {
        res.status(500).json({ message: ex.message });
    }
});

router.post('/branch', async (req, res) => {
    try {
        let branch = await branchesController.createBranch(req.body.name, req.body.branchAddress, req.body.phone, req.body.email, req.body.rfc);
        // let branch = await branchesController.createBranch(req.body.name, req.body.street, req.body.outerNumber, req.body.innerNumber, req.body.city, req.body.state, req.body.country, req.body.postalCode, req.body.phone, req.body.email, req.body.rfc);
        res.json(branch);
    } catch (ex) {
        res.status(500).json({ message: ex.message });
    }
});

// router.put('/branch', async (req, res) => {
//     try {
//         let branch = await branchesController.updateQuantityEmployees(req.body.id, req.body.quantityEmployees);
//         res.json(branch);
//     } catch (ex) {
//         res.status(500).json({ message: ex.message });
//     }
// });

module.exports = router;
