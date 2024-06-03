$(document).ready(function() {
    const carrito = window.localStorage.getItem("carrito");
    if(carrito == null){
        let carrito = {carro:[]};
        window.localStorage.setItem("carrito", JSON.stringify(carrito));
        console.log("Se ha creado el carrito");
    }
});

function aggCar(num) {
    let aidi = num;
    let verificar = false;
    let carrito = JSON.parse(localStorage.getItem("carrito")) || {carro: []};
    if (!carrito.carro) {
        carrito.carro = [];
    }
    carrito.carro.forEach(element => {
        if(element[0] == aidi){
            verificar = true;
        }
    });
    if (verificar) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'El elemento ya existe en el carrito',
            showConfirmButton: false,
            timer: 3000
        });
    }else{
        carrito.carro.push([aidi,1]);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        Swal.fire({
            icon: 'success',
            title: 'Añadido!',
            text: 'Se añadió al carrito',
            showConfirmButton: false,
            timer: 3000
        });
    }
    console.log(carrito);
}