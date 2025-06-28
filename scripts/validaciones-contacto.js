'use strict';

// Variables del formulario de contacto
var formularioContacto = document.getElementById('formulario-contacto');
var nombreContacto = document.getElementById('nombre-contacto');
var emailContacto = document.getElementById('email-contacto');
var mensajeContacto = document.getElementById('mensaje-contacto');
var errorNombreContacto = document.getElementById('error-nombre-contacto');
var errorEmailContacto = document.getElementById('error-email-contacto');
var errorMensajeContacto = document.getElementById('error-mensaje-contacto');

// Inicialización del formulario de contacto
document.addEventListener('DOMContentLoaded', function() {
    if (formularioContacto) {
        configurarEventosContacto();
    }
});

function configurarEventosContacto() {
    formularioContacto.addEventListener('submit', enviarFormularioContacto);
    
    // Validación en tiempo real
    nombreContacto.addEventListener('blur', function() {
        validarCampoNombreContacto();
    });
    
    emailContacto.addEventListener('blur', function() {
        validarCampoEmailContacto();
    });
    
    mensajeContacto.addEventListener('blur', function() {
        validarCampoMensajeContacto();
    });
    // Limpiar errores al escribir
    nombreContacto.addEventListener('input', function() {
        if (errorNombreContacto.textContent) {
            errorNombreContacto.textContent = '';
        }
    });
    
    emailContacto.addEventListener('input', function() {
        if (errorEmailContacto.textContent) {
            errorEmailContacto.textContent = '';
        }
    });
    
    mensajeContacto.addEventListener('input', function() {
        if (errorMensajeContacto.textContent) {
            errorMensajeContacto.textContent = '';
        }
    });
}
// Funciones de validación
function validarNombreContacto(nombre) {
    var regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/;
    return regex.test(nombre) && nombre.trim().length > 0;
}

function validarEmail(email) {
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validarMensaje(mensaje) {
    return mensaje.trim().length > 5;
}