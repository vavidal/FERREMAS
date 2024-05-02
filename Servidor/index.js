const express = require('express');
const path = require('path');
const mysqlConnection = require('../Servidor/mysql');
const { redirect } = require('express/lib/response');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  const query = 'CALL PRC_EMPLEADO();';  // Modify this query based on your database schema
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.render('index', { users: results[0] });
  });
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
  }); 