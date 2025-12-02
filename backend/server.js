require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');
const cors = require('cors');

const PORT = process.env.PORT || 5000;

// Connect to DB then start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
});

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));