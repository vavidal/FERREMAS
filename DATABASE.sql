SET GLOBAL LOG_BIN_TRUST_FUNCTION_CREATORS = 1;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'hola123';
CREATE DATABASE  IF NOT EXISTS `FERREMAS_G9`;
USE `FERREMAS_G9`;

CREATE TABLE TIPO_PROD(
	ID_TIPO_PROD INT NOT NULL AUTO_INCREMENT,
    DESCRIPCION VARCHAR(40) NOT NULL,
    PRIMARY KEY(ID_TIPO_PROD)
);
CREATE TABLE PRODUCTO(
	ID_PRODUCTO INT NOT NULL AUTO_INCREMENT,
    ID_TIPO_PROD INT NOT NULL,
    NOMPROD VARCHAR(50) NOT NULL,
    VALOR_COMPRA INT NOT NULL,
    VALOR_VENTA INT,
    STOCK INT,
    RUTA_IMAGEN VARCHAR(50),
    DESCRIPCION VARCHAR(500),
Marca VARCHAR(255) NOT NULL,
Modelo VARCHAR(255) NOT NULL,
Ancho DECIMAL(10,2) NOT NULL,
Alto DECIMAL(10,2) NOT NULL,
Peso DECIMAL(10,2) NOT NULL,
HABILITADO BOOL DEFAULT 1 NOT NULL,

    PRIMARY KEY (ID_PRODUCTO),
	FOREIGN KEY(ID_TIPO_PROD) REFERENCES TIPO_PROD(ID_TIPO_PROD)
);
CREATE TABLE TIPO_EMPLEADO(
	ID_TIPO_EMP INT NOT NULL AUTO_INCREMENT,
    DESCRIPCION VARCHAR(25),
    PRIMARY KEY (ID_TIPO_EMP)
);

CREATE TABLE EMPLEADO(
	ID_EMPLEADO INT NOT NULL AUTO_INCREMENT,
    ID_TIPO_EMP INT,
    NOMBRE_EMP VARCHAR(50),
    RUTEMP INT,
    DVEMP VARCHAR(1),
    PRIMARY KEY (ID_EMPLEADO),
    FOREIGN KEY (ID_TIPO_EMP) REFERENCES TIPO_EMPLEADO(ID_TIPO_EMP)
);

CREATE TABLE VENTA(
	ID_VENTA INT NOT NULL AUTO_INCREMENT,
    ID_EMPLEADO INT NOT NULL,
    NOMCLIENTE VARCHAR(50) NOT NULL,
    RUTCLI INT NOT NULL,
    DVCLI VARCHAR(1),
    CORREOCLI VARCHAR(50) NOT NULL,
    DIRECCION_DESPACHO VARCHAR(100) NOT NULL,
    TOTAL INT,
    FECHA_VENTA DATETIME,
    COMPRA_DESPACHADA BOOLEAN DEFAULT 0,
    NUM_DESPACHO VARCHAR(40),
    TOKEN_CONFIRMACION VARCHAR(64) NOT NULL,
    FECHA_CONFIRMACION DATETIME,
    PRIMARY KEY (ID_VENTA),
    FOREIGN KEY (ID_EMPLEADO) REFERENCES EMPLEADO (ID_EMPLEADO)
);

CREATE TABLE DETALLE_VENTA(
	ID_DET_VENTA INT NOT NULL AUTO_INCREMENT,
    ID_VENTA INT NOT NULL,
    ID_PROD INT NOT NULL,
    CANTIDAD INT NOT NULL,
    VALOR_INDIVIDUAL INT NOT NULL,
    VALOR_TOTAL INT NOT NULL,
    PRIMARY KEY (ID_DET_VENTA),
    FOREIGN KEY (ID_VENTA) REFERENCES VENTA(ID_VENTA),
    FOREIGN KEY (ID_PROD) REFERENCES PRODUCTO(ID_PRODUCTO)
);

CREATE TABLE EMPLEADO_USUARIO(
ID_EMP_US INT NOT NULL AUTO_INCREMENT,
ID_EMPLEADO INT,
NOM_USER VARCHAR(50),
CONTRASENIA VARCHAR(12),
PRIMARY KEY (ID_EMP_US),
FOREIGN KEY (ID_EMPLEADO) REFERENCES EMPLEADO(ID_EMPLEADO)
);


DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `digitoVerificador`(rut INT UNSIGNED) RETURNS varchar(1) CHARSET utf8mb4
BEGIN
DECLARE dv VARCHAR(1);
DECLARE Digito INT;
DECLARE Contador INT;
DECLARE Multiplo INT;
DECLARE Acumulador INT;
DECLARE resto int;

SET Contador = 2;
SET Acumulador = 0;
SET Multiplo = 0;

WHILE(rut!=0) DO
SET Multiplo = (rut%10) * Contador;
SET Acumulador = Acumulador + Multiplo;
SET rut = FLOOR(rut / 10);
SET Contador = Contador + 1;
if(Contador = 8) THEN
SET Contador = 2;
END IF;
END WHILE;

SET resto = TRUNCATE(Acumulador/11,0);
SET resto = resto * 11;

SET Digito = ABS(Acumulador - resto);
SET Digito = 11 - Digito;

IF Digito = 10 THEN SET dv = 'K';
ELSEIF(Digito = 11) THEN SET dv = '0';
ELSE SET dv = LTRIM(RTRIM(CAST(Digito as CHAR(2))));
END IF;

