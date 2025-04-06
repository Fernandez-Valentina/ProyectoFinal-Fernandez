// app.js - Lógica Principal

// Manejo del historial
const historialConsultas = JSON.parse(localStorage.getItem("historial")) || [];

// Importar funciones desde utils.js
import { mostrarHistorial, borrarHistorial, guardarEnHistorial, mostrarError, generarClimaAleatorio, generarPronostico } from './utils.js';


// Sección Clima Actual
function mostrarClimaActual() {
    let ciudad = document.getElementById("ciudad").value.trim();

    if (ciudad === "" || /\d/.test(ciudad)) {
        mostrarError("Por favor, ingrese una ciudad válida.");
        return;
    }

    let climaAleatorio = generarClimaAleatorio();
    let resultado = document.getElementById("resultado");
    resultado.innerHTML = `<p>El clima en ${ciudad} es ${climaAleatorio}</p>`;

    guardarEnHistorial(`Clima en ${ciudad}: ${climaAleatorio}`);
    mostrarHistorial();
}

document.getElementById("buscarClima").addEventListener("click", mostrarClimaActual);


// Sección Pronóstico del Clima
function mostrarPronostico() {
    let dias = parseInt(document.getElementById("dias").value);

    if (isNaN(dias) || dias < 1 || dias > 5) {
        mostrarError("Por favor, ingrese un número válido entre 1 y 5.");
        return;
    }

    let pronosticoResultado = document.getElementById("pronosticoResultado");
    pronosticoResultado.innerHTML = generarPronostico(dias);
}
document.getElementById("verPronostico").addEventListener("click", mostrarPronostico);


// Sección Conversor de Temperatura
function convertirTemperatura() {
    let celsiusInput = document.getElementById("temperaturaCelsius");
    let celsius = parseFloat(celsiusInput.value);

    if (isNaN(celsius)) {
        mostrarError("Por favor, ingrese un número válido.");
        return;
    }

    let fahrenheit = (celsius * 9/5) + 32;
    let resultado = document.getElementById("conversionResultado");
    resultado.innerHTML = `<p>${celsius}°C es igual a ${fahrenheit.toFixed(2)}°F</p>`;
}

document.getElementById("convertirTemperatura").addEventListener("click", convertirTemperatura);


document.addEventListener("DOMContentLoaded", mostrarHistorial);
document.getElementById("borrarHistorial").addEventListener("click", borrarHistorial);
