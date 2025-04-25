require('./src/config/env');  
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectToMongoDB = require('./src/config/mongodb'); 
const paymentRoutes = require('./src/routes/payment.routes'); 


const { PORT } = require('./src/config/env');  

// Connect to MongoDB
connectToMongoDB();

const app = express();

app.use(cors());
app.use(bodyParser.json()); 

app.use('/api/v1/payments', paymentRoutes); 

app.listen(PORT, () => {
  console.log(`Payment service running on port ${PORT}`);
});
