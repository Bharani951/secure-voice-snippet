// // src/config/db.js

// Add this logging to your db.js file
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     const uri =
//       process.env.NODE_ENV === "production"
//         ? process.env.MONGODB_URI_PROD
//         : process.env.MONGODB_URI;

//     if (!uri) {
//       throw new Error(
//         "MongoDB connection URI not defined in environment variables"
//       );
//     }

//     await mongoose.connect(uri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log("MongoDB connection initialized");
//   } catch (error) {
//     console.error("MongoDB connection error:", error.message);
//     process.exit(1); // Exit with failure
//   }
// };

// module.exports = connectDB;
