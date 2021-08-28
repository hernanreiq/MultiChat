const express = require('express');
const app = express();
const path = require('path');
//settings
const PORT = process.env.PORT || 3700;

//static files 
app.use(express.static(path.join(__dirname, 'public')));

//start the server
app.listen(PORT, () => {
    console.log('Server is ready on port:', PORT);
});