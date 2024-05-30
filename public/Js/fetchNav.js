fetch("/HTML/navbar.html")
.then(response => response.text())
.then(data => {
    document.getElementById('navbar-container').innerHTML = data;
})
.catch(error => console.error('Error cargando el navbar:', error));

fetch("/HTML/footer.html")
.then(response => response.text())
.then(data => {
    document.getElementById('footer-container').innerHTML = data;
})
.catch(error => console.error('Error cargando el navbar:', error));

