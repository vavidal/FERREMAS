// Buscar y almacenar referencias a elementos relevantes
var itemCarrito = document.querySelector(".item-carrito");
var precioTotalElement = document.getElementById("precio");
let carrito = JSON.parse(localStorage.getItem('carrito'));
var total = document.getElementById("total");
// Agregar un solo controlador de eventos al contenedor del carrito
itemCarrito.addEventListener('click', function(event) {
    var target = event.target;
    var fila = target.closest('.fila-carrito');
    var elemento = fila.querySelector('#aidi').value;
    if (target.classList.contains('eliminar')) {
        // Eliminar el elemento del localStorage
        carrito.carro.forEach((element, index) => {
            if (element[0] == elemento) {
                carrito.carro.splice(index, 1);
                //Guardar el arreglo sin el item en el LocalStorage
                localStorage.setItem('carrito', JSON.stringify(carrito));
                // Eliminar el elemento del carrito
                fila.remove();
                // Recalcular el total del carrito
                items();
                actualizarTotalCarrito();
            }
        });
    } else if (target.classList.contains('increase')) {
        updateQuantity(target, 'increase');
    } else if (target.classList.contains('decrease')) {
        updateQuantity(target, 'decrease');
    }
});

// Función para actualizar la cantidad de un producto
function updateQuantity(button, action) {
    var input = button.parentNode.querySelector('input[type=number]');
    var fila = button.closest('.fila-carrito');
    var elemento = fila.querySelector('#aidi').value;
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
    carrito.carro.forEach(element=>{
        if(element[0] == elemento){
            element[1] = input.value;
            localStorage.setItem('carrito', JSON.stringify(carrito));
        }
    })
}


// Función para actualizar el total del carrito
function actualizarTotalCarrito(){
    var filasCarrito = itemCarrito.querySelectorAll(".fila-carrito");
    var totalCarrito = 0;

    // Iterar sobre las filas del carrito
    filasCarrito.forEach(function(filaCarrito) {
        var precioItem = filaCarrito.querySelector(".precio");
        var cantidadItem = filaCarrito.querySelector(".cantidad");
        if(precioItem.innerText.length==4){
            var precio = parseFloat(precioItem.innerText.replace('$', ''));
            var cantidad = cantidadItem.value;
            var subtotal =precio * cantidad;
            totalCarrito += subtotal;
        }else{
            var precio = precioItem.innerText.replace('$', '');
            precio = precio.replace('.', '');
            precio = parseFloat(precio);
            var cantidad = cantidadItem.value;
            var subtotal = precio * cantidad;
            totalCarrito += subtotal;
        }
    });
    var totalTexto = '$';
    const miles = Math.floor(totalCarrito/1000);
    const cientos = totalCarrito%1000;
    if(miles > 0 && cientos > 0){
        totalTexto += miles + '.' + cientos;
    }else if(miles > 0){
        totalTexto += miles+".000";
    }else{
        totalTexto += cientos;
    }
    precioTotalElement.textContent = totalTexto;
    total.value = totalCarrito; // Actualiza el precio total del carrito
    window.localStorage.setItem('total',totalCarrito);
}
