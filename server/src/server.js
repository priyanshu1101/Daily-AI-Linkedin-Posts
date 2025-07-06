const express = require('express');
const linkedinPostRouter = require('./routes/linkedinPost');
const app = express();
const port = process.env.PORT || 3000;


app.use('/api/linkedin', linkedinPostRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});