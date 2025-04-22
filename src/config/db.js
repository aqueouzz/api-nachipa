import mongoose from "mongoose";
import chalk from 'chalk';


const connectDB =  (url) => {
    //mongoose.set("strictQuery", false);
    mongoose.connect(url)
    .then(() => {
        console.log(chalk.bgBlue.black('🚀 Database connected successfully'));
    })
}

export default connectDB;