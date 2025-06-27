# Minesweeper
**Reglas**
El tablero está dividido en celdas, con minas distribuidas al azar. Para ganar, debes abrir
todas las celdas que no contienen minas. Al hacer clic en una celda que no tiene una mina,
se revela un número. Este número es la cantidad de celdas vecinas que contienen una
mina. Con esta información, puedes determinar las celdas que son seguras y las celdas que
contienen minas. Las celdas sospechosas de contener minas se pueden marcar con una
bandera usando el botón derecho del ratón.
Para comenzar una partida nueva, puedes hacer clic en la cara feliz que está en la parte
superior del tablero o usar la barra espaciadora. El número restante de minas se muestra en
la esquina izquierda y el cronómetro del juego se muestra en la esquina derecha.  
  
**Chording**
Cuando un número tiene la cantidad correcta de banderas, puedes hacer clic en él para
abrir todas las celdas que lo rodean. Esto se llama chording (acorde en inglés) porque en
versiones anteriores requería presionar dos botones, izquierdo + derecho, al mismo tiempo
(se puede cambiar en la configuración). El uso de los chords reduce en gran medida los
clics innecesarios y es la base de un juego eficiente

## Instrucciones de Uso
1. Abre `index.html` en tu navegador
2. Ingresa tu nombre (mínimo 3 caracteres)
3. Selecciona la dificultad deseada
4. ¡Juega y trata de encontrar todas las minas!

## Controles
- **Click izquierdo**: Revelar celda
- **Click derecho**: Colocar/quitar bandera
- **Barra espaciadora**: Reiniciar juego
- **Click izquierdo + derecho**: Chording (revelado automático)

## Niveles de Dificultad
- **Fácil**: 8x8 - 10 minas
- **Medio**: 12x12 - 25 minas
- **Difícil**: 16x16 - 40 minas

## Sistema de Puntuación
El puntaje se calcula basado en:
- Número de minas encontradas
- Tiempo de resolución
- Dificultad del nivel

## Nomenclatura
Este proyecto utiliza **kebab-case** 

## Desarrollado por
Carstens Ingrid, Rodriguez Diego - Universidad Abierta Interamericana (UAI)
Materia: Desarrollo y Arquitecturas Web 2025

## Enlaces
Github pages: https://ingruuc.github.io/Minesweeper/