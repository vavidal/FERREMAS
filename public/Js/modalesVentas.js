const detVenta = document.getElementById('detalleVenta');
const numSeg = document.getElementById('numSeguimiento');
const verSeg = document.getElementById('verSeguimiento');
if (detVenta || numSeg || verSeg) {
    detVenta.addEventListener('show.bs.modal', event => {
        const button = event.relatedTarget;
        const recipient = button.getAttribute('data-bs-whatever');
        const modalTitle = detVenta.querySelector('.detventa');
        jQuery(function() {
            $('#contDetVen').empty();
            try {
                $('#totalTexto').remove();
            } catch (error) {
            }
            $.ajax({
                url: '/detalle_venta',
                method: 'GET',
                data: {data:recipient},
                dataType: 'json',
                success: function(response) {
                    var total = 0;
                    response.forEach(venta => {
                        total+=venta.TOT;
                        $('#contDetVen').append(`
                            <tr>
                                <th scope="row">${venta.SKU}</th>
                                <td>${venta.NOMBRE}</td>
                                <td>${venta.NUMERO}</td>
                                <td>${venta.INDI}</td>
                                <td>${venta.TOT}</td>
                            </tr>
                        `);
                    });
                    var texto = "$";
                    if(total%1000 == 0){
                        texto+=`${Math.floor(total/1000)}.000`;
                    }else{
                        texto+=`${Math.floor(total/1000)}.${total%1000}`;
                    }
                    $('#tituloTotal').append(`<h2 id="totalTexto">Total de la venta: ${texto}</h2>`);
                },
                error: function(error) {
                    console.error('Error fetching data:', error);
                }
            });
        });
        modalTitle.textContent = `Viendo el detalle de la venta número: ${recipient}`;
    });

    numSeg.addEventListener('show.bs.modal', event => {
        const button = event.relatedTarget;
        const recipient = button.getAttribute('data-bs-whatever');
        const email = button.getAttribute('data-bs-email');
        const modalTitle = numSeg.querySelector('.numseg');
        jQuery(function() {
            $('#contNumSeg').empty();
            $('#contNumSeg').append(`
                <form action="/numSeguimiento/${recipient}" method="post">
                    <div class="mb-3">
                        <label for="recipient-name" class="col-form-label">Introduce el número de seguimiento:</label>
                        <input type="number" class="form-control" id="numSeg" name="numSeg" min="10">
                        <input type="text" class="form-control" id="email" name="email" value="${email}" hidden>
                    </div>
                    <button type="submit" class="btn btn-primary">Enviar</button>
                </form>
            `);
        });
        modalTitle.textContent = `Introduce el número de seguimiento para la venta: ${recipient}`;
    });

    verSeg.addEventListener('show.bs.modal', event => {
        const button = event.relatedTarget;
        const recipient = button.getAttribute('data-bs-whatever');
        const modalTitle = verSeg.querySelector('.verseg');
        jQuery(function() {
            $('#contVerSeg').empty();
            $.ajax({
                url: '/ver_seguimiento',
                method: 'GET',
                data: {data:recipient},
                success: function(response) {
                    console.log(response);
                    $('#contVerSeg').append(`
                        <h3>El número de seguimiento es: ${response.DESP}</h3>
                    `);
                },
                error: function(error) {
                    console.error('Error fetching data:', error);
                }
            });
        });
        modalTitle.textContent = `Viendo el número de seguimiento de la venta número: ${recipient}`;
    });
}