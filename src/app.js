const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/auth_routes');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/auth', authRoutes);

app.get('/api/protected', require('./middleware/auth_middleware'), (req, res) => {
  res.json({ message: `Hello user ${req.user.userId}, kamu berhasil akses private route` });
}); // api pakai middleware jwt

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
