const express = require('express');
const connectDB = require('./config/db');
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Init Middlewares
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API is Running...'));

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/singers', require('./routes/api/singers'));

app.listen(PORT, () => console.log(`Server iniciou na porta ${PORT}`));
