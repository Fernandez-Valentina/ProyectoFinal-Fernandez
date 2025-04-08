// app.js - Lógica Principal

// Manejo del historial
const historialConsultas = JSON.parse(localStorage.getItem("historial")) || [];

// Importar funciones desde utils.js
import { mostrarHistorial, borrarHistorial, guardarEnHistorial, mostrarError, generarPronostico } from './utils.js';


// Sección Clima Actual
async function mostrarClimaActual() {
    let ciudad = document.getElementById("ciudad").value.trim();

    if (ciudad === "" || /\d/.test(ciudad)) {
        mostrarError("Por favor, ingrese una ciudad válida.");
        return;
    }

    await obtenerClima(ciudad); // Llama a la función de la API aquí
    document.getElementById("ciudad").value = "";
}

async function obtenerClima(ciudad) {
    const apiKey = 'e15504fb263a3c127aa7bc00f41391f9';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`;

    try {
        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            throw new Error("Ciudad no encontrada o error al conectar con la API.");
        }

        const datos = await respuesta.json();

        const resultado = document.getElementById("resultado");
        

        // Mostrar la información en SweetAlert
        Swal.fire({
            title: `Clima en ${datos.name}`,
            html: `
                <p><strong>Temperatura:</strong> ${datos.main.temp}°C</p>
                <p><strong>Clima:</strong> ${datos.weather[0].description}</p>
                <p><strong>Humedad:</strong> ${datos.main.humidity}%</p>
                <p><strong>Viento:</strong> ${datos.wind.speed} m/s</p>
            `,
            icon: 'success'
        });

        const consulta = `Clima en ${datos.name}: ${datos.weather[0].description}, ${datos.main.temp}°C, Humedad: ${datos.main.humidity}%, Viento: ${datos.wind.speed} m/s`;
        guardarEnHistorial(consulta);  // Guardar en el historial
        mostrarHistorial();  // Actualizar el historial en pantalla

    } catch (error) {
        Swal.fire({
            title: '¡Error!',
            text: error.message,
            icon: 'error'
        });
    }
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
