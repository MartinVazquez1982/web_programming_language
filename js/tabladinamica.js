"use strict";
// https://6670b38d0900b5f8724b63bf.mockapi.io/api/v1/eventos


async function cargar(){
  
  let tabla = document.getElementById("tablaDinamica");
  let ids = []
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

    celdanombre.textContent = response[i].nombre;
    const date = new Date(response[i].fecha * 1000);
    const localDate = date.toLocaleDateString();
    celdaFecha.textContent = localDate;
    celdaLugar.textContent = response[i].lugar;
    celdatematica.textContent = response[i].tematica;
    celdalink.innerHTML = `<a href="${response[i].link}" target="_blank">Sitio Web del Evento</a>`;
    celdaCosto.textContent = response[i].costo;
    ids.push(response[i].id);
    celdaBorrar.innerHTML = `<button>Borrar</button>`;
    celdaBorrar.addEventListener("click", function () {
      fetch(
        `https://6670b38d0900b5f8724b63bf.mockapi.io/api/v1/eventos/${response[i].id}`,
        {
          method: "DELETE",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Borrado:", data);
          fila.parentNode.removeChild(fila);
          ids.splice(ids.indexOf(response[i].id), 1);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  }

  let form_evento = document.getElementById("form-evento");
  form_evento.addEventListener("submit", function (event) {
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

    fetch("https://6670b38d0900b5f8724b63bf.mockapi.io/api/v1/eventos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        let fila = tabla.insertRow(-1);
        let celdanombre = fila.insertCell(0);
        let celdaFecha = fila.insertCell(1);
        let celdaLugar = fila.insertCell(2);
        let celdatematica = fila.insertCell(3);
        let celdalink = fila.insertCell(4);
        let celdaCosto = fila.insertCell(5);
        let celdaBorrar = fila.insertCell(6);

        celdanombre.textContent = data.nombre;
        const date = new Date(data.fecha * 1000);
        const localDate = date.toLocaleDateString();
        celdaFecha.textContent = localDate;
        celdaLugar.textContent = data.lugar;
        celdatematica.textContent = data.tematica;
        celdalink.innerHTML = `<a href="${data.link}" target="_blank">Sitio Web del Evento</a>`;
        celdaCosto.textContent = data.costo;
        celdaBorrar.innerHTML = `<button onclick="borrarFila(this)">Borrar</button>`;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    form_evento.reset();
  });

  let btn_editar = document.getElementById("btn-editar");
  btn_editar.addEventListener("click", function () {
    if (btn_editar.innerHTML === "Editar") { //editar
        let tableRows = tabla.getElementsByTagName("tr");
        for (let i = 0; i < tableRows.length; i++) {
            let cells = tableRows[i].getElementsByTagName("td");
            for (let j = 0; j < cells.length; j++) {
                let input = document.createElement("input");
                input.type = "text";
                input.value = cells[j].textContent;
                cells[j].textContent = "";
                cells[j].appendChild(input);
            }
        }
        btn_editar.innerHTML = "Guardar";
    } else { //guardar
        let tableRows = tabla.getElementsByTagName("tr");
        for (let i = 0; i < tableRows.length; i++) {
            let cells = tableRows[i].getElementsByTagName("td");
            let eventId = ids[i];
            let body = {
                nombre: cells[0].getElementsByTagName("input")[0].value,
                fecha: Math.floor(new Date(cells[1].getElementsByTagName("input")[0].value).getTime() / 1000),
                lugar: cells[2].getElementsByTagName("input")[0].value,
                tematica: cells[3].getElementsByTagName("input")[0].value,
                link: cells[4].getElementsByTagName("input")[0].value,
                costo: cells[5].getElementsByTagName("input")[0].value
            };
            console.log("" + eventId);
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
                    cells[4].innerHTML = `<a href="${data.link}" target="_blank">Sitio Web del Evento</a>`;
                    cells[5].textContent = data.costo;
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
        btn_editar.innerHTML = "Editar";
    }
  });
}

cargar()
