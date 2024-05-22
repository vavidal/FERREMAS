

// Buscar y almacenar referencias a elementos relevantes
var itemCarrito = document.querySelector(".item-carrito");
var precioTotalElement = document.getElementById("precio");
var total = document.getElementById("valor");
// Agregar un solo controlador de eventos al contenedor del carrito
itemCarrito.addEventListener('click', function(event) {
    var target = event.target;
    if (target.classList.contains('eliminar')) {
        // Eliminar el elemento del carrito
        target.closest('.fila-carrito').remove();
        // Recalcular el total del carrito
        actualizarTotalCarrito();
    } else if (target.classList.contains('increase')) {
        updateQuantity(target, 'increase');
    } else if (target.classList.contains('decrease')) {
        updateQuantity(target, 'decrease');
    }
});

// Función para actualizar la cantidad de un producto
function updateQuantity(button, action) {
    var input = button.parentNode.querySelector('input[type=number]');
    var currentValue = parseInt(input.value);
    
    // Escuchar el evento input para detectar cambios en la cantidad
    input.addEventListener('input', function() {
        var newValue = parseInt(input.value);
        if (isNaN(newValue) || newValue <= 0) {
            input.value = 1;
        }
        actualizarTotalCarrito(); // Llama a la función para recalcular el total del carrito
    });

    // Actualizar el total del carrito cuando se haga clic en los botones de aumento/disminución
    if (action === 'increase') {
        input.value = currentValue + 1;
    } else if (action === 'decrease' && currentValue > 1) {
        input.value = currentValue - 1;
    }
    actualizarTotalCarrito(); // Llama a la función para recalcular el total del carrito
}


// Función para actualizar el total del carrito
function actualizarTotalCarrito(){
    var filasCarrito = itemCarrito.querySelectorAll(".fila-carrito");
    var totalCarrito = 0;

    // Iterar sobre las filas del carrito
    filasCarrito.forEach(function(filaCarrito) {
        var precioItem = filaCarrito.querySelector(".precio");
        var cantidadItem = filaCarrito.querySelector(".cantidad");
        var precio = parseFloat(precioItem.innerText.replace('$', ''));
        var cantidad = cantidadItem.value;
        var subtotal = precio * cantidad;
        totalCarrito += subtotal;
    });

    console.log(totalCarrito*1000);
    precioTotalElement.textContent = "$" + totalCarrito.toFixed(3);
    total.value = totalCarrito*1000; // Actualiza el precio total del carrito
}
