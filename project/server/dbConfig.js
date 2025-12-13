const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URL
    ); 
    console.log('DB Connected');
  } catch (error) {
    console.error('DB Connection Failed', error);
  }
};

module.exports = { connectDB };
//mongodb+srv://ajaytalari:<db_password>@cluster0.ryjlhkw.mongodb.net/?appName=Cluster0