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
function contarMinasVecinas(fila, columna) {
    var contador = 0;
    
    for (var i = fila - 1; i <= fila + 1; i++) {
        for (var j = columna - 1; j <= columna + 1; j++) {
            if (i >= 0 && i < filas && j >= 0 && j < columnas) {
                if (tablero[i][j].esMina) {
                    contador++;
                }
            }
        }
    }
    
    return contador;
}

function generarTableroHTML() {
    tableroElement.innerHTML = '';
    tableroElement.className = 'tablero tamano-' + filas;
    
    for (var i = 0; i < filas; i++) {
        for (var j = 0; j < columnas; j++) {
            var celda = document.createElement('div');
            celda.className = 'celda';
            celda.dataset.fila = i;
            celda.dataset.columna = j;
            
            celda.addEventListener('click', function(e) {
                var fila = parseInt(e.target.dataset.fila);
                var columna = parseInt(e.target.dataset.columna);
                manejarClickIzquierdo(fila, columna);
            });
            
            celda.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                var fila = parseInt(e.target.dataset.fila);
                var columna = parseInt(e.target.dataset.columna);
                manejarClickDerecho(fila, columna);
            });
            
            tableroElement.appendChild(celda);
        }
    }
    // Implementar chording después de crear el tablero
    implementarChording();
}
function manejarClickIzquierdo(fila, columna) {
    if (juegoTerminado) return;
    if (tableroVisible[fila][columna].tieneBandera) return;
    if (tableroVisible[fila][columna].revelada) return;
    
    if (!juegoIniciado) {
        juegoIniciado = true;
        generarMinas(fila, columna);
        iniciarTemporizador();
    }
    
    revelarCelda(fila, columna);
}

function manejarClickDerecho(fila, columna) {
    if (juegoTerminado) return;
    if (tableroVisible[fila][columna].revelada) return;
    
    alternarBandera(fila, columna);
}
function revelarCelda(fila, columna) {
    if (tableroVisible[fila][columna].revelada) return;
    if (tableroVisible[fila][columna].tieneBandera) return;
    
    tableroVisible[fila][columna].revelada = true;
    
    var celda = obtenerElementoCelda(fila, columna);
    celda.classList.add('revelada');
    
    if (tablero[fila][columna].esMina) {
        perderJuego();
        return;
    }
    
    var minasVecinas = tablero[fila][columna].minasVecinas;
    if (minasVecinas > 0) {
        celda.textContent = minasVecinas;
        celda.classList.add('numero-' + minasVecinas);
    } else {
        // Expansión automática recursiva
        for (var i = fila - 1; i <= fila + 1; i++) {
            for (var j = columna - 1; j <= columna + 1; j++) {
                if (i >= 0 && i < filas && j >= 0 && j < columnas) {
                    if (!tableroVisible[i][j].revelada) {
                        revelarCelda(i, j);
                    }
                }
            }
        }
    }
    
    verificarVictoria();
}
function alternarBandera(fila, columna) {
    var celda = tableroVisible[fila][columna];
    var elementoCelda = obtenerElementoCelda(fila, columna);
    
    if (celda.tieneBandera) {
        celda.tieneBandera = false;
        elementoCelda.classList.remove('bandera');
        minasRestantes++;
    } else {
        celda.tieneBandera = true;
        elementoCelda.classList.add('bandera');
        minasRestantes--;
    }
    
    actualizarContadorMinas();
}

function obtenerElementoCelda(fila, columna) {
    return document.querySelector('[data-fila="' + fila + '"][data-columna="' + columna + '"]');
}
function perderJuego() {
    juegoTerminado = true;
    btnReiniciar.textContent = '😵';
    
    if (temporizador) {
        clearInterval(temporizador);
    }
    
    // Revelar todas las minas
    for (var i = 0; i < filas; i++) {
        for (var j = 0; j < columnas; j++) {
            if (tablero[i][j].esMina) {
                var celda = obtenerElementoCelda(i, j);
                celda.classList.add('mina');
                celda.textContent = '💣';
            }
        }
    }
    
    setTimeout(function() {
        mostrarModalFinJuego('¡Perdiste!', 'Encontraste una mina. ¡Inténtalo de nuevo!');
    }, 1000);
}
function verificarVictoria() {
    var celdasReveladas = 0;
    var totalCeldasSeguras = filas * columnas - totalMinas;
    
    for (var i = 0; i < filas; i++) {
        for (var j = 0; j < columnas; j++) {
            if (tableroVisible[i][j].revelada && !tablero[i][j].esMina) {
                celdasReveladas++;
            }
        }
    }
    
    if (celdasReveladas === totalCeldasSeguras) {
        ganarJuego();
    }
}

function ganarJuego() {
    juegoTerminado = true;
    btnReiniciar.textContent = '😎';
    
    if (temporizador) {
        clearInterval(temporizador);
    }
    
    var tiempoFinal = Math.floor((Date.now() - tiempoInicio) / 1000);
    var puntaje = calcularPuntaje(tiempoFinal);
    
    guardarPartida(tiempoFinal, puntaje);
    
    setTimeout(function() {
        mostrarModalFinJuego('¡Felicitaciones!', 
            '¡Ganaste la partida en ' + tiempoFinal + ' segundos! Puntaje: ' + puntaje);
    }, 500);
}
function calcularPuntaje(tiempo) {
    var basePuntos = totalMinas * 100;
    var bonusTiempo = Math.max(0, 300 - tiempo) * 10;
    var bonusDificultad = totalMinas * 5;
    return basePuntos + bonusTiempo + bonusDificultad;
}

function mostrarModalFinJuego(titulo, mensaje) {
    tituloFinJuego.textContent = titulo;
    mensajeFinJuego.textContent = mensaje;
    modalFinJuego.classList.remove('oculto');
}
function iniciarTemporizador() {
    tiempoInicio = Date.now();
    temporizador = setInterval(function() {
        var tiempoTranscurrido = Math.floor((Date.now() - tiempoInicio) / 1000);
        actualizarTiempo(tiempoTranscurrido);
    }, 1000);
}

function reiniciarJuego() {
    configurarTablero();
}

function nuevaPartida() {
    modalFinJuego.classList.add('oculto');
    mostrarModalNombre();
}