RETURN dv;

END ;;
DELIMITER ;

DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `TRG_DV` BEFORE INSERT ON `EMPLEADO` FOR EACH ROW BEGIN
    SET NEW.DVEMP = digitoVerificador(NEW.RUTEMP);
END */;;
DELIMITER ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `TRG_DVCLI` BEFORE INSERT ON `VENTA` FOR EACH ROW BEGIN
    SET NEW.DVCLI = digitoVerificador(NEW.RUTCLI);
END */;;
DELIMITER ;

/*INSERCIÓN DATOS DE TIPO_EMPLEADO*/
INSERT INTO TIPO_EMPLEADO(DESCRIPCION) VALUES ('Vendedor/a');
INSERT INTO TIPO_EMPLEADO(DESCRIPCION) VALUES ('Bodeguero/a');
INSERT INTO TIPO_EMPLEADO(DESCRIPCION) VALUES ('Administrativo/a');
INSERT INTO TIPO_EMPLEADO(DESCRIPCION) VALUES ('Contador/a');
INSERT INTO TIPO_EMPLEADO(DESCRIPCION) VALUES ('Administrador/a');

/*EMPLEADOS*/
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (4, 'Corina Montel', 16673418);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (4, 'Perri Woodhead', 20329319);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (1, 'Carolina Abbay', 14750388);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (1, 'Penni Favela', 22803022);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (1, 'Ulric Cutbush', 12586456);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (4, 'Niel Skeemer', 13855235);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (2, 'Kori Bouch', 19455712);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (4, 'Hollis Cropper', 17714454);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (1, 'Chrystal Asee', 22103853);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (4, 'Ky Whetson', 14655095);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (1, 'Orazio Edgcumbe', 17437639);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (3, 'Kleon McLarens', 14246677);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (4, 'Harriette Marco', 18584960);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (4, 'Germaine Loren', 12236316);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (3, 'Lydia Cornil', 20303657);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (3, 'Addy Bidewel', 16776825);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (1, 'Manon Durning', 18467002);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (3, 'Geralda Polle', 18250653);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (2, 'Julie Flounders', 14841180);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (4, 'Tara Vercruysse', 22724065);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (1, 'Ephrem Daybell', 16491906);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (2, 'Beulah Stockin', 19000515);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (4, 'Klemens Gemnett', 18895678);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (3, 'Emmerich Tombs', 16929440);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (3, 'Halli Tonner', 14338077);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (3, 'Elbert Courtliff', 19409072);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (4, 'Filia Santacrole', 17801540);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (1, 'Gayle Farraway', 17190266);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (4, 'Welsh Verney', 12910110);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (2, 'Querida Robel', 17897663);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (4, 'Aube Worsfold', 18615408);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (4, 'Anselma Pendrich', 19295970);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (2, 'Gallagher Bellanger', 15171826);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (1, 'Clevie Scocroft', 19514527);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (2, 'Faber Rabb', 18813320);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (3, 'Krispin Gervaise', 16077762);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (3, 'Anna-diana Markson', 21020216);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (3, 'Charmian FitzGeorge', 21133769);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (4, 'Emmet Clemenson', 16951481);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (1, 'Danita Gellier', 17517539);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (2, 'Stacey Farady', 16784800);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (3, 'Avis Knok', 20850912);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (2, 'Emalia Huttley', 18454944);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (4, 'Ericha Hammill', 21573067);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (3, 'Gaye Kettel', 15504518);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (3, 'Urbanus Chin', 12590170);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (2, 'Ivy Muncaster', 15618007);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (1, 'Aubry Mathivon', 19359507);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (4, 'Cherise Rodolfi', 15316325);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (1, 'Merridie Antwis', 15734564);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (3, 'Amitie Daniellot', 20478844);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (2, 'Cindee Tankin', 12140444);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (4, 'Timothea Geary', 18765822);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (4, 'Chet Burner', 17918886);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (4, 'Paddy Ventham', 13348126);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (3, 'Corbet Pinare', 17435894);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (1, 'Clarie Leyrroyd', 12312336);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (4, 'Saloma Dicte', 16006376);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (2, 'Lucio Ros', 19130237);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (2, 'Hardy Hawken', 19173784);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (4, 'Gerri Barbosa', 15461594);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (2, 'Ingra Nolte', 22831425);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (1, 'Malissia Wittke', 15544528);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (1, 'Starr Gershom', 14989730);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (4, 'Doralia Alder', 19608383);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (2, 'Flem Whalley', 18444134);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (3, 'Iolande Gregoli', 15682454);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (1, 'Clo Gait', 19985113);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (3, 'Iggie Yekel', 14745490);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (2, 'Tedie Ramirez', 15619691);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (1, 'Vania Shuxsmith', 16043898);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (2, 'Gale Budibent', 22154244);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (3, 'Odella Mart', 14744256);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (2, 'Marlene Carlesi', 18874167);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (4, 'Ariadne Carme', 13252648);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (3, 'Mirilla Wildbore', 20690435);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (1, 'Waylan Pagden', 13955791);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (4, 'Victoria Hames', 20698827);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (4, 'Fifi Solloway', 17260912);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (4, 'Devlen Piesold', 14882592);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (2, 'Rhodia Dewdeny', 20129118);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (3, 'Ruthie Dudill', 17510796);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (4, 'Casper Sea', 16970373);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (4, 'Chrisy Jiggins', 13173432);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (4, 'Krishna Raw', 19964894);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (2, 'Louis Corstorphine', 15566484);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (1, 'Harrison Jewster', 18136759);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (2, 'David Race', 21058576);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (2, 'Kellyann Farnan', 21568202);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (4, 'Holden Stronough', 20627951);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (4, 'Phylys Kramer', 17520394);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (1, 'Rosie Burren', 14813712);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (3, 'Tabbatha Curdell', 20099364);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (2, 'Bobbette Oxbrough', 17633880);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (4, 'Gussie Curmi', 12000436);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (1, 'Kiele Bacon', 22056772);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (4, 'Garrek Nyssen', 15763536);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (3, 'Andy Calcutt', 15162389);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (2, 'Sisely Uren', 22471900);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (4, 'Shani Charity', 12452688);
insert into EMPLEADO (ID_TIPO_EMP, NOMBRE_EMP, RUTEMP) values (1, 'Diego Ruminot', 21535429);
INSERT INTO EMPLEADO(ID_EMPLEADO,ID_TIPO_EMP, NOMBRE_EMP, RUTEMP, DVEMP) VALUES ('999', '1', 'Ventas Internet', '12345678', '9');
/*PROCEDIMIENTOS PARA VER INFORMACIÓN*/

