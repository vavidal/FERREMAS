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

//Llamar a todos los productos desde el inicio
app.get('/', (req, res) => {
  const query = 'CALL PRC_PROD();';
  mysqlConnection.query(query, (error, results) => {
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
  const queries = [
    'CALL PRC_PRODS(1);',
    'CALL PRC_PRODS(2);',
    'CALL PRC_PRODS(3);',
    'CALL PRC_PRODS(4);',
    'CALL PRC_PRODS(5);',
    'CALL PRC_PRODS(6);'
  ];
  
  let products = [];

  const executeQuery = (queryIndex) => {
    if (queryIndex >= queries.length) {
      const product = products.find(tool => tool.NUMERITO == productId);
      if (product) {
        res.render('producto', { product });
      } else {
        res.status(404).send('Producto no encontrado');
      }
      return;
    }

    mysqlConnection.query(queries[queryIndex], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
        return;
      }
      products = products.concat(results[0]);
      executeQuery(queryIndex + 1);
    });
  };

  executeQuery(0);
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
  let returnUrl = "http://localhost:3010/resultado";
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

app.get('/resultado', asyncHandler(async function (req, res) {
  //Flujos:
  //1. Flujo normal (OK): solo llega token_ws
  //2. Timeout (más de 10 minutos en el formulario de Transbank): llegan TBK_ID_SESION y TBK_ORDEN_COMPRA
  //3. Pago abortado (con botón anular compra en el formulario de Webpay): llegan TBK_TOKEN, TBK_ID_SESION, TBK_ORDEN_COMPRA
  //4. Caso atipico: llega todos token_ws, TBK_TOKEN, TBK_ID_SESION, TBK_ORDEN_COMPRA
  let params = req.method === 'GET' ? req.query : req.body;

  let token = params.token_ws;
  let tbkToken = params.TBK_TOKEN;
  let tbkOrdenCompra = params.TBK_ORDEN_COMPRA;
  let tbkIdSesion = params.TBK_ID_SESION;

  let step = null;
  let stepDescription = null;
  let viewData = {
    token,
    tbkToken,
    tbkOrdenCompra,
    tbkIdSesion
  };

  if (token && !tbkToken) {//Flujo 1
    const commitResponse = await (new WebpayPlus.Transaction()).commit(token);
    viewData = {
      token,
      commitResponse,
    };
    if (commitResponse.status == "AUTHORIZED") {
      step = "El pago fue exitoso.";
      stepDescription = "El pago fue exitoso. Gracias por su compra.";
      res.render("transac_exitosa", {datos : viewData});
      return;
    }else{
      step = "El pago fue rechazado.";
      stepDescription = "El pago fue rechazado por la entidad bancaria. Por favor, intenta nuevamente.";
    }
  }
  else if (!token && !tbkToken) {//Flujo 2
    step = "El pago fue anulado por tiempo de espera.";
    stepDescription = "Pasaron más de 10 minutos desde el inicio de la transacción. Transacción rechazada.";
  }
  else if (!token && tbkToken) {//Flujo 3
    step = "El pago fue anulado por el usuario.";
    stepDescription = "Anulaste el pago. Si quieres, puedes volver a intentarlo.";
  }
  else if (token && tbkToken) {//Flujo 4
    step = "El pago es inválido.";
    stepDescription = "El pago no fue procesado. Por favor, intenta nuevamente.";
  }
  res.render("transac_fallida", {datos: {step, stepDescription, viewData} });
}));

app.post('/finalizar_venta',(req,res)=>{
  const datos = req.body.datos;
  const carrito = req.body.carrito.carro;
  const token = req.body.token;

  const total = datos.total;
  const cliente = datos.cliente;

  const venta = `CALL PRC_VENTA('${cliente.nombre}','${cliente.email}','${cliente.direccion}',${cliente.rut},${total},'${token}');`;
  mysqlConnection.query(venta);
  carrito.forEach(element=>{
    const query = `CALL PRC_AGG_DET_PED(${element[0]},${element[1]});`;  
    mysqlConnection.query(query);
  });
});

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