// Load env variables
dotenv.config();

// Dependencies
import 'express-async-errors';
import app from './app.js';
import dotenv from 'dotenv';
import chalk from 'chalk';

// Import docs local

import db from './config/db.js';

// Port
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Connect to database
    await db(process.env.MONGO_URI_DEV);
    app.listen(PORT, '0.0.0.0', () => {
      console.log(chalk.bgGreen.black(`🚀 Server is running on port ${PORT}`));
      console.log(
        chalk.bgBlue.white(
          `🚀  Documentación Swagger en http://localhost:4500/api-docs`
        )
      );
    });
  } catch (error) {
    console.error(
      chalk.bgRed.white('❌ Database connection failed:', error.message)
    );
    process.exit(1);
  }
};

// Run server
startServer();
