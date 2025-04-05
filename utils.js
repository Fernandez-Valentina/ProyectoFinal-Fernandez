// utils.js - Funciones Auxiliares

// Generar clima aleatorio
export function generarClimaAleatorio() {
    const climas = ["Soleado", "Nublado", "Lluvioso", "Tormentoso", "Nevado"];
    return climas[Math.floor(Math.random() * climas.length)];
}

// Generar pronóstico aleatorio para varios días
export function generarPronostico(dias) {
    const pronostico = ["Soleado", "Nublado", "Lluvioso", "Tormentoso", "Nevado"];
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

    let fechaActual = new Date();

    return Array.from({ length: dias }, (_, i) => {
        let diaSemana = diasSemana[(fechaActual.getDay() + i) % 7];
        let climaAleatorio = pronostico[Math.floor(Math.random() * pronostico.length)];
        return `<p>${diaSemana}: ${climaAleatorio}</p>`;
    }).join("");
}

// Mostrar errores en pantalla
export function mostrarError(elementId, mensaje) {
    document.getElementById(elementId).textContent = mensaje;
}

// Mostrar historial
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

// Guardar en historial
export function guardarEnHistorial(consulta) {
    const historialConsultas = JSON.parse(localStorage.getItem("historial")) || [];
    historialConsultas.push(consulta);
    localStorage.setItem("historial", JSON.stringify(historialConsultas));
}

// Borrar historial
export function borrarHistorial() {
    localStorage.removeItem("historial");
    mostrarHistorial();
}
