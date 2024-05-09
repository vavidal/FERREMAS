const express = require('express');
const path = require('path');
const mysqlConnection = require('../Servidor/mysql');
/*const webpay = require('../Servidor/transbank');              WEBPAY*/
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

app.get('/inicio',(req,res)=>{
  res.render('inicio')
});

app.get('/herramienta_electrica', (req, res) => {
  const query = 'CALL PRC_PRODS(1);';  // Modify this query based on your database schema
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.render('herelec', { tools: results[0] });
  });
});


/*WEBPAY

app.get('/eb',(req, res)=>{
  let urlReturn = '/';
let urlFinal = '/';
let amount = 10000;
let sessionId = 'sesion123456';
let buyOrder = 'ordenCompra123456';

transaction.create(buyOrder, sessionId, amount, urlReturn)
  .then(response => {
    // Aquí manejas la respuesta inicial, guardas los tokens si es necesario, etc.
    console.log(response);
    // Redireccionar al usuario al formulario de Webpay
    // response.url contiene la URL y response.token contiene el token de la transacción
  })
  .catch(error => {
    console.error(error);
  });

}); */


app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
  }); 