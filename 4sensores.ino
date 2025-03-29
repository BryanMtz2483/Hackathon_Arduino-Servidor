#include <DHT.h>

#define DHTPIN A1       // Pin donde se conecta el sensor DHT11
#define DHTTYPE DHT11   // Tipo de sensor DHT
DHT dht(DHTPIN, DHTTYPE);

int cont = 0;  
volatile bool movimiento = false; // Se activará cuando el botón en pin 2 se presione
volatile bool sonido = false;     // Se activará cuando el botón en pin 3 se presione

unsigned long lastTime = 0;  
const unsigned long interval = 100000;  

void detectarMovimiento() {  
    movimiento = true;  
    lastTime = millis();  
}

void detectarSonido() {  
    sonido = true;  
    lastTime = millis();  
}

void setup() {
    Serial.begin(9600);
    dht.begin();  // Iniciar el sensor DHT11
    
    pinMode(2, INPUT);  
    pinMode(3, INPUT);  
    pinMode(A0, INPUT); // Fotoresistencia conectada a A0

    attachInterrupt(digitalPinToInterrupt(2), detectarMovimiento, RISING);
    attachInterrupt(digitalPinToInterrupt(3), detectarSonido, RISING);
}

void loop() {
    if (millis() - lastTime >= interval) {
        lastTime = millis();  

        int luz = analogRead(A0) / 4; // Convertir a un rango de 0-255
        float temperatura = dht.readTemperature(); // Leer temperatura en °C

        // Verifica si la lectura del sensor es válida
        if (isnan(temperatura)) {
            temperatura = 0; // Asigna un valor predeterminado (puedes cambiarlo)
        }

        Serial.print("{\"temperatura\":");
        Serial.print(temperatura);
        Serial.print(",\"movimiento\":");
        Serial.print(movimiento ? "1" : "0");
        Serial.print(",\"sonido\":");
        Serial.print(sonido ? "1" : "0");
        Serial.print(",\"luz\":");
        Serial.print(luz);
        Serial.println("}");

        // Reiniciar variables después de enviar los datos
        movimiento = false;
        sonido = false;
    }
}

