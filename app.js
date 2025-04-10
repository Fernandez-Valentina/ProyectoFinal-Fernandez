import { mostrarHistorial, borrarHistorial, guardarEnHistorial, mostrarError } from './utils.js';

// Obtener clima y pronóstico
async function mostrarClimaActualYPronostico(guardar = true) {
    const ciudad = document.getElementById("ciudad").value.trim();

    if (ciudad === "" || !isNaN(ciudad)) {
        Swal.fire({
            icon: 'error',
            title: 'Entrada inválida',
            text: 'Por favor, ingrese un nombre de ciudad válido.',
        });
        return;
    }

    const apiKey = 'e15504fb263a3c127aa7bc00f41391f9';

    try {
        // Clima actual
        const urlClima = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`;
        const respuestaClima = await fetch(urlClima);
        if (!respuestaClima.ok) throw new Error("No se pudo obtener el clima actual.");
        const datosClima = await respuestaClima.json();

        let descripcionActual = datosClima.weather[0].description;
        descripcionActual = descripcionActual.charAt(0).toUpperCase() + descripcionActual.slice(1);
        const iconoActual = datosClima.weather[0].icon;

        if (guardar) {
            guardarEnHistorial(`${ciudad}: ${descripcionActual}, ${datosClima.main.temp.toFixed(1)}°C`);
        }

        // Pronóstico
        const urlPronostico = `https://api.openweathermap.org/data/2.5/forecast?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`;
        const respuestaPronostico = await fetch(urlPronostico);
        if (!respuestaPronostico.ok) throw new Error("No se pudo obtener el pronóstico.");
        const datosPronostico = await respuestaPronostico.json();

        const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sabado"];
        const hoy = new Date().getDay();
        let contadorDias = 0;

        const pronosticoTexto = datosPronostico.list
            .filter(item => item.dt_txt.includes("12:00:00"))
            .slice(0, 3)
            .map(item => {
                const diaIndex = (hoy + contadorDias + 1) % 7;
                const nombreDia = diasSemana[diaIndex];
                contadorDias++;

                let descripcion = item.weather[0].description;
                descripcion = descripcion.charAt(0).toUpperCase() + descripcion.slice(1);
                const icono = item.weather[0].icon;

                return `
                    <div class="forecast-item">
                        <p class="dia-pronostico">${nombreDia}</p>
                        <img src="https://openweathermap.org/img/wn/${icono}@2x.png" alt="Icono del clima">
                        <p>${descripcion}</p>
                        <p>${item.main.temp.toFixed(1)}°C</p>
                    </div>
                `;
            })
            .join("");

        const resultado = document.getElementById("resultado");
        resultado.innerHTML = `
            <div class="current-weather">
                <h2>${datosClima.name}</h2>
                <h1>${datosClima.main.temp.toFixed(1)}°C</h1>
                <img src="https://openweathermap.org/img/wn/${iconoActual}@2x.png" alt="Icono del clima">
                <p>${descripcionActual}</p>
            </div>
            <div class="forecast-container">
                ${pronosticoTexto}
            </div>
        `;

        document.getElementById("ciudad").value = "";
        mostrarHistorial();

    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: error.message,
        });
    }
}

// BBuscar clima
document.getElementById("buscarClima").addEventListener("click", () => {
    mostrarClimaActualYPronostico(true);
});

// Conversor temperatura
function convertirTemperatura() {
    const celsiusInput = document.getElementById("temperaturaCelsius").value.trim();

    if (celsiusInput === "" || isNaN(celsiusInput)) {
        Swal.fire({
            icon: 'error',
            title: 'Entrada inválida',
            text: 'Por favor, ingrese un número válido para la conversión.',
        });
        return;
    }

    const celsius = parseFloat(celsiusInput);
    const fahrenheit = (celsius * 9 / 5) + 32;

    Swal.fire({
        icon: 'info',
        title: 'Conversión de Temperatura',
        html: `<p>${celsius.toFixed(1)}°C es igual a ${fahrenheit.toFixed(1)}°F</p>`,
        confirmButtonText: 'OK'
    });

    document.getElementById("temperaturaCelsius").value = "";
}

document.getElementById("convertirTemperatura").addEventListener("click", convertirTemperatura);

const botonBorrarHistorial = document.getElementById("borrarHistorial");
if (botonBorrarHistorial) {
    botonBorrarHistorial.addEventListener("click", borrarHistorial);
}

// Geolocalización
document.addEventListener("DOMContentLoaded", () => {
    mostrarHistorial();

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const apiKey = 'e15504fb263a3c127aa7bc00f41391f9';

            try {
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`;
                const response = await fetch(url);
                const data = await response.json();

                document.getElementById("ciudad").value = data.name;

                mostrarClimaActualYPronostico(false);

            } catch (error) {
                console.error("Error al obtener clima por geolocalización", error);
            }
        }, () => {
            console.warn("El usuario denegó la geolocalización.");
        });
    } else {
        console.warn("Geolocalización no soportada.");
    }
});
