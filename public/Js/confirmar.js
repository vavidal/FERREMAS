$(document).ready(function() {
    var datos = JSON.parse(localStorage.getItem("final"));
    var carrito = JSON.parse(localStorage.getItem("carrito"));

    $.ajax({
        url: '/finalizar_venta', 
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            datos : datos,
            carrito : carrito,
            token : localStorage.getItem("token")
        }),
        success: function() {
        },
        error: function(error) {
            console.error('Error fetching data:', error);
        }
    });

    document.getElementById("nombre").innerHTML = datos.cliente.nombre;
    document.getElementById("mail").innerHTML = datos.cliente.email;
    document.getElementById("rut").innerHTML = datos.cliente.rut;
    document.getElementById("direccion").innerHTML = datos.cliente.direccion;

    window.localStorage.clear();
});