const express = require('express');
const linkedinPostRouter = require('./routes/linkedinPost');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');


app.use('/api/linkedin', linkedinPostRouter);
app.get('/isActive', (req, res) => {
  res.status(200).json({ message: 'Server is active' });
});

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

