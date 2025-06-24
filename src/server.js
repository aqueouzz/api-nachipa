import 'express-async-errors';
import app from './app.js';
import db from './config/db.js';
import dotenv from 'dotenv';
import chalk from 'chalk';
dotenv.config();

const PORT = process.env.PORT || 3000;

// console.log(process.env);

const startServer = async () => {
  try {
    await db(process.env.MONGO_URI_DEV);
    app.listen(PORT, '0.0.0.0', () => {
      console.log(chalk.bgGreen.black(`🚀 Server is running on port ${PORT}`));
    });
  } catch (error) {
    console.error(
      chalk.bgRed.white('❌ Database connection failed:', error.message)
    );
    process.exit(1);
  }
};

startServer();
