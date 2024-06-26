function items(){
  $(document).ready(function() {
    $('#recorrer').empty();
    let cart = JSON.parse(localStorage.getItem("carrito"));
    let contador = 1;
    cart.carro.forEach(prod => {
        let resultado;
        let ruta;
        $.ajax({
            url: `/busqueda/${prod[0]}`, 
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                data.forEach(producto => {
                    if(Math.floor(producto.VAL/1000) == 0){
                        resultado="$";
                    }else{
                        resultado="$"+Math.floor(producto.VAL/1000)+".";
                    }
                    if(producto.VAL%1000 == 0){
                        resultado+="000";
                    }else{
                        resultado+=(producto.VAL%1000).toString();
                    }
                    if(producto.ITP == 1){
                        ruta = "/Images/HerramientasManuales/"+producto.IMG;
                    }else if (producto.ITP == 2){
                        ruta = "/Images/MaterialesBasicos/"+producto.IMG;
                    }else if (producto.ITP == 3){
                        ruta = "/Images/EquiposSeguridad/"+producto.IMG;
                    }else if (producto.ITP == 4){
                        ruta = "/Images/TornillosyAnclajes/"+producto.IMG;
                    }else if (producto.ITP == 5){
                        ruta = "/Images/FijacionesAdhesivos/"+producto.IMG;
                    }else if (producto.ITP == 6){
                        ruta = "/Images/EquiposMedicion/"+producto.IMG;
                    }

                    $('#recorrer').append(`
                    <div class="row mb-4 d-flex justify-content-between align-items-center fila-carrito">
                    <div class="col-md-2 col-lg-2 col-xl-2">
                      <img
                        src="${ruta}"
                        class="img-fluid rounded-3" alt="Prod 1">
                    </div>
                    <div class="col-md-3 col-lg-3 col-xl-3">
                      <h6 class="text-muted">Item ${contador}</h6>
                      <h6 class="text-black mb-0">${producto.NOMBRE}</h6>
                    </div>
                    <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
                      <button data-mdb-button-init data-mdb-ripple-init class="btn btn-link px-2"
                        onclick="updateQuantity(this, 'decrease')">
                        <i class="fas fa-minus"></i>
                      </button>
            
                      <input type="number" id="cantidad" class="form-control form-control-sm cantidad" min="1" max="${producto.CANTIDAD}" name="quantity" value="${prod[1]}">
            
                      <button data-mdb-button-init data-mdb-ripple-init class="btn btn-link px-2"
                        onclick="updateQuantity(this, 'increase')">
                        <i class="fas fa-plus"></i>
                      </button>
                    </div>
                    <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                      <h6  class="mb-0 precio"> ${resultado} CLP</h6>
                    </div>
                    <div class="col-md-1 col-lg-1 col-xl-1 text-end">
                      <a href="#!" class="text-muted" ><i class="fas fa-times eliminar"></i></a>
                    </div>
                    <input type="number" id="aidi" value=${producto.NUMERITO} hidden>
                  </div>
                    `);
                    contador++;
                })   
                actualizarTotalCarrito();},
            error: function(error) {
                console.error('Error fetching data:', error);
            }
        });
    });
   
});
}
