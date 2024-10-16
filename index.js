const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const comicRoutes = require('./routes/comicRoutes');
app.use('/api/comics', comicRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
