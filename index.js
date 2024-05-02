const express = require('express');
const path = require('path');
const mysqlConnection = require('./mysql');
const { redirect } = require('express/lib/response');
const bodyParser = require('body-parser');
const moment = require('moment');
const mtz = require('moment-timezone');
const multer = require('multer');
require('moment/locale/es');
mtz.locale('es-CL');
const { format } = require('date-fns');

const app = express();
const port = 3000;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  const query = 'CALL PRC_CLIENTE();';  // Modify this query based on your database schema
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.render('index', { users: results[0] });
  });
});

app.get('/ag_servicios', (req, res) => {
  const query = 'CALL PRC_TP_SERVICIO();';
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.render('ag_servicios', { TP_SERVICIO: results[0] });
  });
});

app.get('/venta', (req, res) => {
  const query = 'CALL PRC_HORAS_PENDIENTES();';
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.render('venta', { horas: results[0] });
  });
});

app.get('/cliente-venta', (req, res) => {
  const query = 'CALL PRC_HORAS_PENDIENTES();';
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results[0]);
  });
});

app.get('/comprobantes', (req, res) => {
  const query = 'CALL PRC_TIPO_COMP();';
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results[0]);
  });
});

app.get('/pagos', (req, res) => {
  const query = 'CALL PRC_FORMA_PAGO();';
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results[0]);
  });
});

app.get('/tecnicos', (req, res) => {
  const query = 'CALL PRC_TECNICOS();';
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results[0]);
  });
});

app.get('/cajeros', (req, res) => {
  const query = 'CALL PRC_CAJEROS();';
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results[0]);
  });
});

app.get('/servicios', (req, res) => {
  const query = 'CALL PRC_SERV_SIMPLE();';
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results[0]);
  });
});

app.get('/productos', (req, res) => {
  const query = 'CALL PRC_PROD_SIMPLE();';
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results[0]);
  });
});

app.get('/ver_servicios', (req, res) => {
  const query = 'CALL PRC_SERVICIO();';
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.render('ver_servicios', { servicio: results[0] });
  });
});

app.get('/ver_horas', function (req, res) {
  var disponible = [];
  var fechas = [];
  const query = 'CALL PRC_VER_HORA()';
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    results[0].forEach(element => {
      disponible.push(element);
      fechas.push(element.FECHA_INI);
    });

    const uniqueDatesSet = new Set(fechas);
    // Convert Set back to array
    const uniqueDatesArray = Array.from(uniqueDatesSet);
    const sorteado = uniqueDatesArray.sort((a, b) => {
      // Assuming date format is DD/MM/YYYY
      const dateA = new Date(a.split("/").reverse().join("/"));
      const dateB = new Date(b.split("/").reverse().join("/"));
      return dateA - dateB;
    });
    res.render('hora', { dates: sorteado, horas: disponible });
  })
});

app.get('/calendario', function (req, res) {
  const query = 'CALL PRC_VER_HORA()';
  mysqlConnection.query(query, (error, results) => {
    mtz.locale('es-CL');
    const events = results[0].map(hora => ({
      title: mtz.tz(hora.HORA_INI, "HH:mm:ss", "America").format("HH:mm"),
      start: mtz.tz(hora.FECHA_INI + " " + hora.HORA_INI, "DD/MM/YYYY HH:mm:ss", "America").toDate(),
      id: hora.ID_HORA,
      fecha: hora.FECHA_INI,
      inicial: hora.HORA_INI,
    }));
    res.json(events);
  });
});

app.post('/updateHora', (req, res) => {
  const idHora = req.body.idHora;
  const idCliente = req.body.idCliente;
  const query = `CALL PRC_TOMAR_HORA(${idHora},${idCliente});`;
  mysqlConnection.query(query, function (error) {
    if (error) {
      throw error;
    } else {
      console.log('Datos almacenados correctamente');
      res.redirect('/');
    }
  });
});

