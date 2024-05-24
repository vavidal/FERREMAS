const express = require('express');
const WebpayPlus = require("transbank-sdk").WebpayPlus;
const asyncHandler = require("../Servidor/async_handler");
WebpayPlus.configureForTesting();
const bp = require('body-parser')
const path = require('path');
const mysqlConnection = require('../Servidor/mysql');
/*const webpay = require('../Servidor/transbank');              WEBPAY*/
const { redirect } = require('express/lib/response');

const app = express();
const port = 3010;
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

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

//Llamar a todos los productos
app.get('/', (req, res) => {
  const num = req.query.num || 1;  
  const query = 'CALL PRC_PRODS(?);';
  mysqlConnection.query(query, [num], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.render('inicio', { tools: results[0] });
  });
});


app.get('/contacto',(req,res)=>{
  res.render('contacto')
});

app.get('/blog',(req,res)=>{
  res.render('blog')
});

app.get('/nosotros',(req,res)=>{
  res.render('nosotros')
});

app.get('/informacion_pedido',(req,res)=>{
  res.render('informacion_pedido')
});

// Trae el producto con el id
app.get('/producto/:id', (req, res) => {
  const productId = req.params.id;
  const query = 'CALL PRC_PRODS(1);';  
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    const product = results[0].find(tool => tool.NUMERITO == productId);
    if (product) {
      res.render('producto', { product });
    } else {
      res.status(404).send('Producto no encontrado');
    }
  });
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

app.get('/equipos_medicion', (req, res) => {
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

app.post('/webpay', asyncHandler(async function (request, response) {
  const datos = request.body;
  /*datos_tarjeta:{
    num_tarjeta: 4051885600446623,
    cvv: 123,
    rut: 11111111-1,
    clave: 123
  }*/
  const {total} = datos;
  const Valor = total;
  let buyOrder = "O-" + Math.floor(Math.random() * 10000) + 1;
  let sessionId = "S-" + Math.floor(Math.random() * 10000) + 1;
  let amount = Valor;
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
  res.render('cart');
});

app.get('/busqueda/:id', (req, res) => {
  const id = req.params.id;
  const query = `CALL PRC_CART(${id});`;  
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results[0]);
  });
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}/inicio`);
  }); 