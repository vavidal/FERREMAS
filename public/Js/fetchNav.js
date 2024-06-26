const login = localStorage.getItem("isLogged");
const datos = JSON.parse(localStorage.getItem("userData"));

function cerrar(){
    localStorage.setItem("isLogged", "false");
    localStorage.removeItem('userData');
    window.location.href = "/";
}

if(login=="true"){
    fetch("/HTML/navWorker.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById('navbar-container').innerHTML = data;
    })
    .catch(error => console.error('Error cargando el navbar:', error));
    jQuery(function() {
        $('#datos').empty();
        $('#datos').append(`
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false" id="datos">
                            Bienvenido, ${datos.nombre} 
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><a class="dropdown-item" onclick="cerrar()">Cerrar Sesión</a></li>
                        </ul>
                    </li>
                </ul>
            </nav>
        `);
    });
}else{
    fetch("/HTML/navCliente.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById('navbar-container').innerHTML = data;
    })
    .catch(error => console.error('Error cargando el navbar:', error));
}
fetch("/HTML/footer.html")
.then(response => response.text())
.then(data => {
    document.getElementById('footer-container').innerHTML = data;
})
.catch(error => console.error('Error cargando el navbar:', error));

