const SerialPort = require("serialport").SerialPort; // Importa SerialPort desde el paquete
const { ReadlineParser } = require("@serialport/parser-readline"); // Importa ReadlineParser
const axios = require("axios"); // Importa axios para manejar solicitudes HTTP

// Configura el puerto Serial (reemplaza "COM7" con el puerto de tu Arduino)
const port = new SerialPort({
    path: "COM7", // Cambia al puerto que usa tu Arduino
    baudRate: 9600, // Velocidad de transmisión
});
const parser = port.pipe(new ReadlineParser({ delimiter: "\n" })); // Configura el parser

// URL del endpoint
const apiUrl = "https://backendhackathon202520250328210710.azurewebsites.net/api/v1/medibles";

// Escucha los datos enviados por el Arduino
parser.on("data", async (line) => {
    console.log("Datos recibidos:", line);

    try {
        // Convierte el JSON recibido del Arduino en un objeto
        const datosRecibidos = JSON.parse(line);

        // Estructura el cuerpo de la solicitud basado en los datos del Arduino
        const datosParaEnviar = {
            userId: "d6592e9d-a0c5-42d8-9789-6c6580dd1314",
            temperatura: datosRecibidos.temperatura || 0,
            cantidadDeMovimiento: datosRecibidos.movimiento || 0,
            frecuenciaDeRuido: datosRecibidos.sonido || 0,
            luz: datosRecibidos.luz || 0,
        };

        console.log("Intentando enviar datos:", datosParaEnviar);

        const response = await axios.post(apiUrl, datosParaEnviar, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log("Datos enviados exitosamente:", response.data);
    } catch (error) {
        console.error("Error detallado:");
        if (error.response) {
            // Error de respuesta del servidor
            console.error("Error del servidor:", error.response.status);
            console.error("Datos del error:", error.response.data);
        } else if (error.request) {
            // Error de conexión
            console.error("Error de conexión:", error.message);
        } else {
            // Error en la configuración de la solicitud
            console.error("Error de configuración:", error.message);
        }
    }
});

console.log("Esperando datos del Arduino...");
