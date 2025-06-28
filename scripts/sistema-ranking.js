'use strict';

// Funciones del sistema de ranking y localStorage
function guardarPartida(tiempo, puntaje) {
    var partida = {
        nombre: nombreJugador,
        puntaje: puntaje,
        tiempo: tiempo,
        fecha: new Date().toISOString(),
        dificultad: selectDificultad.value
    };
    
    var partidas = obtenerPartidas();
    partidas.push(partida);
    localStorage.setItem('minesweeper-partidas', JSON.stringify(partidas));
}

function obtenerPartidas() {
    var partidasJson = localStorage.getItem('minesweeper-partidas');
    return partidasJson ? JSON.parse(partidasJson) : [];
}

function mostrarRanking() {
    var partidas = obtenerPartidas();
    partidas.sort(function(a, b) { return b.puntaje - a.puntaje; });
    
    listaRanking.innerHTML = '';
    
    if (partidas.length === 0) {
        listaRanking.innerHTML = '<p>No hay partidas registradas aún.</p>';
    } else {
        partidas.forEach(function(partida, index) {
            var entrada = crearEntradaRanking(partida, index + 1);
            listaRanking.appendChild(entrada);
        });
    }
    
    actualizarBotonesOrdenamiento('puntaje');
    modalRanking.classList.remove('oculto');
}

function crearEntradaRanking(partida, posicion) {
    var entrada = document.createElement('div');
    entrada.className = 'entrada-ranking';
    
    var fecha = new Date(partida.fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    var tiempo = partida.tiempo + 's';
    var dificultadTexto = obtenerTextoDificultad(partida.dificultad);
    
    entrada.innerHTML = 
        '<div class="ranking-jugador">' +
            '<strong>' + posicion + '. ' + partida.nombre + '</strong>' +
        '</div>' +
        '<div class="ranking-stats">' +
            '<span class="stat-puntaje">Puntaje: ' + partida.puntaje + '</span>' +
            '<span class="stat-tiempo">Tiempo: ' + tiempo + '</span>' +
            '<span class="stat-fecha">Fecha: ' + fecha + '</span>' +
            '<span class="stat-dificultad">Dificultad: ' + dificultadTexto + '</span>' +
        '</div>';
    
    return entrada;
}

function obtenerTextoDificultad(dificultad) {
    var textos = {
        'facil': 'Fácil',
        'medio': 'Medio',
        'dificil': 'Difícil'
    };
    return textos[dificultad] || dificultad;
}

function ordenarRanking(criterio) {
    var partidas = obtenerPartidas();
    
    if (criterio === 'puntaje') {
        partidas.sort(function(a, b) { return b.puntaje - a.puntaje; });
    } else if (criterio === 'fecha') {
        partidas.sort(function(a, b) { return new Date(b.fecha) - new Date(a.fecha); });
    }
    
    actualizarListaRanking(partidas);
    actualizarBotonesOrdenamiento(criterio);
}

function actualizarListaRanking(partidas) {
    listaRanking.innerHTML = '';
    
    if (partidas.length === 0) {
        listaRanking.innerHTML = '<p>No hay partidas registradas aún.</p>';
        return;
    }
    
    partidas.forEach(function(partida, index) {
        var entrada = crearEntradaRanking(partida, index + 1);
        listaRanking.appendChild(entrada);
    });
}

function actualizarBotonesOrdenamiento(criterioActivo) {
    // Remover clase activa de todos los botones
    btnOrdenarPuntaje.classList.remove('activo');
    btnOrdenarFecha.classList.remove('activo');
    
    // Agregar clase activa al botón correspondiente
    if (criterioActivo === 'puntaje') {
        btnOrdenarPuntaje.classList.add('activo');
    } else if (criterioActivo === 'fecha') {
        btnOrdenarFecha.classList.add('activo');
    }
}

function cerrarRanking() {
    modalRanking.classList.add('oculto');
}

function limpiarRanking() {
    if (confirm('¿Estás seguro de que quieres eliminar todos los registros del ranking?')) {
        localStorage.removeItem('minesweeper-partidas');
        mostrarRanking();
    }
}

function exportarRanking() {
    var partidas = obtenerPartidas();
    if (partidas.length === 0) {
        alert('No hay partidas para exportar.');
        return;
    }
    
    var csv = 'Nombre,Puntaje,Tiempo,Fecha,Dificultad\n';
    partidas.forEach(function(partida) {
        var fecha = new Date(partida.fecha).toLocaleDateString();
        csv += partida.nombre + ',' + 
               partida.puntaje + ',' + 
               partida.tiempo + ',' + 
               fecha + ',' + 
               partida.dificultad + '\n';
    });
    
    var blob = new Blob([csv], { type: 'text/csv' });
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'minesweeper-ranking.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}
// Funciones de estadísticas
function obtenerEstadisticas() {
    var partidas = obtenerPartidas();
    if (partidas.length === 0) {
        return null;
    }
    
    var estadisticas = {
        totalPartidas: partidas.length,
        mejorPuntaje: Math.max.apply(Math, partidas.map(function(p) { return p.puntaje; })),
        peorPuntaje: Math.min.apply(Math, partidas.map(function(p) { return p.puntaje; })),
        tiempoPromedio: 0,
        mejorTiempo: Math.min.apply(Math, partidas.map(function(p) { return p.tiempo; })),
        peorTiempo: Math.max.apply(Math, partidas.map(function(p) { return p.tiempo; })),
       partidasPorDificultad: {
           facil: 0,
           medio: 0,
           dificil: 0
       }
   };
   // Calcular tiempo promedio
   var tiempoTotal = partidas.reduce(function(suma, partida) {
       return suma + partida.tiempo;
   }, 0);
   estadisticas.tiempoPromedio = Math.round(tiempoTotal / partidas.length);
   
   // Contar partidas por dificultad
   partidas.forEach(function(partida) {
       if (estadisticas.partidasPorDificultad.hasOwnProperty(partida.dificultad)) {
           estadisticas.partidasPorDificultad[partida.dificultad]++;
       }
   });
   
   return estadisticas;
}
function mostrarEstadisticas() {
   var stats = obtenerEstadisticas();
   if (!stats) {
       alert('No hay partidas registradas para mostrar estadísticas.');
       return;
   }
   
   var mensaje = 'ESTADÍSTICAS DEL JUGADOR\n\n' +
                 'Total de partidas: ' + stats.totalPartidas + '\n' +
                 'Mejor puntaje: ' + stats.mejorPuntaje + '\n' +
                 'Peor puntaje: ' + stats.peorPuntaje + '\n' +
                 'Tiempo promedio: ' + stats.tiempoPromedio + 's\n' +
                 'Mejor tiempo: ' + stats.mejorTiempo + 's\n' +
                 'Peor tiempo: ' + stats.peorTiempo + 's\n\n' +
                 'PARTIDAS POR DIFICULTAD:\n' +
                 'Fácil: ' + stats.partidasPorDificultad.facil + '\n' +
                 'Medio: ' + stats.partidasPorDificultad.medio + '\n' +
                 'Difícil: ' + stats.partidasPorDificultad.dificil;
   
   alert(mensaje);
}