var cartaUno; //Primera carta sobre la que se clicka
var cartaDos; // Segunda carta sobre la que se clicka
var aciertos = 0; //Número de parejas acertadas
var imgs = document.images;
var cartas; //Array con las imágenes para appendChild al juego
var intentos = 0;
/**
 * Función que da comienzo al juego. Hace lo siguiente:
 * 1. Añade las imágenes al div #tablero mediante appendChild (DOM)
 * 2. Oculta las imágenes (cambiando su src por el dorso de la carta) y
 * activa los atributos onclick para poder jugar
 */
function iniciarJuego(numeroParejas) {

    var tablero = document.getElementById("tablero");
    var long = numeroParejas * 2;

    cartas = function () {
        var array = [];
        for (var i = 0; i < numeroParejas; i++) {
            var carta = document.createElement("img");
            carta.name = i;
            carta.src = "../img/parejas/img/" + i + ".gif";
            array[i] = carta;
            array[i + numeroParejas] = carta.cloneNode(true);
        }
        /*
         * Desordenamos el array
         */
        return array = array.sort(function () {
            return Math.random() - 0.5;
        });
    }();

    for (var i = 0; i < long; i++) {
        tablero.appendChild(cartas[i]);
    }
    /*
     * Ocultamos las cartas tras 3 segundos y activamos
     * el atributo onclick para poder jugar
     */
    setTimeout(function () {
        for (var i = 0; i < long; i++) {
            imgCarta(imgs[i], false);
        }
        accionClick(true);
    }, "3000");

    /**
     * Activación del reloj, pasamos por parámetro
     * el número de minutos del contrarreloj dependiendo
     * del modo de dificultad elegido
     */
    if (document.getElementById("contrarreloj").checked) {
        if (numeroParejas === 15) {
            iniciarReloj(3);
        } else if (numeroParejas === 25) {
            iniciarReloj(5);
        } else {
            iniciarReloj(10);
        }
    }
    document.getElementById("cuadroModos").remove();
    document.getElementById("pintentos").style.visibility = "visible";

}

/**
 * Función llamada al hacer click en una carta
 * Si es la primera carta en la que se clicka se guardara en cartaUno sino en cartaDos
 * Una vez se han clickado en las dos cartas se comprueba si son iguales
 * . Si son iguales se suma un acierto y se desactivan las cartas quedandose boca arriba.
 * . Si son distintas al cabo de un segundo se les da la vuelta
 * @param {<img>} elemento carta en la que se ha clickado
 */
function jugar(elemento) {
    if (typeof cartaUno == "undefined") {
        cartaUno = elemento;
        imgCarta(cartaUno, true);
    } else {
        //Comprobamos que no se clicke dos veces en la misma carta
        if (elemento != cartaUno) {

            cartaDos = elemento;
            imgCarta(cartaDos, true);

            if (cartaUno.name !== cartaDos.name) {
                accionClick(false); //Desactivo los eventos onclick

                setTimeout(function () {
                    imgCarta(cartaUno, false);
                    imgCarta(cartaDos, false);
                    unsetCartas();
                    accionClick(true); //Vuelvo a activar los eventos onclick
                }, "1000");

            } else {
                acierto();
            }

            document.getElementById("intentos").innerHTML = ++intentos;
        }
    }
}

/**
 * Cambia el src de la carta dependiendo de un booleano
 * true = la cara de la carta correspondiente
 * false = el dorso de la carta
 */
function imgCarta(elemento, booleano) {
    elemento.src = (booleano) ? ("../img/parejas/img/" + (elemento.name) + ".gif") : "../img/parejas/img/atras.png";
}

/**
 * Vacía las variables cartaUno y cartaDos
 */
function unsetCartas() {
    cartaUno = undefined;
    cartaDos = undefined;
}

/**
 * Vacía las variables, suma 1 a los aciertos y 
 * comprueba si has ganado
 */
function acierto() {
    cartaUno = desactivarCarta(cartaUno);
    cartaDos = desactivarCarta(cartaDos);
    if (++aciertos === 15) {
        alert("Has ganado");
        victoria();
    }
}

/**
 * Elimina el atributo nombre y onclick de una carta
 * Devuelve undefined para que la carta no pueda tener atributos otra vez
 */
function desactivarCarta(elemento) {
    elemento.removeAttribute("name");
    elemento.onclick = null;
    return undefined;
}

/**
 * Activamos o desactivamos las funciones onclick de 
 * las imágenes del documento
 * booleano:
 * true = activamos la funcion
 * false = desactivamos la funcion
 */
function accionClick(booleano) {
    var accion = (booleano) ? function () {
        jugar(this);
    } : null;

    for (var i = 0, long = imgs.length; i < long; i++) {
        if (imgs[i].hasAttribute("name")) {
            imgs[i].onclick = accion;
        }
    }
}