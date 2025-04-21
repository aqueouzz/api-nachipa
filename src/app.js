import express from 'express'
import morgan from 'morgan'

const app = express()

app.use(express.json())
app.use(morgan("tiny"));
app.use('/uploads',express.static('src/uploads'))


// Importing routes
import authRoutes from './routes/authRoutes.js'

//importing midedleware

//Route default
app.get('/api-nachipa/v1',(req,res)=> {
    res.send('Hello from the server-api Nachipa!')
})

// Routes API
app.use('/api-nachipa/v1/auth',authRoutes)


export default app