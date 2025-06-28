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
// Validaciones individuales de campos
function validarCampoNombreContacto() {
    var nombre = nombreContacto.value.trim();
    var esValido = true;
    
    if (nombre.length === 0) {
        mostrarError(errorNombreContacto, 'El nombre es obligatorio');
        esValido = false;
    } else if (!validarNombreContacto(nombre)) {
        mostrarError(errorNombreContacto, 'El nombre debe ser alfanumérico');
        esValido = false;
    } else {
        limpiarError(errorNombreContacto);
    }
    
    return esValido;
}

function validarCampoEmailContacto() {
    var email = emailContacto.value.trim();
    var esValido = true;
    
    if (email.length === 0) {
        mostrarError(errorEmailContacto, 'El email es obligatorio');
        esValido = false;
    } else if (!validarEmail(email)) {
        mostrarError(errorEmailContacto, 'Ingresa un email válido');
        esValido = false;
    } else {
        limpiarError(errorEmailContacto);
    }
    
    return esValido;
}

function validarCampoMensajeContacto() {
    var mensaje = mensajeContacto.value.trim();
    var esValido = true;
    
    if (mensaje.length === 0) {
        mostrarError(errorMensajeContacto, 'El mensaje es obligatorio');
        esValido = false;
    } else if (!validarMensaje(mensaje)) {
        mostrarError(errorMensajeContacto, 'El mensaje debe tener más de 5 caracteres');
        esValido = false;
    } else {
        limpiarError(errorMensajeContacto);
    }
    
    return esValido;
}
// Funciones auxiliares para mostrar errores
function mostrarError(elemento, mensaje) {
    if (elemento) {
        elemento.textContent = mensaje;
        elemento.style.display = 'block';
    }
}

function limpiarError(elemento) {
    if (elemento) {
        elemento.textContent = '';
        elemento.style.display = 'none';
    }
}

function limpiarTodosLosErrores() {
    limpiarError(errorNombreContacto);
    limpiarError(errorEmailContacto);
    limpiarError(errorMensajeContacto);
}
// Función principal del formulario
function enviarFormularioContacto(e) {
    e.preventDefault();
    
    var nombre = nombreContacto.value.trim();
    var email = emailContacto.value.trim();
    var mensaje = mensajeContacto.value.trim();
    
    // Validar todos los campos
    var nombreValido = validarCampoNombreContacto();
    var emailValido = validarCampoEmailContacto();
    var mensajeValido = validarCampoMensajeContacto();
    
    // Si todos los campos son válidos, proceder con el envío
    if (nombreValido && emailValido && mensajeValido) {
        procesarEnvioFormulario(nombre, email, mensaje);
    } else {
        // Hacer scroll al primer error
        var primerError = document.querySelector('.error-mensaje:not(:empty)');
        if (primerError) {
            primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

function procesarEnvioFormulario(nombre, email, mensaje) {
    // Crear el enlace mailto
    var asunto = 'Contacto desde Minesweeper - ' + nombre;
    var cuerpoMensaje = 'Nombre: ' + nombre + '\n' +
                       'Email: ' + email + '\n\n' +
                       'Mensaje:\n' + mensaje + '\n\n' +
                       '---\n' +
                       'Enviado desde el juego Minesweeper';
    
    var mailtoLink = 'mailto:?subject=' + encodeURIComponent(asunto) + 
                    '&body=' + encodeURIComponent(cuerpoMensaje);
    
    // Abrir cliente de correo
    window.open(mailtoLink);
    
    // Mostrar mensaje de confirmación
    mostrarMensajeExito();
    
    // Limpiar formulario
    limpiarFormulario();
}