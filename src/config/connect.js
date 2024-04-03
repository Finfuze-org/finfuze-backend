// const mongoose = require('mongoose')

// const connectDb =(url)=> {
//     return mongoose.connect(url,{
//         useUnifiedTopology: true,
//         useNewUrlParser: true
//     })
// }


// module.exports = connectDb


const pg = require("pg");
const {Pool} = pg
require("dotenv").config()


let localConfigPool = {
    user: process.env.pgUSER,
    password:process.env.pgPASSWORD,
    host:process.env.pgHOST,
    port:process.env.pgPORT,
    database:process.env.DATABASE
}

let poolConfig = process.env.DATABASE_URL? {connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized: false}}: localConfigPool

const pool = new Pool(poolConfig)
if(pool){
    console.log("connected to pg database")
}
module.exports = pool