app.post('/finalizar-venta', (req, res) => {
  const detalle = req.body.data;
  const ids = req.body.aidis;
  var total = 0;
  detalle.forEach((element, index) => {
    total += element.subtotal;
  });
  const crearVenta = `CALL PRC_CREAR_VENTA(${total},${ids.hora},${ids.comprobante},${ids.pago});`;
  mysqlConnection.query(crearVenta);
  detalle.forEach((element, index) => {
    if (element.tipoVenta == 'Producto') {
      const crearProducto = `CALL PRC_DET_VENTA_PROD(${element.id},${element.cantidad},${element.subtotal},${element.empleado});`;
      mysqlConnection.query(crearProducto);
      console.log("Producto añadido Exitosamente.");
    } else {
      const crearServicio = `CALL PRC_DET_VENTA_SERV(${element.id},${element.cantidad},${element.subtotal},${element.empleado});`;
      mysqlConnection.query(crearServicio);
      console.log("Servicio añadido Exitosamente.");
    }
  });
  res.redirect('/');
})

app.post('/validar', function (req, res) {
  const datos = req.body;
  let descripcion = datos.descripcion;
  let registrar = `CALL PRC_INS_TS('${descripcion}')`;
  mysqlConnection.query(registrar, function (error) {
    if (error) {
      throw error;
    } else {
      console.log('Datos almacenados correctamente');
    }
  });
  console.log(datos);
});

app.post('/validarServ', upload.single('imagenServicio'), function (req, res) {
  const datos = req.body;
  let id_tipo_serv = datos.tipoServicio;
  let valor = datos.valorServicio;
  let nomserv = datos.nombreServicio;
  const imageName = req.file.filename;
  let registrar = `CALL PRC_INS_SERV(?, ?, ?, ?)`;
  mysqlConnection.query(registrar, [id_tipo_serv, nomserv, valor, imageName], function (error) {
    if (error) {
      console.error(error);
      res.status(500).send('Error al almacenar los datos.');
    } else {
      res.redirect('ver_servicios');
    }
  });
});

app.post('/eli_servicios/:id', (req, res) => {
  const id_servicio = req.params.id;
  const query = `CALL PRC_ELI_SERVICIO(?)`;
  mysqlConnection.query(query, [id_servicio], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error al eliminar el servicio');
    } else {

      const mensaje = results[0][0].mensaje;
      if (mensaje === 'Servicio eliminado correctamente') {
        console.log('Servicio eliminado correctamente');
        res.redirect('/ver_servicios');
      } else {
        console.log('El servicio no existe');
        res.status(404).send('El servicio no existe');
      }
    }
  });
});

app.post('/edi_servicios/:id', (req, res) => {
  const id_servicio = req.params.id;
  const query = 'CALL PRC_BUS_SERV(?);';
  mysqlConnection.query(query, [id_servicio], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error al obtener información del servicio');
    } else {
      const proce = 'CALL PRC_TP_SERVICIO();';
      mysqlConnection.query(proce, (error, tpResults) => {
        if (error) {
          console.error('Error executing proce:', error);
          res.status(500).send('Internal Server Error');
          return;
        }
        res.render('edi_servicios', { servicio: id_servicio, TP_SERVICIO: tpResults[0][0] });
      });
    }
  });
});

app.post('/updatearServicios/', upload.single('imagenServicio'), (req, res) => {
  const { idServicio, tipoServicio, nombreServicio, valorServicio } = req.body;
  const imageName = req.file ? req.file.filename : null;
  const query = 'CALL PRC_UPD_SERV(?, ?, ?, ?, ?);';
  mysqlConnection.query(query, [tipoServicio, nombreServicio, valorServicio, imageName, idServicio], (error) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error al actualizar información del servicio');
    } else {
      res.redirect('/ver_servicios');
    }
  });
});

app.get('/ver_empleados', (req, res) => {
  const query = 'CALL PRC_EMPLEADO();';
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.render('ver_empleados', { EMPLEADO: results[0] });
  });
});

