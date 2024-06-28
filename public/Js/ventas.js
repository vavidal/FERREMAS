function filtrar(){
    const despacho = document.getElementById("despacho").value;
    jQuery(function() {
        $.ajax({
            url: '/filtrar_ventas', 
            method: 'GET',
            data: {data:despacho},
            dataType: 'json',
            success: function(response) {
                $("#ventas").empty();
                response.forEach(venta => {
                    if(venta.DESP == 0){
                        $("#ventas").append(`
                            <tr>
                                <th scope="row">${venta.NUMBOLETA}</th>
                                <td>${venta.NUMEMP}</td>
                                <td>${venta.NOMEMP}</td>
                                <td>${venta.RUTCOMPLETO}</td>
                                <td>${venta.CLINAME}</td>
                                <td>${venta.EMAIL}</td>
                                <td>${venta.FECHA}</td>
                                <td>No Despachada</td>
                                <td>
                                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#detalleVenta" data-bs-whatever="${venta.NUMBOLETA}">
                                        Ver Detalle de Venta
                                    </button>
                                </td>
                                <td>
                                    <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#numSeguimiento" data-bs-whatever="${venta.NUMBOLETA}" data-bs-email="${venta.EMAIL}">
                                        Despacha la Venta
                                    </button>
                                </td>
                            </tr>
                        `);
                    }else{
                        $("#ventas").append(`
                            <tr>
                                <th scope="row">${venta.NUMBOLETA}</th>
                                <td>${venta.NUMEMP}</td>
                                <td>${venta.NOMEMP}</td>
                                <td>${venta.RUTCOMPLETO}</td>
                                <td>${venta.CLINAME}</td>
                                <td>${venta.EMAIL}</td>
                                <td>${venta.FECHA}</td>
                                <td>Despachada</td>
                                <td>
                                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#detalleVenta" data-bs-whatever="${venta.NUMBOLETA}" >
                                        Ver Detalle de Venta
                                    </button>
                                </td>
                                <td>
                                    <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#numSeguimiento" data-bs-whatever="${venta.NUMBOLETA}" data-bs-email="${venta.EMAIL}" >
                                        Despacha la Venta
                                    </button>
                                </td>
                                <td>
                                    <button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#verSeguimiento" data-bs-whatever="${venta.NUMBOLETA}">
                                        Ver número de seguimiento
                                    </button>
                                </td>
                            </tr>
                        `);
                    }
                });
            },
            error: function(error) {
                console.error('Error fetching data:', error);
            }
        });
    });
}