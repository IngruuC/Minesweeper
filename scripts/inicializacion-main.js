'use strict';

// Variables globales del juego
var tablero = [];
var tableroVisible = [];
var filas = 8;
var columnas = 8;
var totalMinas = 10;
var minasRestantes = 10;
var juegoTerminado = false;
var juegoIniciado = false;
var tiempoInicio = 0;
var temporizador = null;
var nombreJugador = '';
var modoOscuro = false;
var btnControlSonido = document.getElementById('btn-control-sonido');

// Configuraciones de dificultad
var dificultades = {
    facil: { filas: 8, columnas: 8, minas: 10 },
    medio: { filas: 12, columnas: 12, minas: 25 },
    dificil: { filas: 16, columnas: 16, minas: 40 }
};


// Elementos del DOM - Juego
var modalNombre = document.getElementById('modal-nombre');
var inputNombre = document.getElementById('input-nombre');
var btnComenzar = document.getElementById('btn-comenzar');
var errorNombre = document.getElementById('error-nombre');
var tableroElement = document.getElementById('tablero');
var contadorMinas = document.getElementById('contador-minas');
var tiempoJuego = document.getElementById('tiempo-juego');
var btnReiniciar = document.getElementById('btn-reiniciar');
var selectDificultad = document.getElementById('select-dificultad');

// Elementos del DOM - Modales
var modalFinJuego = document.getElementById('modal-fin-juego');
var tituloFinJuego = document.getElementById('titulo-fin-juego');
var mensajeFinJuego = document.getElementById('mensaje-fin-juego');
var btnNuevaPartida = document.getElementById('btn-nueva-partida');
var btnVerRanking = document.getElementById('btn-ver-ranking');
var btnVerRankingJuego = document.getElementById('btn-ver-ranking-juego');

// Elementos del DOM - Ranking
var modalRanking = document.getElementById('modal-ranking');
var listaRanking = document.getElementById('lista-ranking');
var btnCerrarRanking = document.getElementById('btn-cerrar-ranking');
var btnOrdenarPuntaje = document.getElementById('btn-ordenar-puntaje');
var btnOrdenarFecha = document.getElementById('btn-ordenar-fecha');

// Elementos del DOM - UI
var btnModoOscuro = document.getElementById('btn-modo-oscuro');

// Inicialización principal
document.addEventListener('DOMContentLoaded', function() {
    cargarModoOscuro();
    configurarEventosGlobales();
    configurarEventosJuego();
    inicializarSistemaAudio();
    actualizarBotonSonido();
});

// Configuración de eventos globales (disponibles en todas las páginas)
function configurarEventosGlobales() {
    var btnModoOscuro = document.getElementById('btn-modo-oscuro');
    var btnControlSonido = document.getElementById('btn-control-sonido');
    
    if (btnModoOscuro) {
        btnModoOscuro.addEventListener('click', alternarModoOscuro);
    }
    
    if (btnControlSonido) {
        btnControlSonido.addEventListener('click', alternarControlSonido);
    }
}

// Configuración de eventos específicos del juego
function configurarEventosJuego() {
    // Solo configurar si estamos en la página del juego (verificar si existe el tablero)
    if (!document.getElementById('tablero')) {
        return;
    }

    configurarEventos();
    mostrarModalNombre();
}

// Configuración de todos los eventos del juego
function configurarEventos() {
    // Eventos del juego
    btnComenzar.addEventListener('click', iniciarJuego);
    btnReiniciar.addEventListener('click', reiniciarJuego);
    btnNuevaPartida.addEventListener('click', nuevaPartida);
    selectDificultad.addEventListener('change', cambiarDificultad);
    
    // Eventos de ranking
    btnVerRanking.addEventListener('click', mostrarRanking);
    if (btnVerRankingJuego) {
        btnVerRankingJuego.addEventListener('click', mostrarRanking);
    }
    btnCerrarRanking.addEventListener('click', cerrarRanking);
    btnOrdenarPuntaje.addEventListener('click', function() { ordenarRanking('puntaje'); });
    btnOrdenarFecha.addEventListener('click', function() { ordenarRanking('fecha'); });

    // Eventos de teclado
    inputNombre.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            iniciarJuego();
        }
    });
    
    // Limpiar error cuando el usuario empieza a escribir
inputNombre.addEventListener('input', function() {
    if (errorNombre.textContent) {
        errorNombre.textContent = '';
    }
});

// También limpiar error al hacer focus en el campo
inputNombre.addEventListener('focus', function() {
    if (errorNombre.textContent) {
        errorNombre.textContent = '';
    }
});
}
// Funciones de modo oscuro
function alternarModoOscuro() {
    modoOscuro = !modoOscuro;
    document.body.classList.toggle('modo-oscuro', modoOscuro);
    btnModoOscuro.textContent = modoOscuro ? '☀️' : '🌙';
    localStorage.setItem('minesweeper-modo-oscuro', modoOscuro);
}

function cargarModoOscuro() {
    var modoGuardado = localStorage.getItem('minesweeper-modo-oscuro');
    if (modoGuardado === 'true') {
        modoOscuro = true;
        document.body.classList.add('modo-oscuro');
        btnModoOscuro.textContent = '☀️';
    }
}
// Funciones de validación
function validarNombre(nombre) {
    if (nombre.length < 3) {
        return 'El nombre debe tener al menos 3 caracteres';
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
        return 'El nombre solo puede contener letras y espacios';
    }
    return '';
}

function validarConfiguracion() {
    var totalCeldas = filas * columnas;
    if (totalMinas >= totalCeldas) {
        alert('Error: No se pueden colocar ' + totalMinas + ' minas en un tablero de ' + 
              totalCeldas + ' celdas.');
        return false;
    }
    return true;
}
// Funciones de UI
function mostrarModalNombre() {
    if (modalNombre) {
        modalNombre.classList.remove('oculto');
        inputNombre.focus();
    }
}

function actualizarTiempo(segundos) {
    if (tiempoJuego) {
        tiempoJuego.textContent = segundos.toString().padStart(3, '0');
    }
}

function actualizarContadorMinas() {
    if (contadorMinas) {
        contadorMinas.textContent = minasRestantes;
    }
}

//Funciones del sistema de audio
function alternarControlSonido() {
    var sonidosHabilitados = alternarSonidos();
    actualizarBotonSonido();
    
    // Reproducir sonido de prueba si se habilitaron
    if (sonidosHabilitados) {
        setTimeout(function() {
            reproducirSonidoClick();
        }, 100);
    }
}

function actualizarBotonSonido() {
    if (btnControlSonido) {
        var estado = obtenerEstadoSonidos();
        btnControlSonido.textContent = estado.habilitados ? '🔊' : '🔇';
        btnControlSonido.title = estado.habilitados ? 'Desactivar sonidos' : 'Activar sonidos';
    }
}