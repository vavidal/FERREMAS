const exampleModal = document.getElementById('exampleModal');
if (exampleModal) {
    exampleModal.addEventListener('show.bs.modal', event => {
        const button = event.relatedTarget;
        const recipient = button.getAttribute('data-bs-whatever');
        const modalTitle = exampleModal.querySelector('.modal-title');
        const modalBodyInput = exampleModal.querySelector('.modal-body input');
        jQuery(function() {
            $('#contenido').empty();
            $('#contenido').append(`
                <form action="/stock/${recipient}" method="post">
                <div class="mb-3">
                    <label for="recipient-name" class="col-form-label">Introduce el nuevo Stock:</label>
                    <input type="number" class="form-control" id="stockId" name="stockId" min="10">
                </div>
                <button type="submit" class="btn btn-primary">Enviar</button>
                </form>
            `);
        });
        modalTitle.textContent = `Cambiar el stock al producto de SKU: ${recipient}`;
    })
}