const express = require('express');
const app = express();
module.exports = app; // this line is only used to make testing easier.

// remember to plug in your router and any other middleware you may need here (i.e. body parser, mounting any router-level middleware, etc.)
app.use('/users', require('./routes/index'));
app.use(express.urlencoded({extended: false}));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.sendStatus(err.status);
});

if (!module.parent) app.listen(3000); // conditional prevents a very esoteric EADDRINUSE issue with mocha watch + supertest + npm test.
