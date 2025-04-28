require('./src/config/env');  

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectToMongoDB = require('./src/config/mongodb');  
const feedbackRoutes = require('./src/routes/feedback.routes'); 
const { PORT } = require('./src/config/env');  

// Connect to MongoDB
connectToMongoDB();

const app = express();

app.use(cors());
app.use(bodyParser.json());  // Middleware to parse JSON data
app.use('/api/v1/feedback', feedbackRoutes);  

app.listen(PORT, () => {
  console.log(`Feedback service running on port ${PORT}`);
});