delimiter //
CREATE PROCEDURE PRC_EMPLEADO()
BEGIN
	SELECT 
		E.ID_EMPLEADO AIDI,
        TP.DESCRIPCION TIPO,
        E.NOMBRE_EMP NEIM,
        CONCAT(E.RUTEMP, '-', DVEMP) RUTER
	FROM EMPLEADO E INNER JOIN TIPO_EMPLEADO TP ON E.ID_TIPO_EMP = TP.ID_TIPO_EMP
ORDER BY E.ID_EMPLEADO;
END;
//


delimiter //
CREATE PROCEDURE PRC_PRODS(NUM INT)
BEGIN
	SELECT
		ID_PRODUCTO NUMERITO,
		NOMPROD NOM,
        VALOR_VENTA VAL,
        STOCK CANTIDAD,
        RUTA_IMAGEN IMG,
        DESCRIPCION DES,
        HABILITADO DISPO
	FROM PRODUCTO
    WHERE ID_TIPO_PROD = NUM;
END;
//

DELIMITER //
/*Muestra todos los productos en el inicio PRUEBA*/
CREATE PROCEDURE PRC_PROD()
BEGIN
	SELECT
		ID_PRODUCTO NUMERITO,
		NOMPROD NOM,
        VALOR_VENTA VAL,
        STOCK STOCK,
        RUTA_IMAGEN IMG,
        DESCRIPCION DES,
        MARCA MRC,
        MODELO MDL,
        ANCHO ANC,
        ALTO ALT,
        PESO PS
	FROM PRODUCTO
    WHERE ID_TIPO_PROD ;
END;

//

DELIMITER //
CREATE PROCEDURE PRC_CART(NUM INT)
BEGIN
	SELECT 
		NOMPROD NOMBRE,
       VALOR_VENTA VAL,
      ID_PRODUCTO NUMERITO,
       ID_TIPO_PROD ITP,
        STOCK STOCK,
        RUTA_IMAGEN IMG,
        DESCRIPCION DES,
        MARCA MRC,
        MODELO MDL,
        ANCHO ANC,
        ALTO ALT,
        PESO PS
	FROM PRODUCTO
    WHERE ID_PRODUCTO = NUM;
END;
//

DELIMITER //
CREATE PROCEDURE PRC_VENTA(NOMBRE VARCHAR(50),EMAIL VARCHAR(50),DIRECCION VARCHAR(100),RUT INT,TOTAL INT,TOKEN VARCHAR(64), IDEMP INT)
BEGIN
	INSERT INTO VENTA(ID_EMPLEADO, NOMCLIENTE, RUTCLI, CORREOCLI, DIRECCION_DESPACHO, TOTAL, TOKEN_CONFIRMACION, FECHA_VENTA)
    VALUES(IDEMP,NOMBRE,RUT,EMAIL,DIRECCION,TOTAL,TOKEN,SYSDATE());
END;
//

DELIMITER //
CREATE PROCEDURE PRC_ADMIN()
BEGIN
	SELECT
		P.ID_PRODUCTO NUMERITO,
        P.ID_TIPO_PROD ITP,
        TP.DESCRIPCION TIPOP,
        P.NOMPROD NOMBRE,
        P.VALOR_COMPRA COMPRA,
        P.VALOR_VENTA VENTA,
        P.STOCK CANTIDAD,
        P.RUTA_IMAGEN NOMIMAGEN,
        P.DESCRIPCION TEXTO,
        P.HABILITADO DISPO
    FROM PRODUCTO P
    INNER JOIN TIPO_PROD TP ON P.ID_TIPO_PROD = TP.ID_TIPO_PROD;

END;
//

DELIMITER //
CREATE PROCEDURE TP_PRODS()
BEGIN
	SELECT ID_TIPO_PROD ITP, DESCRIPCION NOMBRE
    FROM TIPO_PROD;
END;
//

