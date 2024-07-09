const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./database/connection');
const cors = require('cors');
const path = require('path');
const { setupAssociations } = require('./models/associations');

const authRoutes = require('./routes/authRoutes');
const boardRoutes = require('./routes/boardRoutes');
const cardRoutes = require('./routes/cardRoutes');
const userRoutes = require('./routes/userRoutes');
const collaborationRoutes = require('./routes/collaborationRoutes');
const shareRoutes = require('./routes/shareRoutes');
const folderRoutes = require('./routes/folderRoutes');

const errorMiddleware = require('./middlewares/errorMiddleware');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use('/api/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/boards', boardRoutes);
app.use('/cards', cardRoutes);
app.use('/api/collaborations', collaborationRoutes);
app.use('/share', shareRoutes);
app.use('/api/folders', folderRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(errorMiddleware);

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection established.');
    setupAssociations();
    return sequelize.sync();
  })
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });