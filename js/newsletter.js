"use strict"

document.addEventListener('DOMContentLoaded', function(){
  
  const newsletter = document.getElementById('newsletter');
  const imgCatpcha = document.getElementById('captcha-img');
  const ctnNForm = document.getElementById('ctn-form');
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
  let solucionCatpcha;
  selectCaptcha();

  newsletter.addEventListener('submit', function(event){
    event.preventDefault();

    const dataNewletter = new FormData(newsletter);
    const catpcha = dataNewletter.get('captcha');
    let alertCaptcha = document.getElementById('info-captcha');

    // Revisa si el texto de aviso no fue creado
    if (alertCaptcha === null){
      alertCaptcha = document.createElement('p');
      alertCaptcha.id = 'info-captcha';
      ctnNForm.appendChild(alertCaptcha);
    }
    
    if (catpcha != solucionCatpcha){
      alertCaptcha.innerHTML = 'Captcha incorrecto. Intente nuevamente.';
    } else {
      alertCaptcha.innerHTML = 'Gracias por suscribirte a nuestro newsletter.';
      newsletter.reset();
    }
    selectCaptcha();
  });

  // Calcula el captcha a mostrar
  function selectCaptcha(){
    const catpchaSelected = Math.floor(Math.random() * 11);
    solucionCatpcha = captchasSoluciones[catpchaSelected];
    imgCatpcha.src = `images/captcha/${catpchaSelected}.png`;
  };


})