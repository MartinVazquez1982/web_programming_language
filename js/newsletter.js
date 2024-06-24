"use strict"

document.getElementById('newsletter').addEventListener('submit', function(event){
  event.preventDefault();
  const ctnNForm = document.getElementById('ctn-form');

  const newsletter = document.getElementById('newsletter');
  const dataNewletter = new FormData(newsletter);
  const catpcha = dataNewletter.get('captcha');
  let alertCaptcha = document.getElementById('info-captcha');

  // Revisa si el texto de aviso no fue creado
  if (alertCaptcha === null){
    alertCaptcha = document.createElement('p');
    alertCaptcha.id = 'info-captcha';
    ctnNForm.appendChild(alertCaptcha);
  }

  const imgCatpcha = document.getElementById('captcha-img');
  const numeroCaptcha = imgCatpcha.src.split('/').pop().split('.')[0];
  if (catpcha !== resultCaptcha(parseInt(numeroCaptcha))){
    alertCaptcha.innerHTML = 'Captcha incorrecto. Intente nuevamente.';
  } else {
    alertCaptcha.innerHTML = 'Gracias por suscribirte a nuestro newsletter.';
    newsletter.reset();
  }
  selectCaptcha();
});

// Retorna la solucion de un captcha especifico
function resultCaptcha(num) {
  const captchasSoluciones = [
    "nvhoxdm",
    "phxxjdrk",
    "plbhxzxl",
    "yhykemwr",
    "zagxtwdx",
    "lucytpft",
    "nrtgdkwn",
    "dpbaiajz",
    "udbbgxls",
    "czchjiav",
    "wvvjcfua"
  ];
  if (num >= 0 && num < captchasSoluciones.length) {
    return captchasSoluciones[num]
  }
}

// Calcula el captcha a mostrar
function selectCaptcha(){
  const imgCatpcha = document.getElementById('captcha-img');
  const catpchaSelected = Math.floor(Math.random() * 11);
  imgCatpcha.src = `images/captcha/${catpchaSelected}.png`;
};

selectCaptcha();
