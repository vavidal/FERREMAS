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
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    if (carrito.carro.includes(aidi)) {
        alert("El elemento ya existe en el carrito");
    }else{
        carrito.carro.push(aidi);
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }
    console.log(carrito);
}