DELIMITER //
CREATE PROCEDURE PRC_INS_PRODUCTO(ITP INT, NOM VARCHAR(50),STOCK INT,COSTO INT,VENTA INT,DESCRIPCION VARCHAR(500), IMG VARCHAR(50),MARC VARCHAR(50), MODELO VARCHAR(50), ANCHO VARCHAR(50), ALTO VARCHAR(50), PESO VARCHAR(50))
BEGIN
	INSERT INTO PRODUCTO(ID_TIPO_PROD,NOMPROD,VALOR_COMPRA,VALOR_VENTA,STOCK,RUTA_IMAGEN,DESCRIPCION,MARCA,MODELO,ANCHO,ALTO,PESO)
    VALUES(ITP,NOM,COSTO,VENTA,STOCK,IMG,DESCRIPCION,MARC,MODELO,ANCHO,ALTO,PESO);
END
;
//

DELIMITER //
CREATE PROCEDURE PRC_HABI_PROD(NUM INT)
BEGIN
  DECLARE producto_existente INT;
  SELECT COUNT(*) INTO producto_existente FROM Producto WHERE ID_PRODUCTO = NUM;
  IF producto_existente > 0 THEN
    UPDATE PRODUCTO
    SET HABILITADO = 1
    WHERE ID_PRODUCTO = NUM;
    SELECT 'Producto habilitado correctamente' AS mensaje;
  ELSE
    -- El producto no existe
    SELECT 'El producto no existe' AS mensaje;
  END IF;
END
//


DELIMITER //
CREATE PROCEDURE PRC_ELI_PROD(NUM INT)
BEGIN
  DECLARE producto_existente INT;
  SELECT COUNT(*) INTO producto_existente FROM Producto WHERE ID_PRODUCTO = NUM;
  IF producto_existente > 0 THEN
    UPDATE PRODUCTO
    SET HABILITADO = 0
    WHERE ID_PRODUCTO = NUM;
    SELECT 'Producto deshabilitado correctamente' AS mensaje;
  ELSE
    -- El producto no existe
    SELECT 'El producto no existe' AS mensaje;
  END IF;
END;
//


DELIMITER //
CREATE PROCEDURE PRC_AGG_DET_PED(IDPROD INT,CANTIDAD INT)
BEGIN
	DECLARE INDI INT;
    DECLARE TOT INT;
    DECLARE IDVENTA INT;
    
    SELECT VALOR_VENTA INTO INDI FROM PRODUCTO WHERE ID_PRODUCTO = IDPROD;
    SELECT MAX(ID_VENTA) INTO IDVENTA FROM VENTA;
    
    SET TOT = INDI * CANTIDAD;
    
	INSERT INTO DETALLE_VENTA(ID_VENTA,ID_PROD,CANTIDAD,VALOR_INDIVIDUAL,VALOR_TOTAL)
    VALUES(IDVENTA,IDPROD,CANTIDAD,INDI,TOT);
    
    UPDATE PRODUCTO
    SET STOCK = STOCK-CANTIDAD
    WHERE ID_PRODUCTO = IDPROD;

END;
//

delimiter //
CREATE PROCEDURE PRC_LOGIN(usuario varchar(50), contra varchar(12))
BEGIN
	SELECT 
	NOM_USER NOMBRECITO,
    ID_EMPLEADO NUMERITO
	FROM EMPLEADO_USUARIO
    WHERE NOM_USER = USUARIO AND CONTRASENIA = CONTRA;
END;
//

DELIMITER //
CREATE PROCEDURE PRC_PROD_EDI (NUM INT)
BEGIN
	SELECT
		P.ID_TIPO_PROD ITP,
        TP.DESCRIPCION NOMTP,
		P.ID_PRODUCTO NUMERITO,
		P.NOMPROD NOM,
        P.VALOR_COMPRA COSTO,
        P.VALOR_VENTA VENTA,
        P.STOCK CANTIDAD,
        P.RUTA_IMAGEN IMG,
        P.DESCRIPCION DES
	FROM PRODUCTO P
    INNER JOIN TIPO_PROD TP ON P.ID_TIPO_PROD = TP.ID_TIPO_PROD
    WHERE ID_PRODUCTO = NUM;
END;
//

DELIMITER //
CREATE PROCEDURE PRC_UPD_SINIMG(AIDI INT, NOM VARCHAR(50), CANTIDAD INT, COSTO INT, VENTA INT, DES VARCHAR(500))
BEGIN
	UPDATE PRODUCTO
    SET
		NOMPROD = NOM,
        VALOR_COMPRA = COSTO,
        VALOR_VENTA = VENTA,
        STOCK = CANTIDAD,
        DESCRIPCION = DES
    WHERE ID_PRODUCTO = AIDI;
END;
//
DELIMITER //
CREATE PROCEDURE PRC_UPD_CONIMG(AIDI INT, ITP INT, NOM VARCHAR(50), CANTIDAD INT, COSTO INT, VENTA INT, DES VARCHAR(500), IMG VARCHAR(50))
BEGIN
	UPDATE PRODUCTO
    SET
		NOMPROD = NOM,
        ID_TIPO_PROD = ITP,
        VALOR_COMPRA = COSTO,
        VALOR_VENTA = VENTA,
        STOCK = CANTIDAD,
        DESCRIPCION = DES,
        RUTA_IMAGEN = IMG
    WHERE ID_PRODUCTO = AIDI;
END;
//

