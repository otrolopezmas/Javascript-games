var segundos;
var minutos;
var contador;

function iniciarReloj(minuto) {
    minutos = minuto - 1;
    segundos = 59;
    crearMarcador();

    document.getElementById("minutos").innerHTML = minutos;
    document.getElementById("segundos").innerHTML = segundos;

    contador = setInterval(function () {

        if (minutos === 0 && segundos === 1) {
            derrota();
        } else {
            if (--segundos === 0) {
                segundos = 59;
                document.getElementById("minutos").innerHTML = --minutos;
            }
            document.getElementById("segundos").innerHTML = segundos;
        }

    }, "1000");

}

function crearMarcador() {
    var marcador = document.getElementById("reloj");
    marcador.style.visibility = "visible";
}

function finalizarJuego() {
    var pagina = document.getElementsByTagName("*");
    for (var i = 0, long = pagina.length; i < long; i++) {
        pagina[i].onclick = null;
    }
}

/**
 * Para el contador si has acabado el juego
 */
function victoria() {
    clearInterval(contador);
}

function derrota() {
    clearInterval(contador);
    finalizarJuego();
    alert("Se acabó el tiempo! Has perdido ;___;!");
    document.getElementById("segundos").innerHTML = 0;
}