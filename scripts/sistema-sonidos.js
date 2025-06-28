'use strict';

// Sistema de sonidos del Minesweeper
var sistemaAudio = {
    contexto: null,
    volumen: 0.3,
    sonidosHabilitados: true,
    
    // Inicializar el contexto de audio
    inicializar: function() {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.contexto = new AudioContext();
            this.cargarPreferencias();
            return true;
        } catch (error) {
            console.warn('Web Audio API no soportada:', error);
            this.sonidosHabilitados = false;
            return false;
        }
    },
     // Cargar preferencias de sonido desde localStorage
    cargarPreferencias: function() {
        var volumenGuardado = localStorage.getItem('minesweeper-volumen');
        var sonidosGuardados = localStorage.getItem('minesweeper-sonidos');
        
        if (volumenGuardado !== null) {
            this.volumen = parseFloat(volumenGuardado);
        }
        
        if (sonidosGuardados !== null) {
            this.sonidosHabilitados = sonidosGuardados === 'true';
        }
    },
    
    // Guardar preferencias en localStorage
    guardarPreferencias: function() {
        localStorage.setItem('minesweeper-volumen', this.volumen.toString());
        localStorage.setItem('minesweeper-sonidos', this.sonidosHabilitados.toString());
    },
    
    // Crear un oscilador básico
    crearOscilador: function(frecuencia, tipo, duracion) {
        if (!this.contexto || !this.sonidosHabilitados) return null;
        
        var oscilador = this.contexto.createOscillator();
        var ganancia = this.contexto.createGain();
        
        oscilador.connect(ganancia);
        ganancia.connect(this.contexto.destination);
        
        oscilador.frequency.value = frecuencia;
        oscilador.type = tipo || 'sine';
        
        ganancia.gain.setValueAtTime(0, this.contexto.currentTime);
        ganancia.gain.linearRampToValueAtTime(this.volumen, this.contexto.currentTime + 0.01);
        ganancia.gain.exponentialRampToValueAtTime(0.001, this.contexto.currentTime + duracion);
        
        return { oscilador: oscilador, ganancia: ganancia };
    },
    
    // Sonido al hacer click en una celda
    reproducirClick: function() {
        if (!this.sonidosHabilitados) return;
        
        var sonido = this.crearOscilador(800, 'square', 0.1);
        if (sonido) {
            sonido.oscilador.start();
            sonido.oscilador.stop(this.contexto.currentTime + 0.1);
        }
    },
    
    // Sonido al colocar/quitar bandera
    reproducirBandera: function() {
        if (!this.sonidosHabilitados) return;
        
        var sonido1 = this.crearOscilador(600, 'triangle', 0.15);
        var sonido2 = this.crearOscilador(900, 'triangle', 0.15);
        
        if (sonido1 && sonido2) {
            sonido1.oscilador.start();
            sonido2.oscilador.start(this.contexto.currentTime + 0.05);
            
            sonido1.oscilador.stop(this.contexto.currentTime + 0.15);
            sonido2.oscilador.stop(this.contexto.currentTime + 0.2);
        }
    },
    
    // Sonido al revelar un número
    reproducirReveal: function(numero) {
        if (!this.sonidosHabilitados) return;
        
        var frecuencias = [200, 250, 300, 350, 400, 450, 500, 550];
        var frecuencia = frecuencias[numero - 1] || 200;
        
        var sonido = this.crearOscilador(frecuencia, 'sine', 0.2);
        if (sonido) {
            sonido.oscilador.start();
            sonido.oscilador.stop(this.contexto.currentTime + 0.2);
        }
    },
    
    // Sonido de explosión (perder)
    reproducirExplosion: function() {
        if (!this.sonidosHabilitados) return;
        
        // Sonido de explosión con ruido blanco
        var duracion = 1.0;
        var buffer = this.contexto.createBuffer(1, this.contexto.sampleRate * duracion, this.contexto.sampleRate);
        var data = buffer.getChannelData(0);
        
        // Generar ruido blanco que se desvanece
        for (var i = 0; i < buffer.length; i++) {
            var decay = 1 - (i / buffer.length);
            data[i] = (Math.random() * 2 - 1) * decay * 0.3;
        }
        var fuente = this.contexto.createBufferSource();
        var ganancia = this.contexto.createGain();
        var filtro = this.contexto.createBiquadFilter();
        
        fuente.buffer = buffer;
        fuente.connect(filtro);
        filtro.connect(ganancia);
        ganancia.connect(this.contexto.destination);
        
        filtro.type = 'lowpass';
        filtro.frequency.setValueAtTime(1000, this.contexto.currentTime);
        filtro.frequency.exponentialRampToValueAtTime(100, this.contexto.currentTime + duracion);
        
        ganancia.gain.setValueAtTime(this.volumen, this.contexto.currentTime);
        ganancia.gain.exponentialRampToValueAtTime(0.001, this.contexto.currentTime + duracion);
        
        fuente.start();
        fuente.stop(this.contexto.currentTime + duracion);
    },
    
    // Sonido de victoria
    reproducirVictoria: function() {
        if (!this.sonidosHabilitados) return;
        
        // Melodía de victoria: Do-Mi-Sol-Do
        var notas = [
            { frecuencia: 261.63, tiempo: 0.0, duracion: 0.3 },    // Do
            { frecuencia: 329.63, tiempo: 0.3, duracion: 0.3 },    // Mi
            { frecuencia: 392.00, tiempo: 0.6, duracion: 0.3 },    // Sol
            { frecuencia: 523.25, tiempo: 0.9, duracion: 0.6 }     // Do (octava alta)
        ];
        
        var self = this;
        notas.forEach(function(nota) {
            setTimeout(function() {
                var sonido = self.crearOscilador(nota.frecuencia, 'triangle', nota.duracion);
                if (sonido) {
                    sonido.oscilador.start();
                    sonido.oscilador.stop(self.contexto.currentTime + nota.duracion);
                }
            }, nota.tiempo * 1000);
        });
    },
    
    // Sonido de barrido (expansión automática)
    reproducirBarrido: function() {
        if (!this.sonidosHabilitados) return;
        
        var sonido = this.crearOscilador(400, 'sawtooth', 0.3);
        if (sonido) {
            sonido.oscilador.frequency.setValueAtTime(400, this.contexto.currentTime);
            sonido.oscilador.frequency.linearRampToValueAtTime(600, this.contexto.currentTime + 0.3);
            
            sonido.oscilador.start();
            sonido.oscilador.stop(this.contexto.currentTime + 0.3);
        }
    },
    
    // Sonido del temporizador (cada segundo)
    reproducirTick: function() {
        if (!this.sonidosHabilitados) return;
        
        var sonido = this.crearOscilador(1000, 'square', 0.05);
        if (sonido) {
            sonido.ganancia.gain.setValueAtTime(this.volumen * 0.1, this.contexto.currentTime);
            sonido.oscilador.start();
            sonido.oscilador.stop(this.contexto.currentTime + 0.05);
        }
    },
    
    // Alternar sonidos on/off
    alternarSonidos: function() {
        this.sonidosHabilitados = !this.sonidosHabilitados;
        this.guardarPreferencias();
        return this.sonidosHabilitados;
    },
    
    // Cambiar volumen (0.0 - 1.0)
    cambiarVolumen: function(nuevoVolumen) {
        this.volumen = Math.max(0, Math.min(1, nuevoVolumen));
        this.guardarPreferencias();
    },
    
    // Reproducir sonido de prueba
    reproducirPrueba: function() {
        this.reproducirClick();
        setTimeout(function() {
            sistemaAudio.reproducirBandera();
        }, 200);
    }
};
// Funciones de integración con el juego
function inicializarSistemaAudio() {
    sistemaAudio.inicializar();
}

function reproducirSonidoClick() {
    sistemaAudio.reproducirClick();
}

function reproducirSonidoBandera() {
    sistemaAudio.reproducirBandera();
}

function reproducirSonidoReveal(numero) {
    sistemaAudio.reproducirReveal(numero);
}

function reproducirSonidoExplosion() {
    sistemaAudio.reproducirExplosion();
}

function reproducirSonidoVictoria() {
    sistemaAudio.reproducirVictoria();
}

function reproducirSonidoBarrido() {
    sistemaAudio.reproducirBarrido();
}

function reproducirSonidoTick() {
    sistemaAudio.reproducirTick();
}