DELIMITER //
CREATE PROCEDURE PRC_VER_VENTAS(DES INT)
BEGIN
	SELECT
		V.ID_VENTA NUMBOLETA,
		V.ID_EMPLEADO NUMEMP,
		E.NOMBRE_EMP NOMEMP,
		V.NOMCLIENTE CLINAME,
		CONCAT(V.RUTCLI,'-',V.DVCLI) RUTCOMPLETO,
		CORREOCLI EMAIL,
		COMPRA_DESPACHADA DESP,
		CONCAT(DAY(V.FECHA_VENTA),'-',MONTH(V.FECHA_VENTA),'-',YEAR(V.FECHA_VENTA)) FECHA
	FROM VENTA V
	WHERE COMPRA_DESPACHADA = DES
	ORDER BY ID_VENTA;
END;
//
DELIMITER //
CREATE PROCEDURE PRC_VER_VENTAS_TODO()
BEGIN
	SELECT
		V.ID_VENTA NUMBOLETA,
		V.ID_EMPLEADO NUMEMP,
		E.NOMBRE_EMP NOMEMP,
		V.NOMCLIENTE CLINAME,
		CONCAT(V.RUTCLI,'-',V.DVCLI) RUTCOMPLETO,
		V.CORREOCLI EMAIL,
		V.TOKEN_CONFIRMACION TRABANK,
		CONCAT(DAY(V.FECHA_VENTA),'-',MONTH(V.FECHA_VENTA),'-',YEAR(V.FECHA_VENTA)) FECHA,
        COMPRA_DESPACHADA DESP
	FROM VENTA V
    INNER JOIN EMPLEADO E ON V.ID_EMPLEADO = E.ID_EMPLEADO
	ORDER BY ID_VENTA;
END;
//


DELIMITER //
CREATE PROCEDURE PRC_UPD_STOCK(AIDI INT, CANT INT)
BEGIN
	UPDATE PRODUCTO
    SET STOCK = CANT
    WHERE ID_PRODUCTO = AIDI;
END;
//

DELIMITER //
CREATE PROCEDURE PRC_VER_PROD(NUM INT)
BEGIN
	SELECT
		ID_PRODUCTO NUMERITO,
        RUTA_IMAGEN IMG,
		NOMPROD NOMBRE,
		DESCRIPCION DES,
		STOCK CANTIDAD,
		MARCA MRC,
		MODELO MDL,
		ANCHO ANC,
		ALTO ALT,
		PESO PS,
		VALOR_VENTA VAL
	FROM PRODUCTO
    WHERE ID_PRODUCTO = NUM;
END;
//

DELIMITER //
CREATE PROCEDURE PRC_DET_VENTA(AIDI INT)
BEGIN
	SELECT
		DE.ID_PROD SKU,
        P.NOMPROD NOMBRE,
        DE.CANTIDAD NUMERO,
        DE.VALOR_INDIVIDUAL INDI,
        DE.VALOR_TOTAL TOT
    FROM DETALLE_VENTA DE
    INNER JOIN PRODUCTO P ON DE.ID_PROD = P.ID_PRODUCTO
    WHERE ID_VENTA = AIDI;
END;
//


DELIMITER //
CREATE PROCEDURE PRC_DET(AIDI INT, CANT INT)
BEGIN
	SELECT
		ID_PRODUCTO AIDI,
		NOMPROD NOMBRE,
        VALOR_VENTA INDI,
        VALOR_VENTA*CANT TOT,
        CANT CANTIDAD
    FROM PRODUCTO
    WHERE ID_PRODUCTO = AIDI;
END;
//

DELIMITER //
CREATE PROCEDURE PRC_VER_SEG(AIDI INT)
BEGIN
	SELECT
		NUM_DESPACHO DESP
    FROM VENTA
    WHERE ID_VENTA = AIDI;
END;
//
DELIMITER //
CREATE PROCEDURE PRC_NUM_SEG(AIDI INT, NUMSEG INT)
BEGIN
	UPDATE VENTA
    SET COMPRA_DESPACHADA = 1, 
    FECHA_CONFIRMACION = SYSDATE(),
    NUM_DESPACHO = NUMSEG
    WHERE ID_VENTA = AIDI;
END;
//


/*TIPO PRODUCTOS*/
INSERT INTO TIPO_PROD(DESCRIPCION) VALUES('Herramientas Manuales');
INSERT INTO TIPO_PROD(DESCRIPCION) VALUES('Materiales Básicos');
INSERT INTO TIPO_PROD(DESCRIPCION) VALUES('Equipos de Seguridad');
INSERT INTO TIPO_PROD(DESCRIPCION) VALUES('Tornillos y Anclajes');
INSERT INTO TIPO_PROD(DESCRIPCION) VALUES('Fijaciones y Adhesivos');
INSERT INTO TIPO_PROD(DESCRIPCION) VALUES('Equipos de Medición');


