import app from './app.js';
import db from './config/db.js'
import chalk from 'chalk';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

const PORT = process.env.PORT || 3000;  

const startServer = async () => {
    try {
        await db(process.env.MONGO_URI_DEV); // Connect to the database
        
        app.listen(PORT,()=> {
            console.log(chalk.bgGreen.black(`🚀 Server is running on port ${PORT}`));
        })

    } catch (error) {
        console.error(chalk.bgRed.white('❌ Database connection failed:', error.message));
        process.exit(1); // Exit the process with failure
    }
}

startServer(); // Start the server

