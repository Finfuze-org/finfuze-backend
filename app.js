require('dotenv').configDotenv()
const express = require('express');
const pgDB = require('./src/config/connect')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

const notFoundMiddleware = require('./src/middleware/notFound');
const error_handler_middleware = require('./src/middleware/errorHandler');
const corsOptions = require('./src/config/cors');

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

//Error handling middlware
app.use(notFoundMiddleware)
app.use(error_handler_middleware)

const port = process.env.PORT || 8000

const start = async () => {
    try {
        await console.log(pgDB.options)
        app.listen(port, () => {
            console.log(`listening on port: ${port}...`);
        })
    } catch (error) {
        console.log(error);
    }
}
start()