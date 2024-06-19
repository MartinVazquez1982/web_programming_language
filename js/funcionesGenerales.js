"use strict";

document.addEventListener("DOMContentLoaded", function () {
  // Funcionalidad de la barra de navegación
  const btn_nav = document.querySelector("#btn-nav");
  const nav = document.querySelector("#nav");

  btn_nav.addEventListener("click", function (event) {
    nav.classList.toggle("nav-visible");
  });


  // Partial render content
  
  const main = document.querySelector('main')
  const script = {
    "noticias": "js/newsletter.js",
    "eventos": "js/tabladinamica.js"
  }
  
  function crearError(pagina){
    const element = document.createElement('section')
    element.classList.add('sc-conteiner-info')
    const texto =  document.createElement('h2')
    texto.classList.add('subtitle-sections')
    texto.innerHTML = `Error a cargar la pagina: ${pagina}`
    element.appendChild(texto)
    return element
  }

  async function cargarPagina(pagina) {
    try {
      const response = await fetch(`html/${pagina}.html`)
      if (response.ok) {
        const contenido = await response.text()
        const scriptBorrar = document.querySelector('#script-funcionalidad')
        if (scriptBorrar !== null){
          scriptBorrar.remove()
        }
        if (pagina === 'eventos' || pagina === 'noticas'){
          const codigo = document.createElement('script')
          codigo.src = script[pagina]
          codigo.id = 'script-funcionalidad'
          document.body.appendChild(codigo)
        }
        main.innerHTML = contenido
      } else {
        main.innerHTML = ''
        main.appendChild(crearError(pagina))
      }
    } catch (error) {
      main.innerHTML = ''
      main.appendChild(crearError(pagina))
    }
  }

  function proxContenido(event){
    const pagina = event.target.id

    cargarPagina(pagina)
  }

  document.querySelectorAll('.nav-link').forEach( (button) => { button.addEventListener('click', (event) => { proxContenido(event) }) } )
  cargarPagina('inicio') 

  
  //Funcionalidad del tema de la pagina (Modo oscuro y modo claro)
  const btn_tema = document.querySelector("#btn-modo-color");
  let temaOscuro = true;

  btn_tema.addEventListener("click", function (event) {
    const imgTema = btn_tema.querySelector("#img-btn-modo-color");
    let pathImg = "images/tema";
    let alt;

    if (temaOscuro) {
      pathImg = `${pathImg}/luna.png`;
      alt = "oscuro";
    } else {
      pathImg = `${pathImg}/sol.png`;
      alt = "claro";
    }
    const body = document.body;
    body.classList.toggle("modoOscuro");
    body.classList.toggle("modoClaro");

    imgTema.src = pathImg;
    imgTema.alt = alt;
    temaOscuro = !temaOscuro;
  });
});
