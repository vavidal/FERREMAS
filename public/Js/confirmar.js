function carr(car) {
    console.log('Entering carr function');
    return Promise.all(car.map(item => {
        return new Promise((resolve, reject) => {
            console.log('Making AJAX request for item:', item);
            $.ajax({
                url: '/paso-1',
                type: 'GET',
                data: { datita: item },
                success: function(response) {
                    response.forEach(res => {
                        var elm = document.getElementById('elementos');
                        elm.innerHTML += `<tr><th scope="row">${res.AIDI}</th><td>${res.NOMBRE}</td><td>${res.CANTIDAD}</td><td>${res.INDI}</td><td>${res.TOT}</td></tr>`;
                    });
                    resolve();
                },
                error: function(error) {
                    console.log('Error in carr for item:', error);
                    reject(error);
                }
            });
        });
    }));
}

function fin(datos, carrito, token) {
    console.log('Entering fin function');
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/finalizar_venta',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                datos: datos,
                carrito: carrito,
                token: token
            }),
            success: function(response) {
                response;
                resolve();
            },
            error: function(error) {
                console.error('Error in fin:', error);
                reject(error);
            }
        });
    });
}

function envEmail(email, html, total) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/enviar_correo',
            method: 'GET',
            data: {
                email: email,
                html: html,
                total: total
            },
            success: function(response) {
                response;
                resolve();
            },
            error: function(error) {
                console.error('Error in envEmail:', error);
                reject(error);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const data = JSON.parse(localStorage.getItem("userData"));
    var datos = JSON.parse(localStorage.getItem("final"));
    var carrito = JSON.parse(localStorage.getItem("carrito"));
    const token = localStorage.getItem("token");
    const email = datos.cliente.email;
    const arCarro = carrito.carro;
    const total = datos.total;


    fin(datos, carrito, token)
        .then(() => {
            return carr(arCarro);
        })
        .then(() => {
            const tabla = document.getElementById('insTabla');
            const html = tabla.innerHTML;
            return envEmail(email, html, total);
        })
        .then(() => {
            console.log('Venta finalizada. Revisa tu correo para más información.');
            window.localStorage.clear();
        })
        .catch(error => {
            console.error('Error in process:', error);
        });

    if (data != null) {
        localStorage.setItem("isLogged", "true");
        localStorage.setItem("userData", JSON.stringify(data));
    }
});
