import express from 'express'


const app = express()
app.use(express.json())

app.get('/api-nachipa',(req,res)=> {
    res.send('Hello from the server-api Nachipa!')
})


export default app