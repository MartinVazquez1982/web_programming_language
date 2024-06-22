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

  // Script que deben ejecutar otras paginas
  const script = {
    "noticias": "js/newsletter.js",
    "eventos": "js/tabladinamica.js"
  }

  const titles = {
    "inicio": "Lenguajes de Programacion",
    "lenguajes": "Tipos de Lenguajes",
    "noticias": "Noticias",
    "eventos": "Eventos"
  }
  
  // Crear un cartel de error
  function crearError(pagina){
    const element = document.createElement('section')
    element.classList.add('sc-conteiner-info')
    const texto =  document.createElement('h2')
    texto.classList.add('subtitle-sections')
    texto.innerHTML = `Error a cargar la pagina: ${pagina}`
    element.appendChild(texto)
    return element
  }

  // Carga la nueva pagina
  async function cargarPagina(pagina) {
    try {
      const response = await fetch(`html/${pagina}.html`)
      if (response.ok) {
        const contenido = await response.text()
        const scriptBorrar = document.querySelector('#script-funcionalidad')
        if (scriptBorrar !== null){
          scriptBorrar.remove()
        }
        if (pagina === 'eventos' || pagina === 'noticias'){
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

  function actualizarRuta(ruta){
    document.title = titles[ruta]
    window.history.pushState({ pagina: ruta }, `${ruta}`, `/${ruta}`)
  }

  // Revisa cual es la proxima pagina a carga
  function proxContenido(event){
    const pagina = event.target.id
    actualizarRuta(pagina)
    cargarPagina(pagina)
  }

  // Le asigna a cada boton del nav, la pagina a la que redirige
  document.querySelectorAll('.nav-link').forEach( (button) => { button.addEventListener('click', (event) => { proxContenido(event) }) } )
  
  window.addEventListener('popstate', function(event) {
    const pagina = event.state?.pagina
    if (pagina){
      document.title = titles[pagina]
      cargarPagina(pagina) 
    }
  })

  // Carga el inicio
  actualizarRuta('inicio')
  cargarPagina('inicio') 

  

  // Funcionalidad del tema de la pagina (Modo oscuro y modo claro)

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
