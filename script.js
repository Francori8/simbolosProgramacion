import simbolo from "./api.js"

const $ = (args) => document.querySelector(args)
$("#buscar").addEventListener("input",mostrarContenidoFiltrado)

function cargar(){
    mostrarSimbolos(simbolo)
}

function mostrarSimbolos(simbolos){
   const fav = JSON.parse(localStorage.getItem("favoritos")) || []
   
   const simbolosOrdenadosSegunFavoritos = ordenarSiEstanFavoritos(simbolos, fav) 
   
   const simbolosHTML = simbolosOrdenadosSegunFavoritos.map(val => {
        return `<div class="tarjeta" title="${val.temas[0]}" >
                    <div class="subtitulo" >
                        <h2>${val.simbolo}</h2>
                    </div>
                    <div class="botones">
                        <button class="btn copy" data-valor="${val.simbolo}" title="Copiar" >🔗</button>
                        <button class="btn fav ${fav.includes(val.id +"") ? "corazon"  : "" }" data-id="${val.id}" title="Me Gusta">❤</button>
                    </div>
                    <div class="notificar"></div>
                </div>`
    })

    const contenedor = $("#contenedor-simbolos")

    contenedor.innerHTML = simbolosHTML.join("")

    contenedor.querySelectorAll(".copy").forEach(btn => {
        btn.addEventListener("click", copiarSimbolo)
    })

    contenedor.querySelectorAll(".fav").forEach(btn => {
        btn.addEventListener("click", cambiarfavoritos)
    })

    
}

function cambiarfavoritos(e){
    const idSimb = e.target.dataset.id
    const fav = JSON.parse(localStorage.getItem("favoritos")) || []
    
    if(fav.includes(idSimb)){

        e.target.classList.remove("corazon")
        fav.splice(fav.indexOf(idSimb),1)
        localStorage.setItem("favoritos",JSON.stringify(fav))

    }else{
        e.target.classList.add("corazon")
        fav.push(idSimb)
        localStorage.setItem("favoritos",JSON.stringify(fav))
    }
}

async function copiarSimbolo(e){
    const simbolo = e.target.dataset.valor
    try{
        await navigator.clipboard.writeText(simbolo)
        escribirEnPop(e,"Copiado")
    }catch(error){
        escribirEnPop(e,"No se pudo copiar")
    }
}


function ordenarSiEstanFavoritos(simbolos, fav){
    return simbolos.toSorted((a,b) => {
        if(fav.includes( a.id + "")){
            return -1
        }
        return 1
    })
}

function escribirEnPop(elemento , mensaje){
    
    const contexto = elemento.target.parentNode.parentNode
    const eleemntoNotificador  = contexto.querySelector(".notificar")
    contexto.classList.add("visualizarPop")
    eleemntoNotificador.classList.add("visualizar")
    eleemntoNotificador.innerText = mensaje
    setTimeout(() => {
        eleemntoNotificador.classList.remove("visualizar")
        contexto.classList.remove("visualizarPop")
    }, 500)
    
}

function mostrarContenidoFiltrado(e){
    const filtro = e.target.value.toLowerCase()
    const simbolosMostar = simbolo.filter(val => val.temas.some(string => string.includes(filtro)))
    mostrarSimbolos(simbolosMostar)
}

window.addEventListener("load",cargar)