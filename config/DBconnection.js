const mongoose = require('mongoose')
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>{
    console.log('mongodb connected');
    // console.log(MONGODB_URI);
})
.catch(()=>{
    console.log('mongodb failed to connect');
})

module.exports = mongoose;