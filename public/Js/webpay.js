/*
Datos para el futuro:
Código de Comercio:597055555532
Apikey: 579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
*/
function action() {
    var cont = document.getElementById("total");
    var texto = "$";
    var total = localStorage.getItem("total");
    var miles = Math.floor(total/1000);
    var cientos = total%1000;
    if(miles!=0 && cientos!=0){
        texto +=miles+"."+cientos;
    }else if(cientos > 0 && miles==0){
        texto += cientos;
    }else if(miles!=0 && cientos==0){
        texto += miles+".000";
    }
    cont.innerHTML = "Total a pagar: " + texto;
}

function guardarDatos(){
    var total = localStorage.getItem("total");
    
    var ordenCompra = localStorage.getItem("orden");

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const rut = document.getElementById("rut").value;
    const direccion = document.getElementById("direccion").value;

    var final = {
      orco:ordenCompra,
      total:total,
      cliente:{nombre,email,rut,direccion}
    };

    localStorage.setItem("final", JSON.stringify(final));
}
