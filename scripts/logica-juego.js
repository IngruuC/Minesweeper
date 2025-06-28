'use strict';

// Funciones principales del juego
function iniciarJuego() {
    var nombre = inputNombre.value.trim();
    var error = validarNombre(nombre);
    
    if (error) {
        errorNombre.textContent = error;
        return;
    }

    nombreJugador = nombre;
    modalNombre.classList.add('oculto');
    configurarTablero();
}

function cambiarDificultad() {
    var dificultad = selectDificultad.value;
    var config = dificultades[dificultad];
    filas = config.filas;
    columnas = config.columnas;
    totalMinas = config.minas;
    
    if (!juegoIniciado) {
        configurarTablero();
    }
}

function configurarTablero() {
    if (!validarConfiguracion()) {
        return;
    }
    
    reiniciarEstadoJuego();
    crearTableroVacio();
    generarTableroHTML();
}

function reiniciarEstadoJuego() {
    juegoTerminado = false;
    juegoIniciado = false;
    minasRestantes = totalMinas;
    tiempoInicio = 0;
    
    if (temporizador) {
        clearInterval(temporizador);
        temporizador = null;
    }
    
    actualizarContadorMinas();
    actualizarTiempo(0);
    btnReiniciar.textContent = '😊';
}

function crearTableroVacio() {
    tablero = [];
    tableroVisible = [];
    
    for (var i = 0; i < filas; i++) {
        tablero[i] = [];
        tableroVisible[i] = [];
        for (var j = 0; j < columnas; j++) {
            tablero[i][j] = {
                esMina: false,
                minasVecinas: 0
            };
            tableroVisible[i][j] = {
                revelada: false,
                tieneBandera: false
            };
        }
    }
}
function generarMinas(filaInicial, columnaInicial) {
    var minasColocadas = 0;
    
    while (minasColocadas < totalMinas) {
        var fila = Math.floor(Math.random() * filas);
        var columna = Math.floor(Math.random() * columnas);
        
        if (!tablero[fila][columna].esMina && 
            !(fila === filaInicial && columna === columnaInicial)) {
            tablero[fila][columna].esMina = true;
            minasColocadas++;
        }
    }
    
    calcularMinasVecinas();
}

function calcularMinasVecinas() {
    for (var i = 0; i < filas; i++) {
        for (var j = 0; j < columnas; j++) {
            if (!tablero[i][j].esMina) {
                tablero[i][j].minasVecinas = contarMinasVecinas(i, j);
            }
        }
    }
}
