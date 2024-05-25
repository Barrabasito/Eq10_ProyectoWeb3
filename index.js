const express = require('express');
const cors = require('cors'); // Importa cors
require('dotenv').config({ path: require('find-config')('.env') });

const app = express();
const bodyParser = require("body-parser");

const branchesRoutes = require('./routes/branches.js');
const employeesRoutes = require('./routes/employees.js');
const salesRoutes = require('./routes/sales.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Habilita CORS
app.use(cors());

app.use('/api', branchesRoutes);
app.use('/api', employeesRoutes);
app.use('/api', salesRoutes);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
