const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const multer = require('multer');
const WebpayPlus = require("transbank-sdk").WebpayPlus;
const asyncHandler = require("../Servidor/async_handler");
WebpayPlus.configureForTesting();
const bp = require('body-parser')
const path = require('path');
const mysqlConnection = require('../Servidor/mysql');
/*const webpay = require('../Servidor/transbank');              WEBPAY*/
const { redirect } = require('express/lib/response');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');



const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const app = express();
const port = 3010;
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/node_modules', express.static(path.join(__dirname,'..', 'node_modules')));
app.use(bp.json());
app.use(bp.urlencoded({ extended: false }));

app.use(session({
  secret: 'funcionara?', 
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

const storage = multer.diskStorage({
  destination: 'public/Images/Productos',
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
const upload = multer({ storage:storage, limits: { fieldSize: 25 * 1024 * 1024 } })

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

app.get('/', (req, res) => {
  const query = 'CALL PRC_PRODS(1);';
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

app.get('/admin',(req,res)=>{
  const query = `CALL PRC_ADMIN();`;
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.render('admin', { prods: results[0] });
  });
});

app.get('/admin/agregar',(req,res)=>{
  const query = 'CALL TP_PRODS()';
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.render('add_prod', { tp_producto: results[0] });
  });
});

app.post('/valid_productos', upload.single('file'),(req, res)=> {
 const {
      tipoProd,
      nombreProd,
      stockProd,
      costoProducto,
      ventaProducto,
      descripcion
    } = req.body;
  
    // Check for required fields first
    if (!tipoProd || !nombreProd || !stockProd || !costoProducto || !ventaProducto || !descripcion || !req.file) {
      return res.status(400).send('Todos los campos son obligatorios.');
    }
    const imagen = req.file.filename;
    const registrar = `CALL PRC_INS_PRODUCTO(?, ?, ?, ?, ?, ?, ?)`;
    mysqlConnection.query(
      registrar,
      [
        tipoProd,
        nombreProd,
        stockProd,
        costoProducto,
        ventaProducto,
        descripcion,
        imagen
      ],
      function (error) {
        if (error) {
          console.error(error);
          return res.status(500).send('Error al almacenar los datos del producto.');
        } else {
          console.log('Datos del producto almacenados correctamente');
          return res.redirect('/admin');
        }
      }
    );
});

app.get('/admin/editar/:id', (req, res) => {
  const id_prod = req.params.id;
  const query = `CALL PRC_PROD_EDI(${id_prod});`;
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error al obtener los datos del proyecto');
    } else {
      const prod = results[0][0];
      if (prod) {
        const query = 'CALL TP_PRODS()';
        mysqlConnection.query(query, (error, results) => {
          if (error) {
            console.error('Error executing query:', error);
            res.status(500).send('Internal Server Error');
            return;
          }
        res.render('edi_prod', { prod, tp_producto: results[0] });
        });   
      } else {
        res.status(404).send('El producto no existe');
      }
    }
  });
});

app.post('/borrar/:id', (req, res) => {
  const id_prod = req.params.id;
  const query = `CALL PRC_ELI_PROD(?)`;
  mysqlConnection.query(query, [id_prod], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error al eliminar el producto');
    } else {
      const mensaje = results[0][0].mensaje;
      if (mensaje === 'Producto eliminado correctamente') {
        console.log('Producto eliminado correctamente');
        res.redirect('/admin');
      } else {
        console.log('El Producto no existe');
        res.status(404).send('El Producto no existe');
      }
    }
  });
});

app.post('/admin/editar/prod/:id', upload.single('file'), (req, res) => {
  const id_prod = req.params.id;
  const {
    tipoProd,
    nombreProd,
    stockProd,
    costoProducto,
    ventaProducto,
    descripcion
  } = req.body;


  const imageName = req.file ? req.file.filename : null;
  var query;
  var elements;

  if(imageName == null){
    query = `CALL PRC_UPD_SINIMG(?,?,?,?,?,?)`;
    elements= [id_prod, nombreProd, stockProd, costoProducto, ventaProducto, descripcion];
    
  }else{
    query = `CALL PRC_UPD_CONIMG(?,?,?,?,?,?,?,?)`;
    elements= [id_prod, tipoProd, nombreProd, stockProd, costoProducto, ventaProducto, descripcion,imageName];
  }

  mysqlConnection.query(
    query,
    elements,
    (error) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error al actualizar el producto');
      } else {
        console.log('Producto actualizado correctamente');
        res.redirect('/admin');
      }
    }
  );
});

app.post('/stock/:id', (req, res) => {
  const id_prod = req.params.id;
  const {stockId} = req.body;
  const query = `CALL PRC_UPD_STOCK(?,?)`;
  mysqlConnection.query( query, [id_prod,stockId], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error al actualizar el stock');
    } else {
      console.log('Stock actualizado correctamente');
      res.redirect('/admin');
    }
  });
});

