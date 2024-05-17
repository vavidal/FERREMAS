const express = require('express');
const WebpayPlus = require("transbank-sdk").WebpayPlus;
const asyncHandler = require("../Servidor/async_handler");
WebpayPlus.configureForTesting();
const path = require('path');
const mysqlConnection = require('../Servidor/mysql');
/*const webpay = require('../Servidor/transbank');              WEBPAY*/
const { redirect } = require('express/lib/response');
const bodyParser = require('body-parser');

const app = express();
const port = 3010;
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/inicio', (req, res) => {
  const query = 'CALL PRC_EMPLEADO();';  
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.render('index', { users: results[0] });
  });
});

app.get('/',(req,res)=>{
  res.render('inicio')
});

app.get('/herramientas_manuales', (req, res) => {
  const query = 'CALL PRC_PRODS(1);';  
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.render('herramientasmanuales', { tools: results[0] });
  });
});

app.get('/materiales_basicos', (req, res) => {
  const query = 'CALL PRC_PRODS(2);';  
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.render('materialesbasicos', { tools: results[0] });
  });
});

app.get('/equipos_seguridad', (req, res) => {
  const query = 'CALL PRC_PRODS(3);';  
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.render('equiposseguridad', { tools: results[0] });
  });
});

app.get('/tornillos_anclajes', (req, res) => {
  const query = 'CALL PRC_PRODS(4);';  
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.render('tornillosanclajes', { tools: results[0] });
  });
});

app.get('/fijaciones_adhesivos', (req, res) => {
  const query = 'CALL PRC_PRODS(5);';  
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.render('fijacionesadhesivos', { tools: results[0] });
  });
});

app.get('/equipos_edicion', (req, res) => {
  const query = 'CALL PRC_PRODS(6);';  
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.render('equiposmedicion', { tools: results[0] });
  });
});

app.get('/webpay', asyncHandler(async function (request, response, next) {
  let buyOrder = "O-" + Math.floor(Math.random() * 10000) + 1;
  let sessionId = "S-" + Math.floor(Math.random() * 10000) + 1;
  let amount = Math.floor(Math.random() * 1000) + 1001;
  let returnUrl = "http://localhost:3010/";
  const createResponse = await (new WebpayPlus.Transaction()).create(
    buyOrder,
    sessionId,
    amount,
    returnUrl
  );

  let token = createResponse.token;
  let url = createResponse.url;

  let viewData = {
    buyOrder,
    sessionId,
    amount,
    returnUrl,
    token,
    url,
  };
  response.render("webpay", {datos : viewData});
})
);

app.get('/carrito',(req,res)=>{
  res.render('cart')
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}/inicio`);
  }); 