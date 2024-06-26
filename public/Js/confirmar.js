const data = JSON.parse(localStorage.getItem("userData"));
document.addEventListener('DOMContentLoaded', function() {
    var datos = JSON.parse(localStorage.getItem("final"));
    var carrito = JSON.parse(localStorage.getItem("carrito"));
    const token = localStorage.getItem("token");

    jQuery(function() {
        $.ajax({
            url: '/finalizar_venta', 
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                datos : datos,
                carrito : carrito,
                token : token
            }),
            success: function() {
            },
            error: function(error) {
                console.error('Error fetching data:', error);
            }
        });
    });
    document.getElementById("nombre").innerHTML = datos.cliente.nombre;
    document.getElementById("mail").innerHTML = datos.cliente.email;
    document.getElementById("rut").innerHTML = datos.cliente.rut;
    document.getElementById("direccion").innerHTML = datos.cliente.direccion;

    window.localStorage.clear();
    
    if(data != null){
        localStorage.setItem("isLogged", "true");
        localStorage.setItem("userData", JSON.stringify(data));
    }
});
