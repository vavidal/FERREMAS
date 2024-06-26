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
                                <td>
                                    <form action="#" method="post">
                                        <button type="submit" class="btn btn-danger" disabled> Ver Detalle de Venta</button>
                                    </form>
                                </td>
                                <td>
                                    <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="" disabled>
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
                                <td>
                                    <form action="#" method="post">
                                        <button type="submit" class="btn btn-danger" disabled> Ver Detalle de Venta</button>
                                    </form>
                                </td>
                                <td>
                                    <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="" disabled>
                                        Despacha la Venta
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