export function mostrarError(mensaje) {
    Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: mensaje,
    });
}

export function mostrarHistorial() {
    const historialConsultas = JSON.parse(localStorage.getItem("historial")) || [];
    let historialLista = document.getElementById("historialLista");
    historialLista.innerHTML = historialConsultas.length === 0 ? "<li>Historial vacío</li>" : "";

    historialConsultas.forEach(elemento => {
        let li = document.createElement("li");
        li.textContent = elemento;
        historialLista.appendChild(li);
    });
}

export function guardarEnHistorial(consulta) {
    const historialConsultas = JSON.parse(localStorage.getItem("historial")) || [];
    historialConsultas.push(consulta);
    localStorage.setItem("historial", JSON.stringify(historialConsultas));
}

export function borrarHistorial() {
    localStorage.removeItem("historial");
    mostrarHistorial();

    Swal.fire ({
        icon: 'success',
        title: '¡Historial Borrado!',
        text: 'El historial ha sido eliminado.',
        timer: 2000,
        showConfirmButton: false
    });
}
