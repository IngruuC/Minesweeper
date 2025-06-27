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
