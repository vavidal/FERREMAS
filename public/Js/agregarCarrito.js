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
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.carro.forEach(element => {
        if(element[0] == aidi){
            verificar = true;
        }
    });
    if (verificar) {
        alert("El elemento ya existe en el carrito");
    }else{
        carrito.carro.push([aidi,1]);
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }
    console.log(carrito);
}