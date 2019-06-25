const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/*', (request, response) => {
    response.sendFile(path.join(__dirname + '/dist/coolshare/index.html'));
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
});