app.post('/numSeguimiento/:id', asyncHandler(async function (req, res) {
  const id_venta = req.params.id;
  const {numSeg,email} = req.body;
  const query = `CALL PRC_NUM_SEG(?,?)`;
  mysqlConnection.query( query, [id_venta,numSeg], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error al actualizar el stock');
    } else {
      console.log('Número de seguimiento almacenado correctamente.');
    }
  });
  try {
    const html = `
    <h1>¡MUCHAS GRACIAS POR TU COMPRA!</h1>
    <h2>La empresa encargada del envío es ChileExpress, y el número de seguimiento es: ${numSeg}. ¡Gracias por preferirnos!.</h2>`;
    
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'ferremasg9@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: 'FERREMAS - MÁS FERRETERÍA <ferremasg9@gmail.com>',
      to: email,
      subject: '¡MUCHAS GRACIAS POR TU COMPRA - SEGUIMIENTO!',
      text: '¡MUCHAS GRACIAS POR TU COMPRA - SEGUIMIENTO!',
      html: html,
    };

    const result = await transport.sendMail(mailOptions);
    console.log("Mail enviado");
    res.redirect("/sales");
  } catch (error) {
    console.error('Error enviando el correo:', error);
  }
}));

app.get('/ver_seguimiento',(req,res)=>{
  const data = req.query.data;
  const query = `CALL PRC_VER_SEG(${data})`;
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results[0][0]);
  });
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

app.get('/producto/:id', (req, res) => {
  const productId = req.params.id;
  const query = `CALL PRC_VER_PROD(${productId});`;
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.render('producto', { prod: results[0][0] });
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
    res.render('productos', { tools: results[0] });
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
    res.render('productos', { tools: results[0] });
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
    res.render('productos', { tools: results[0] });
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
    res.render('productos', { tools: results[0] });
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
    res.render('productos', { tools: results[0] });
  });
});

app.get('/login', (req, res) => {
  const errorMessage = req.flash('error');
  res.render('login', { error: errorMessage });
});

app.post('/inicio_sesion', (req, res) => {
  const { user, passw } = req.body;
  const query = 'CALL PRC_LOGIN(?, ?);';
  mysqlConnection.query(query, [user, passw], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    if (results[0].length > 0) {
      res.render('sesion_iniciada', { users: results[0] });
    } else {
      req.flash('error', 'Usuario o contraseña inválida. Intenta de nuevo.');
      res.redirect('/login');
    }
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
    res.render('productos', { tools: results[0] });
  });
});

app.get('/sales',(req,res)=>{
  res.render('ventas');
});

app.get('/filtrar_ventas',(req,res)=>{
  const despacho = req.query.data;
  var query="Hola";
  if(despacho==5){
    query = `CALL PRC_VER_VENTAS_TODO();`;
  }else if(despacho==0){
    query = `CALL PRC_VER_VENTAS(0);`;
  }else if(despacho==1){
    query = `CALL PRC_VER_VENTAS(1);`;
  }
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results[0]);
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
      req.session.datos = viewData;
      res.redirect('/compra_exitosa');
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
  req.session.fallo = {step, stepDescription}
  res.redirect("/compra_fallida");
}));

app.get('/compra_exitosa', (req, res) => {
  const datos = req.session.datos;
  res.render('transac_exitosa', {datos});
});

app.get('/compra_fallida', (req, res) => {
  const fallo = req.session.fallo;
  res.render('transac_fallida', {fallo});
});

app.post('/finalizar_venta', asyncHandler(async function (req,res){
  /*Datos de la compra*/
  const datos = req.body.datos;
  const carrito = req.body.carrito.carro;
  const token = req.body.token;
  const total = datos.total;
  const cliente = datos.cliente;
  const vendedor = datos.vendedor;

  const finalizacion = {
    carro: carrito, 
    email: cliente.email
  };
  req.session.finalizar = finalizacion;
  try{
    const venta = `CALL PRC_VENTA('${cliente.nombre}','${cliente.email}','${cliente.direccion}',${cliente.rut},${total},'${token}',${vendedor});`;
    mysqlConnection.query(venta);
    carrito.forEach(element=>{
      const query = `CALL PRC_AGG_DET_PED(${element[0]},${element[1]});`;  
      mysqlConnection.query(query);    
    });
    res.send("Funciona");
  } catch (error) {
    console.log(error);
  }
}));

app.get('/paso-1', (req, res) => {
  const datos = req.query.datita;
  const query = `CALL PRC_DET(${datos[0]},${datos[1]});`;
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results[0]);
  });
});

app.get('/enviar_correo', asyncHandler(async function (req, res) {
  try {
    const email = req.query.email;
    const html = req.query.html;
    const total = req.query.total;
    
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'ferremasg9@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: 'FERREMAS - MÁS FERRETERÍA <ferremasg9@gmail.com>',
      to: email,
      subject: '¡MUCHAS GRACIAS POR TU COMPRA!',
      text: '¡MUCHAS GRACIAS POR TU COMPRA!',
      html: `<h1>¡MUCHAS GRACIAS POR PREFERIRNOS!</h1>
        <h2>En unos días más, te enviaremos un nuevo correo, indicando el número de seguimiento y la empresa responsable de tu envío.</h2>
        <h3>A continuación, se detalla tu compra:</h3>`+html+`
        <h4>El total de tu compra es de: ${total}</h4>`,
    };

    const result = await transport.sendMail(mailOptions);
    res.send("¡Correo enviado!");
  } catch (error) {
    console.error('Error enviando el correo:', error);
  }
}));

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

app.get('/detalle_venta', (req, res) => {
  const id = req.query.data;
  const query = `CALL PRC_DET_VENTA(${id});`;
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
    console.log(`Server is listening at http://localhost:${port}/`);
}); 