app.get('/ag_empleados', (req, res) => {
  Promise.all([
    new Promise((resolve, reject) => {
      const query1 = 'CALL PRC_VER_TE();';
      mysqlConnection.query(query1, (error, results) => {
        if (error) {
          console.error('Error executing query1:', error);
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    }),
    new Promise((resolve, reject) => {
      const query2 = 'CALL PRC_VER_TC();';
      mysqlConnection.query(query2, (error, results) => {
        if (error) {
          console.error('Error executing query2:', error);
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    })
  ])
    .then(([tp_empleado, tp_contrato]) => {
      res.render('ag_empleados', { tp_empleado, tp_contrato });
    })
    .catch((error) => {
      res.status(500).send('Internal Server Error');
    });
});

app.post('/valid_empleados', function (req, res) {
  const datos = req.body;
  const {
    numRun,
    nombres,
    apellidos,
    numFono,
    email,
    fechaNac,
    direccion,
    tipoEmpleado,
    tipoContrato,
    fechaCon,
    sueldo,
    usuario,
    contrasenia
  } = datos;

  const registrar = `CALL PRC_INS_EMPLEADO(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  mysqlConnection.query(
    registrar,
    [
      numRun,
      nombres,
      apellidos,
      numFono,
      email,
      fechaNac,
      direccion,
      tipoEmpleado,
      tipoContrato,
      fechaCon,
      sueldo,
      usuario,
      contrasenia
    ],
    function (error) {
      if (error) {
        console.error(error);
        res.status(500).send('Error al almacenar los datos.');
      } else {
        res.redirect('/ver_empleados');
        console.log('Datos almacenados correctamente');
      }
    }
  );
});

app.get('/ver_productos', (req, res) => {
  const query = 'CALL PRC_PRODUCTOS();';
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.render('ver_productos', { PRODUCTO: results[0] });
  });
});

app.get('/ag_productos', (req, res) => {
  Promise.all([
    new Promise((resolve, reject) => {
      const query1 = 'CALL PRC_TP_PRODUCTOS();';
      mysqlConnection.query(query1, (error, results) => {
        if (error) {
          console.error('Error executing query1:', error);
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    }),
    new Promise((resolve, reject) => {
      const query2 = 'CALL PRC_TP_PROVEEDOR();';
      mysqlConnection.query(query2, (error, results) => {
        if (error) {
          console.error('Error executing query2:', error);
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    })
  ])
    .then(([tp_producto, provedor]) => {
      res.render('ag_productos', { tp_producto, provedor });
    })
    .catch((error) => {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    });
});

app.post('/valid_productos', upload.single('imagen'), function (req, res) {
  const datos = req.body;
  const {
    tipoProvedor,
    tipoProducto,
    nombreProducto,
    stockProducto,
    costoProducto,
  } = datos;

  if (!tipoProvedor || !tipoProducto || !nombreProducto || !stockProducto || !costoProducto || !req.file) {
    return res.status(400).send('Todos los campos son obligatorios.');
  }
  const imagen = req.file.filename;

  const registrar = `CALL PRC_INS_PRODUCTO(?, ?, ?, ?, ?, ?)`;
  mysqlConnection.query(
    registrar,
    [
      tipoProvedor,
      tipoProducto,
      nombreProducto,
      stockProducto,
      costoProducto,
      imagen
    ],
    function (error) {
      if (error) {
        console.error(error);
        return res.status(500).send('Error al almacenar los datos del producto.');
      } else {
        console.log('Datos del producto almacenados correctamente');
        return res.redirect('/ver_productos');
      }
    }
  );
});

app.post('/eli_productos/:id', (req, res) => {
  const id_producto = req.params.id;
  const query = `CALL PRC_ELI_PRODUCTO(?)`;
  mysqlConnection.query(query, [id_producto], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error al eliminar el producto');
    } else {
      const mensaje = results[0][0].mensaje;
      if (mensaje === 'Producto eliminado correctamente') {
        console.log('Producto eliminado correctamente');
        res.redirect('/ver_productos');
      } else {
        console.log('El producto no existe');
        res.status(404).send('El producto no existe');
      }
    }
  });
});

app.get('/edi_productos/:id', (req, res) => {
  const idProducto = req.params.id;
  const queryProducto = 'SELECT * FROM Producto WHERE ID_PRODUCTO = ?';
  const queryTiposProductos = 'SELECT * FROM TIPO_PROD';
  const queryProveedores = 'SELECT * FROM Proveedor';
  Promise.all([
    new Promise((resolve, reject) => {
      mysqlConnection.query(queryProducto, [idProducto], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    }),
    new Promise((resolve, reject) => {
      mysqlConnection.query(queryTiposProductos, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    }),
    new Promise((resolve, reject) => {
      mysqlConnection.query(queryProveedores, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    }),
  ])
    .then(([producto, tiposProductos, proveedores]) => {
      // Renderiza la vista edi_productos y pasa el producto, tipos de productos y proveedores
      res.render('edi_productos', { producto, tiposProductos, proveedores });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error al obtener los datos del producto, tipos de productos y proveedores');
    });
});

app.post('/updatearProductos/:id', upload.single('imagenProducto'), (req, res) => {
  const idProducto = req.params.id;
  const { idProveedor, idTipoProducto, nombreProducto, stock, costoProducto } = req.body;


  const imageName = req.file ? req.file.filename : null;


  const updateQuery =
    'UPDATE Producto SET ID_PROV=?, ID_TIPO_PROD=?, NOMPROD=?, STOCK=?, COSTO_PROD=?, IMAGEN=? WHERE ID_PRODUCTO=?';

  mysqlConnection.query(
    updateQuery,
    [idProveedor, idTipoProducto, nombreProducto, stock, costoProducto, imageName, idProducto],
    (error) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error al actualizar el producto');
      } else {
        console.log('Producto actualizado correctamente');
        res.redirect('/ver_productos');
      }
    }
  );
});

app.get('/adm_horas', (req, res) => {
  const query = 'CALL PRC_ADM_HORAS()';
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error al obtener los datos de las horas');
    } else {
      const horas = results[0];
      res.render('adm_hora', { horas });
    }
  })
});

app.get('/ag_pedido', (req, res) => {
  const query = 'CALL PRC_PROV_DISP()';
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error al obtener los datos de los proveedores');
    } else {
      const proveedores = results[0];
      res.render('ag_pedido', { proveedores });
    }
  })
});

app.get('/prods_pedido', (req, res) => {
  const id = req.query.prov;
  const query = `CALL PRC_PRODS_PROV(${id})`;
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error al obtener los datos de los productos');
    } else {
      res.json(results[0]);
    }
  })
});

app.get('/pedidos', (req, res) => {
  const query = 'CALL PRC_VER_PEDIDOS()';
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error al obtener los datos de los pedidos');
    } else {
      const pedidos = results[0];
      res.render('ver_pedidos', { pedidos });
    }
  })
});

app.post('/liberaHora', (req, res) => {
  const id = req.body.valor;
  const query = `CALL PRC_LIBERAR_HORA(${id})`;
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error al liberar la hora');
    } else {
      console.log('Hora liberada correctamente');
      res.redirect('/');
    }
  });
});

app.post('/recepcionaPedido', (req, res) => {
  const id = req.body.valor;
  const emp = req.body.idemp;
  const query = `CALL PRC_ACEPTA_PED(?,?)`;
  mysqlConnection.query(query, [emp, id], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error al liberar la hora');
    } else {
      console.log('Hora liberada correctamente');
      res.redirect('/pedidos');
    }
  });
});

app.get('/detallePedido', (req, res) => {
  const id = req.query.data;
  const query = `CALL PRC_DETALLE(?)`;
  mysqlConnection.query(query, [id], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error al obtener los datos del pedido');
    } else {
      res.json(results[0]);
    }
  })
})

app.post('/agregarPedido', (req, res) => {
  var arreglo = req.body.data;
  var proveedor = req.body.proveedor;
  var emp = req.body.empleado;
  var total = 0;

  arreglo.forEach((element) => {
    total += element.costo * element.cantidad;
  });

  const pedido = "CALL PRC_AGG_PED(?,?)";
  const det_ped = "CALL PRC_AGG_DET_PED(?,?,?,?)";
  mysqlConnection.query(pedido, [emp, total], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error al obtener insertar el pedido.');
    }
  });
  arreglo.forEach((element) => {
    const total = element.costo * element.cantidad;
    mysqlConnection.query(det_ped, [element.idProd, element.cantidad, element.costo, total], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error al obtener insertar el pedido.');
      }
    });
  });
  res.redirect('/');
});

app.get('/employee', (req, res) => {
  const query = 'CALL PRC_LIST_EMP()';
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error al obtener los datos de los empleados');
    } else {
      res.json(results[0]);
    }
  });
})




app.get('/ver_proveedores', (req, res) => {
  const query = 'CALL PRC_PROVEEDORES();';
  mysqlConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.render('ver_proveedores', { PROVEDOR: results[0] });
  });
});


app.get('/ag_proveedores', (req, res) => {
  res.render('ag_proveedores');
});

app.post('/validarProv', function (req, res) {
  const datos = req.body;
  const { nombre, correo, numero } = datos;

  let registrar = `CALL PRC_INS_PROV(?, ?, ?)`;
  mysqlConnection.query(registrar, [nombre, correo, numero], function (error, results) {
    if (error) {
      console.error('Error en la consulta SQL:', error);
      return res.status(500).send('Error al almacenar los datos. Detalles: ' + error.message);
    } else {
      console.log('Datos almacenados correctamente:', results);
      return res.redirect('ver_proveedores');
    }
  });
});


app.post('/eli_proveedores/:id', (req, res) => {
  const id_proveedor = req.params.id;
  const query = 'CALL PRC_ELI_PROVEEDOR(?)';

  mysqlConnection.query(query, [id_proveedor], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Error al eliminar el proveedor');
    }

    const mensaje = results[0][0].mensaje;

    if (mensaje === 'Proveedor eliminado correctamente') {
      console.log('Proveedor eliminado correctamente');
      return res.redirect('/ver_proveedores');
    } else {
      console.log('El proveedor no existe');
      return res.status(404).send('El proveedor no existe');
    }
  });
});

app.get('/editar_proveedor/:id', (req, res) => {
  const id_proveedor = req.params.id;
  const query = 'CALL PRC_BUS_PROV(?)';
  mysqlConnection.query(query, [id_proveedor], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error al obtener los datos del proveedor');
    } else {
      const proveedor = results[0][0];
      res.render('edi_proveedores', { servicio: id_proveedor, proveedor });
    }
  });
});

app.post('/analisis', (req, res) => {
  const fechaInicio = format(new Date(req.body.fechaInicio), 'yyyy-MM-dd');
  const fechaFin = format(new Date(req.body.fechaFin), 'yyyy-MM-dd');

  mysqlConnection.query('CALL PRC_ANALISIS(?, ?)', [fechaInicio, fechaFin], (error, results) => {
    if (error) {
      console.error('Error al llamar al procedimiento almacenado:', error);
      throw error;
    }
    const resultado = results[0][0];
    console.log(resultado);
    res.render('analisis', { resultado });
  });
});

app.post('/edita_proveedor/:id', (req, res) => {
  const id_proveedor = req.params.id;
  const { nombre, correo, numero } = req.body;

  const query = 'CALL PRC_Edi_Proveedor(?, ?, ?, ?)';

  mysqlConnection.query(query, [id_proveedor, nombre, correo, numero], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error al editar el proveedor');
    } else {
      console.log('Proveedor editado correctamente');
      res.redirect('/ver_proveedores');
    }
  });
});
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
}); 