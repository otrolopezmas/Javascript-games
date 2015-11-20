var colores = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "grey"];
var jugada = [-1, -1, -1, -1]; // 
var numeroColores; //modo de juego
var circulos; //todos los circulos del juego
var circulitos; //todos los circulos pequeños del juego
var circuloActual; //fila en la que estamos
var solucion; //combinacion con la que resolver el juego

/**
 * Empieza el juego del mastermind haciendo lo siguiente:
 * 1. Guarda todos los circulos en la variable circulos
 * 2. Guarda todos los circulos pequeños en la variable circulitos
 * 3. Hace desaparecer los botones de modo de juego
 * 4. Genera una solución aleatoria.
 * 5. Marca la fila actual
 * 6. Activa los circulos correspondientes a la fila en la que nos encontramos
 * @param   {[[Type]]} numColores el modo de juego
 */
function iniciarJuego(numColores) {
    circulos = document.getElementsByClassName("circulo");
    circulitos = document.getElementsByClassName("circulito");
    desaparecerBotones();
    numeroColores = numColores;
    solucion = function () {
        var array = [];
        for (var i = 0; i < 4; i++) {
            array[i] = Math.round(Math.random() * (numeroColores - 1));
        }
        return array;
    }();
    circuloActual = circulos.length - 1;
    activarCirculos();

    if (document.getElementById("contrarreloj").checked) {
        iniciarReloj(3);
    }
    document.getElementById("cuadroModos").remove();

    anadirColoresPosibles(numColores);
}

/**
 * Hace desaparecer los botones de modo de juego.
 */
function desaparecerBotones() {
    var botones = document.getElementsByClassName("modos");
    botones[1].remove();
    botones[0].remove();
}

/**
 * Comprueba la combinacion marcada con la solucion
 */
function comprobar() {
    /*
     * Comprobaciones
     * 1. Los botones tienen color
     * 2. Combinación ganadora vs combinación escrita
     * 3. Desactivar fila actual ya activar fila nueva
     */
    if (comprobarBotonesVacios()) {
        var aciertos = comprobarSolucion();
        if (aciertos == 4) {
            alert("Has ganado");
            victoria();
        } else {
            cambiarFila();
        }
    } else {
        alert("Uno de los círculos no tiene color asignado.");
    }
}

/**
 * Comprueba si alguno de los circulos actuales
 * esta vacío
 * @returns {Boolean} devuelve false si algun circulo esta vacio.
 */
function comprobarBotonesVacios() {
    for (var i = 0; i < 4; i++) {
        if (jugada[i] == -1) return false;
    }
    return true;
}

/**
 * Comprueba la combinación marca para colorear los
 * circulos pequeños de la derecha
 * Color blanco = el color esta en la solución pero no en el hueco correcto
 * Color negro = el color esta en la solución y en el hueco correcto
 * @returns {Entero}  devuelve el número de aciertos de la combinación.
 */
function comprobarSolucion() {
    var aciertos = 0;
    for (var i = 3; i >= 0; i--) {
        if (jugada[i] === solucion[i]) {
            circulitos[circuloActual - i].style.backgroundColor = "black";
            aciertos++;
        } else {
            for (var j = 3; j >= 0; j--) {
                if (jugada[i] === solucion[j]) {
                    circulitos[circuloActual - i].style.backgroundColor = "white";
                }
            }
        }
    }
    return aciertos;
}

/**
 * Desactiva la fila actual y activa los circulos de la siguiente
 * También reinicia los valores de jugada.
 */
function cambiarFila() {
    desactivarCirculos();

    if (circuloActual === -1) {
        alert("Has perdido");
        finalizarJuego();
    }
    activarCirculos();
    jugada = [-1, -1, -1, -1];
}

/**
 * Desactiva la fila actual de circulos y modifica
 * la variable circuloActual para coincidir con la siguiente fila
 */
function desactivarCirculos() {
    for (var i = 0; i < 4; i++) {
        circulos[circuloActual - i].onclick = null;
    }
    circuloActual -= 4;
}

/**
 * Activa los circulos de la fila actual para poder 
 * elegir colores sobre ellos
 */
function activarCirculos() {
    for (var i = 3; i >= 0; i--) {
        circulos[circuloActual - i].onclick = function cambiarColor() {
            var pos = this.id
            jugada[pos] = (jugada[pos] == numeroColores - 1) ? 0 : ++jugada[pos];
            this.style.backgroundColor = colores[jugada[pos]];
        }
        circulos[circuloActual - i].id = i;
    }
}

/**
 * Desactiva el atributo onclick de todos los circulos
 */
function finalizarJuego() {
    for (var i = 0; i < 32; i++) {
        circulos[i].onclick = null;
    }
}

/**
 * Función que añade los colores con los que se puede jugar
 * a instrucciones
 */
function anadirColoresPosibles(numColores) {
    var ins = document.getElementById("coloresPosibles");

    for (var i = 0; i < numColores; i++) {
        var color = document.createElement("div");
        color.className = "circuloPosible";
        color.style.backgroundColor = colores[i];
        ins.appendChild(color);
    }
}