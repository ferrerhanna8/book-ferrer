const express = require('express');
const serverless = require('serverless-http');
const router = require('./routes/bookRoute')
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const cloudDB = 'mongodb+srv://hannaferrer:W6iiKmEWXKyWxK2z@hanna.j1gg0qf.mongodb.net/BookDB?retryWrites=true&w=majority&appName=Hanna';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

mongoose
  .connect(cloudDB)
  .then(()=> console.log('Connected to BookDB'))
  .catch((error)=>console.error('Failed to connect to BookDB'));

app.use('/.netlify/functions/api', router);
// module.exports.handler = serverless(app);

// app.use('/',(req,res)=>[
//   res.json({message: 'Hello world'})
// ])
app.listen(5030,()=>{
  console.log('Server is running on port 5030')
})