/*INSERT PRODUCTOS*/
/*ID 1*/
INSERT INTO `producto` (`ID_PRODUCTO`, `ID_TIPO_PROD`, `NOMPROD`, `VALOR_COMPRA`, `VALOR_VENTA`, `STOCK`, `RUTA_IMAGEN`, `DESCRIPCION`, `Marca`, `Modelo`, `Ancho`, `Alto`, `Peso`) VALUES
(1, 1, 'Martillo de Uña', 5000, 8000, 100, 'martillo.jpg', 'Martillo de uña para todo tipo de trabajo.', 'Stanley', 'STHT51346', 30.00, 5.00, 1.00),
(2, 1, 'Destornillador Plano', 3000, 5000, 150, 'destornillador_plano.jpg', 'Destornillador plano de alta precisión.', 'Desconocido', 'Desconocido', 3.00, 1.00, 0.10),
(3, 1, 'Llave Inglesa', 7000, 10000, 80, 'llave_inglesa.jpg', 'Llave inglesa ajustable de 12 pulgadas.', 'Stanley', '87-369', 20.00, 3.00, 0.50),
(4, 1, 'Taladro Eléctrico', 40000, 55000, 30, 'taladro_electrico.jpg', 'Taladro eléctrico potente y duradero.', 'DeWalt', 'SDR1400', 10.00, 20.00, 2.00),
(5, 1, 'Sierra Circular', 35000, 45000, 25, 'sierra_circular.jpg', 'Sierra circular para cortes precisos.', 'Bosch', 'GKS 190', 40.00, 10.00, 4.00),
(6, 1, 'Lijadora Orbital', 25000, 35000, 40, 'lijadora_orbital.jpg', 'Lijadora orbital para acabados perfectos.', 'Stanley', 'SS24', 15.00, 10.00, 1.50),
(7, 1, 'Material de Construcción', 20000, 30000, 50, 'material_construccion.jpg', 'Materiales básicos para construcción.', 'Desconocido', 'Desconocido', 50.00, 50.00, 5.00),
(8, 1, 'Llave Allen', 1000, 2000, 200, 'llave_allen.jpg', 'Llave Allen de diversos tamaños.', 'Desconocido', 'Desconocido', 10.00, 10.00, 0.20),
(9, 1, 'Pinza de Presión', 6000, 9000, 60, 'pinza_presion.jpg', 'Pinza de presión resistente.', 'Melón', '25kg', 30.00, 50.00, 25.00),
(10, 1, 'Cinta Métrica', 2000, 4000, 100, 'cinta_metrica.jpg', 'Cinta métrica de 5 metros.', 'Desconocido', 'Desconocido', 100.00, 100.00, 1500.00),
(11, 2, 'Saco de Cemento', 5000, 7000, 100, 'cemento.jpg', 'Saco de cemento de 25 kg.', 'Sipa', 'Latex', 10.00, 20.00, 1.00),
(12, 2, 'Metro Cúbico de Arena', 20000, 25000, 50, 'arena.jpg', 'Arena de alta calidad para construcción.', 'Desconocido', 'Desconocido', 10.00, 15.00, 0.50),
(13, 2, 'Ladrillo Hueco', 300, 500, 1000, 'ladrillo.jpg', 'Ladrillo hueco para construcciones sólidas.', 'Desconocido', 'Desconocido', 30.00, 30.00, 2.00),
(14, 2, 'Pintura Látex', 15000, 20000, 70, 'pintura_latex.jpg', 'Pintura látex para interiores y exteriores.', 'Volcar', 'Yeso', 15.00, 20.00, 1.50),
(15, 2, 'Barniz para Madera', 8000, 12000, 60, 'barniz.jpg', 'Barniz transparente para protección de madera.', 'Desconocido', 'Desconocido', 100.00, 100.00, 10.00),
(16, 2, 'Cerámico para Piso', 10000, 15000, 40, 'ceramico_piso.jpg', 'Cerámico de alta resistencia para pisos.', 'Desconocido', 'Desconocido', 0.50, 5.00, 0.01),
(17, 2, 'Yeso en Polvo', 2000, 3500, 80, 'yeso.jpg', 'Yeso en polvo para acabados perfectos.', 'Bravo', 'Cola', 30.00, 50.00, 25.00),
(18, 2, 'Malla Electrosoldada', 5000, 7500, 100, 'malla_electrosoldada.jpg', 'Malla electrosoldada para refuerzos.', 'Desconocido', 'Desconocido', 20.00, 15.00, 0.50),
(19, 2, 'Clavos de Construcción', 1000, 1500, 300, 'clavos.jpg', 'Clavos de construcción de diversos tamaños.', 'Desconocido', 'Desconocido', 10.00, 20.00, 0.10),
(20, 2, 'Cemento Cola', 6000, 9000, 90, 'cemento_cola.jpg', 'Cemento cola para fijación de cerámicos.', 'Desconocido', 'Desconocido', 15.00, 5.00, 0.05),
(21, 3, 'Casco de Seguridad', 7000, 10000, 50, 'casco.jpg', 'Casco de seguridad resistente a impactos.', 'Desconocido', 'N95', 10.00, 10.00, 0.02),
(22, 3, 'Guantes de Trabajo', 3000, 5000, 100, 'guantes.jpg', 'Guantes de trabajo de alta resistencia.', 'Desconocido', 'Desconocido', 10.00, 15.00, 0.10),
(23, 3, 'Lentes de Seguridad', 2000, 4000, 80, 'lentes_seguridad.jpg', 'Lentes de seguridad contra partículas.', 'Desconocido', 'Desconocido', 10.00, 30.00, 1.50),
(24, 3, 'Mascarilla N95', 1500, 2500, 200, 'mascarilla.jpg', 'Mascarilla N95 para protección respiratoria.', 'Desconocido', 'Desconocido', 20.00, 30.00, 0.20),
(25, 3, 'Protector Auditivo', 5000, 7500, 70, 'protector_auditivo.jpg', 'Protector auditivo contra ruidos fuertes.', 'Desconocido', 'Desconocido', 20.00, 40.00, 1.00),
(26, 3, 'Botas de Seguridad', 20000, 30000, 40, 'botas.jpg', 'Botas de seguridad con punta de acero.', 'Desconocido', 'Desconocido', 15.00, 20.00, 0.30),
(27, 3, 'Chaleco Reflectante', 3000, 4500, 60, 'chaleco.jpg', 'Chaleco reflectante para alta visibilidad.', 'Desconocido', 'Desconocido', 15.00, 20.00, 0.50),
(28, 3, 'Arnés de Seguridad', 25000, 35000, 30, 'arnes.jpg', 'Arnés de seguridad para trabajos en altura.', 'Desconocido', 'Desconocido', 0.50, 5.00, 0.02),
(29, 3, 'Rodilleras de Trabajo', 8000, 12000, 50, 'rodilleras.jpg', 'Rodilleras de trabajo para protección.', 'Desconocido', 'Desconocido', 1.00, 5.00, 0.05),
(30, 3, 'Cinturón Lumbar', 6000, 9000, 40, 'cinturon.jpg', 'Cinturón lumbar para soporte de espalda.', 'Desconocido', 'Desconocido', 0.50, 5.00, 0.02),
(31, 4, 'Tornillo Drywall', 1000, 2000, 300, 'tornillo_drywall.jpg', 'Tornillo para construcción en drywall.', 'Desconocido', 'Desconocido', 5.00, 20.00, 0.20),
(32, 4, 'Anclaje de Expansión', 500, 1000, 500, 'anclaje_expansion.jpg', 'Anclaje de expansión para fijaciones fuertes.', 'Desconocido', 'Desconocido', 0.50, 5.00, 0.02),
(33, 4, 'Tornillo Autorroscante', 800, 1500, 400, 'tornillo_autorroscante.jpg', 'Tornillo autorroscante de acero inoxidable.', 'Desconocido', 'Desconocido', 0.50, 5.00, 0.02),
(34, 4, 'Anclaje Químico', 7000, 12000, 60, 'anclaje_quimico.jpg', 'Anclaje químico para cargas pesadas.', 'Desconocido', 'Desconocido', 0.50, 5.00, 0.02),
(35, 4, 'Tornillo de Madera', 1500, 2500, 350, 'tornillo_madera.jpg', 'Tornillo especial para madera.', 'Desconocido', 'Desconocido', 1.00, 5.00, 0.05),
(36, 4, 'Tornillo de Metal', 2000, 3000, 200, 'tornillo_metal.jpg', 'Tornillo para fijaciones en metal.', 'Desconocido', 'Desconocido', 0.50, 5.00, 0.01),
(37, 4, 'Tornillo de Concreto', 2500, 4000, 150, 'tornillo_concreto.jpg', 'Tornillo diseñado para concreto.', 'Desconocido', 'Desconocido', 0.50, 5.00, 0.01),
(38, 4, 'Anclaje de Cuña', 4000, 6000, 100, 'anclaje_cuna.jpg', 'Anclaje de cuña para estructuras pesadas.', 'Stanley', 'PowerLock', 10.00, 5.00, 0.30),
(39, 4, 'Tornillo de Plástico', 500, 1000, 600, 'tornillo_plastico.jpg', 'Tornillo para materiales plásticos.', 'Stanley', 'Cross90', 20.00, 10.00, 1.00),
(40, 4, 'Tornillo de Latón', 3000, 4500, 120, 'tornillo_laton.jpg', 'Tornillo de latón resistente a la corrosión.', 'Desconocido', 'Desconocido', 5.00, 15.00, 0.20),
(41, 5, 'Adhesivo Epoxi', 8000, 12000, 80, 'adhesivo_epoxi.jpg', 'Adhesivo epoxi de alta resistencia.', 'Desconocido', 'Desconocido', 5.00, 15.00, 0.10),
(42, 5, 'Silicona Transparente', 3000, 5000, 200, 'silicona.jpg', 'Silicona transparente para sellado.', 'Desconocido', 'Desconocido', 5.00, 10.00, 0.20),
(43, 5, 'Cinta Doble Faz', 2000, 3500, 150, 'cinta_doble_faz.jpg', 'Cinta doble faz para fijaciones rápidas.', 'Desconocido', 'Desconocido', 5.00, 10.00, 0.20),
(44, 5, 'Pegamento Instantáneo', 1000, 2000, 300, 'pegamento_instantaneo.jpg', 'Pegamento instantáneo de alta adherencia.', 'Desconocido', 'Desconocido', 5.00, 100.00, 0.20),
(45, 5, 'Adhesivo de Contacto', 4000, 6000, 120, 'adhesivo_contacto.jpg', 'Adhesivo de contacto para múltiples materiales.', 'Desconocido', 'Desconocido', 5.00, 10.00, 0.20),
(46, 5, 'Cinta Aislante', 1500, 2500, 250, 'cinta_aislante.jpg', 'Cinta aislante para uso eléctrico.', 'Desconocido', 'Desconocido', 5.00, 5.00, 0.05),
(47, 5, 'Masilla para Madera', 5000, 7500, 100, 'masilla_madera.jpg', 'Masilla para reparación de madera.', 'Desconocido', 'Desconocido', 10.00, 5.00, 0.30),
(48, 5, 'Adhesivo para PVC', 3000, 4500, 180, 'adhesivo_pvc.jpg', 'Adhesivo especial para tubos de PVC.', 'Würth', 'Epoxi', 5.00, 10.00, 0.10),
(49, 5, 'Cinta Antideslizante', 3500, 5500, 130, 'cinta_antideslizante.jpg', 'Cinta antideslizante para superficies.', 'Agorex', 'Transparente', 5.00, 20.00, 0.30),
(50, 5, 'Sellador Acrílico', 2500, 4000, 170, 'sellador_acrilico.jpg', 'Sellador acrílico para juntas y grietas.', 'Desconocido', 'Desconocido', 5.00, 10.00, 0.10),
(51, 6, 'Cinta Métrica de 10m', 5000, 7500, 90, 'cinta_10m.jpg', 'Cinta métrica de 10 metros para medidas precisas.', 'Kores', 'Instantáneo', 2.00, 5.00, 0.02),
(52, 6, 'Nivel Láser', 30000, 40000, 20, 'nivel_laser.jpg', 'Nivel láser para alineación perfecta.', 'Agorex', 'Contacto', 5.00, 10.00, 0.20),
(53, 6, 'Calibrador Vernier', 10000, 15000, 60, 'calibrador_vernier.jpg', 'Calibrador Vernier de alta precisión.', 'Desconocido', 'Desconocido', 5.00, 5.00, 0.05),
(54, 6, 'Termómetro Infrarrojo', 25000, 35000, 30, 'termometro_infrarrojo.jpg', 'Termómetro infrarrojo sin contacto.', 'Sipa', 'Retape', 5.00, 10.00, 0.20),
(55, 6, 'Multímetro Digital', 15000, 20000, 40, 'multimetro.jpg', 'Multímetro digital para medidas eléctricas.', 'Vinilit', 'PVC', 5.00, 10.00, 0.20),
(56, 6, 'Medidor de Humedad', 20000, 30000, 25, 'medidor_humedad.jpg', 'Medidor de humedad para construcción.', 'Desconocido', 'Desconocido', 5.00, 10.00, 0.10),
(57, 6, 'Regla Metálica', 3000, 4500, 80, 'regla_metalica.jpg', 'Regla metálica de 1 metro.', 'Desconocido', 'Desconocido', 5.00, 20.00, 0.30),
(58, 6, 'Medidor de Distancia Láser', 40000, 50000, 15, 'medidor_distancia_laser.jpg', 'Medidor de distancia láser de alta precisión.', 'Desconocido', 'Desconocido', 10.00, 30.00, 0.20),
(59, 6, 'Cronómetro Digital', 5000, 7500, 50, 'cronometro.jpg', 'Cronómetro digital para tiempos precisos.', 'Desconocido', 'Desconocido', 5.00, 20.00, 0.10),
(60, 6, 'Taco de Medición', 10000, 15000, 40, 'taco_medicion.jpg', 'Taco de medición para calibraciones.', 'Desconocido', 'Desconocido', 10.00, 20.00, 0.05);


