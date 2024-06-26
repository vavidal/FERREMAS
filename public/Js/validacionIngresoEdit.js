document.getElementById("descripcion").addEventListener('input', function() {
    const text = document.getElementById("descripcion").value;
    const len = text.length;
    var min = 20;
    var max = 500;
    if(len<min){
        document.getElementById("charDes").innerHTML = len + "/" + min;
    }else if(len<max){
        document.getElementById("charDes").innerHTML = len + "/" + max;
    }
    else{
      document.getElementById("charDes").innerHTML = "La descripción debe tener menos de 500 caracteres.";
    }
  });

  document.getElementById("nombreProd").addEventListener('input', function() {
    const text = document.getElementById("nombreProd").value;
    const len = text.length;
    var min = 5;
    var max = 50;
    if(len < min || len > max){
      document.getElementById("charNom").innerHTML = "El nombre debe tener entre 5 y 50 caracteres.";
    }else{
      document.getElementById("charNom").innerHTML = "";
    }
  });

  document.getElementById("stockProd").addEventListener('input', function() {
    const text = document.getElementById("stockProd").value;
    var min = 10;
    if(text < min){
      document.getElementById("valStock").innerHTML = "El stock debe ser mayor a 10.";
    }else{
        document.getElementById("valStock").innerHTML = "";
    }
  });

  document.getElementById("costoProducto").addEventListener('input', function() {
    const text = document.getElementById("costoProducto").value;
    var min = 100;
    if(text < min){
        document.getElementById("valCosto").innerHTML = "El costo debe ser mayor a 100.";
    }else{
        document.getElementById("valCosto").innerHTML = "";
    }
  });

  document.getElementById("ventaProducto").addEventListener('input', function() {
    const text = document.getElementById("ventaProducto").value;
    var min = 100;
    if(text < min){
        document.getElementById("valVenta").innerHTML = "El valor de venta debe ser mayor a 100.";
    }else{
        document.getElementById("valVenta").innerHTML = "";
    }
  });

  document.querySelector('form').addEventListener('submit', function(event) {
    var bDes = false;
    var bNom = false;
    var bCan = false;
    var bCos = false;
    var bVen = false;
    var minCan = 10;
    var minCosVen = 100;
    var minDes = 20;
    var maxDes = 500;
    var minNom = 5;
    var maxNom = 50;
    const des = document.getElementById("descripcion").value;
    const lenDes = text.length;
    const nom = document.getElementById("nombreProd").value;
    const lenNom = text.length;
    const can = document.getElementById("stockProd").value;
    const cos = document.getElementById("costoProducto").value;
    const ven = document.getElementById("ventaProducto").value;

    if(lenDes < minDes || lenDes > maxDes){
      bDes = true;
    } 
    if(lenNom < minNom || lenNom > maxNom){
      bNom = true;
    }
    if(can < minCan){
      bCan = true;
    }
    if(cos < minCosVen){
      bCos = true;
    }
    if(ven < minCosVen){
      bVen = true;
    }
    if(bDes || bNom || bCan || bCos || bVen){
        alert("Los datos no son validos, verifique los campos.");
        event.preventDefault();
    }
  });