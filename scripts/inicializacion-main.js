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