/*EMPLEADO_USERS*/

INSERT INTO `EMPLEADO_USUARIO` (`ID_EMP_US`,`ID_EMPLEADO`,`NOM_USER`,`CONTRASENIA`) VALUES (1,1,'iserchwell0','jCEPG22250P');
INSERT INTO `EMPLEADO_USUARIO` (`ID_EMP_US`,`ID_EMPLEADO`,`NOM_USER`,`CONTRASENIA`) VALUES (2,2,'abethel1','wHSGB64788');
INSERT INTO `EMPLEADO_USUARIO` (`ID_EMP_US`,`ID_EMPLEADO`,`NOM_USER`,`CONTRASENIA`) VALUES (3,3,'pdenver2','lCHOV591485');
INSERT INTO `EMPLEADO_USUARIO` (`ID_EMP_US`,`ID_EMPLEADO`,`NOM_USER`,`CONTRASENIA`) VALUES (4,4,'ebroster3','gNYEO28840s');
INSERT INTO `EMPLEADO_USUARIO` (`ID_EMP_US`,`ID_EMPLEADO`,`NOM_USER`,`CONTRASENIA`) VALUES (5,5,'oamott4','dPXOL02828/R');
INSERT INTO `EMPLEADO_USUARIO` (`ID_EMP_US`,`ID_EMPLEADO`,`NOM_USER`,`CONTRASENIA`) VALUES (6,6,'blangfield5','dJWGW65986');
INSERT INTO `EMPLEADO_USUARIO` (`ID_EMP_US`,`ID_EMPLEADO`,`NOM_USER`,`CONTRASENIA`) VALUES (7,7,'ybenneyworth6','qUKQU80899');
INSERT INTO `EMPLEADO_USUARIO` (`ID_EMP_US`,`ID_EMPLEADO`,`NOM_USER`,`CONTRASENIA`) VALUES (8,8,'dtames7','sPZEA59716');
INSERT INTO `EMPLEADO_USUARIO` (`ID_EMP_US`,`ID_EMPLEADO`,`NOM_USER`,`CONTRASENIA`) VALUES (9,9,'bmaling8','aQQFO53846');
INSERT INTO `EMPLEADO_USUARIO` (`ID_EMP_US`,`ID_EMPLEADO`,`NOM_USER`,`CONTRASENIA`) VALUES (10,10,'bpidgeon9','rISNP03567');
INSERT INTO `EMPLEADO_USUARIO` (`ID_EMP_US`,`ID_EMPLEADO`,`NOM_USER`,`CONTRASENIA`) VALUES (11,11,'missakova','tU4$eF!K');
INSERT INTO `EMPLEADO_USUARIO` (`ID_EMP_US`,`ID_EMPLEADO`,`NOM_USER`,`CONTRASENIA`) VALUES (12,101,'Diego','Ruminot2004');