const mongoose = require('mongoose');


mongoose.connect(process.env.mongoURL)

const db = mongoose.connection 

db.on('connected',()=>{
  console.log('MongoDB is connected')
})

db.on('error',()=>{
  console.log('MongoDB connection failed')
})

db.on('disconnected',()=>{
  console.log('MongoDB is didconnected')
})

module.exports = db

