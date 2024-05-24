require('dotenv').config()
const express = require('express');
const morgan = require('morgan')
const cors = require('cors')

const pgDB = require('./src/config/connect')
const notFoundMiddleware = require('./src/middleware/notFound');
const error_handler_middleware = require('./src/middleware/errorHandler');
const corsOptions = require('./src/config/cors');
const authRouter  = require("./src/routes/authRoute")
const dashBoardRouter = require("./src/routes/dashboardRoute")

const app = express()

//Middleware
app.use(cors(corsOptions))
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//Router
app.all('/', (req, res)=> {
    try{
        console.log('Hello world!');
        res.status(200).json({data: 'Success!'})
    }catch(error){
        throw error;
    }
})
app.use("/api/v1/auth",authRouter)
app.use("/api/v1/dashboard")
//Error handling middleware
app.use(notFoundMiddleware)
app.use(error_handler_middleware)

const port = process.env.PORT || 3000

const start =  () => {
    try {
        console.log(pgDB.options)
        app.listen(port, () => {
            console.log(`listening on port: ${port}...`);
        })
    } catch (error) {
        console.log(error);
    }
}
start()