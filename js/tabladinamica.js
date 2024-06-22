"use strict";
// https://6670b38d0900b5f8724b63bf.mockapi.io/api/v1/eventos



async function cargar() {
  let ids = []
  let tabla = document.getElementById("tablaDinamica");

  const api_url = "https://6670b38d0900b5f8724b63bf.mockapi.io/api/v1/eventos";

  const response = await (await fetch(api_url)).json();

  for (let i = 0; i < response.length; i++) {
    let fila = tabla.insertRow(-1);
    let celdanombre = fila.insertCell(0);
    let celdaFecha = fila.insertCell(1);
    let celdaLugar = fila.insertCell(2);
    let celdatematica = fila.insertCell(3);
    let celdalink = fila.insertCell(4);
    let celdaCosto = fila.insertCell(5);
    let celdaBorrar = fila.insertCell(6);
    let celdaEditar = fila.insertCell(7);

    celdanombre.textContent = response[i].nombre;
    const date = new Date(response[i].fecha * 1000);
    const localDate = date.toLocaleDateString();
    celdaFecha.textContent = localDate;
    celdaLugar.textContent = response[i].lugar;
    celdatematica.textContent = response[i].tematica;
    celdalink.innerHTML = `<a href="${response[i].link}" target="_blank">${response[i].link}</a>`;
    celdaCosto.textContent = response[i].costo;
    ids.push(response[i].id);
    celdaBorrar.innerHTML = `<button>Borrar</button>`;
    celdaBorrar.addEventListener("click", () => { borrarFila(fila, response[i].id, ids); });
    celdaEditar.innerHTML = `<button>Editar</button>`;
    celdaEditar.addEventListener("click", () => { editar(fila, i, ids, celdaEditar, tabla); });
  }

  let form_evento = document.getElementById("form-evento");
  form_evento.addEventListener("submit", async function (event) {
    event.preventDefault();
    let nombre = document.getElementById("nombre").value;
    let fecha = Math.floor(
      new Date(document.getElementById("fecha").value).getTime() / 1000
    );
    let lugar = document.getElementById("lugar").value;
    let tematica = document.getElementById("tematica").value;
    let link = document.getElementById("link").value;
    let costo = document.getElementById("costo").value;
    let body = {
      nombre: nombre,
      fecha: fecha,
      lugar: lugar,
      tematica: tematica,
      link: link,
      costo: costo,
    };

    try {
      const response = await fetch("https://6670b38d0900b5f8724b63bf.mockapi.io/api/v1/eventos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      
      if (response.ok) {
        tabla.innerHTML = "";
        cargar();
        form_evento.reset();
      } else {
        throw new Error("Error: " + response.status);
      }
    } catch (error) {
      console.error(error);
    }
  });
}

cargar()

function borrarFila(fila, id, ids) {
  fetch(
    `https://6670b38d0900b5f8724b63bf.mockapi.io/api/v1/eventos/${id}`,
    {
      method: "DELETE",
    }
  )
    .then((response) => response.json())
    .then((data) => {
      fila.parentNode.removeChild(fila);
      ids.splice(ids.indexOf(id), 1);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function editar(fila, i, ids, celdaEditar, tabla) {
  let cells = fila.getElementsByTagName("td");
  let eventId = ids[i];
  if (celdaEditar.innerHTML === "<button>Editar</button>") { //editar
    let tableRows = tabla.getElementsByTagName("tr");
    let cells = tableRows[i].getElementsByTagName("td");
    for (let j = 0; j < cells.length - 2; j++) {
      let input = document.createElement("input");
      input.type = "text";
      input.value = cells[j].textContent;
      cells[j].textContent = "";
      cells[j].appendChild(input);
    }
    celdaEditar.innerHTML = '<button>Guardar</button>';
  } else {
    console.log("guardar");
    console.log(cells[0].getElementsByTagName("input")[0]);
    let body = {
      nombre: cells[0].getElementsByTagName("input")[0].value,
      fecha: Math.floor(new Date(cells[1].getElementsByTagName("input")[0].value).getTime() / 1000),
      lugar: cells[2].getElementsByTagName("input")[0].value,
      tematica: cells[3].getElementsByTagName("input")[0].value,
      link: cells[4].getElementsByTagName("input")[0].value,
      costo: cells[5].getElementsByTagName("input")[0].value
    };
    fetch(`https://6670b38d0900b5f8724b63bf.mockapi.io/api/v1/eventos/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        cells[0].textContent = data.nombre;
        const date = new Date(data.fecha * 1000);
        const localDate = date.toLocaleDateString();
        cells[1].textContent = localDate;
        cells[2].textContent = data.lugar;
        cells[3].textContent = data.tematica;
        cells[4].innerHTML = `<a href="${data.link}" target="_blank">${data.link}</a>`;
        cells[5].textContent = data.costo;
        celdaEditar.innerHTML = '<button>Editar</button>';
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}