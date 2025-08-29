// assets/config.js — v16
window.VEGASBETT_CONFIG = {
  // Marca
  MARCA: "VegasBett",

  // Números de WhatsApp (sin + ni espacios)
  NUMERO_PRINCIPAL: "5492233415879",
  NUMERO_RESPALDO: "5492233458173",

  // Datos bancarios
  CBU: "0000003100056935839518",
  ALIAS: "Vegass.bet",
  TITULAR: "Priscila Correa",

  // Preview / SEO
  SHARE_PREVIEW: true,
  OG_IMAGE: "assets/portada_paginaweb.png",
  NO_INDEX: true,

  // Pixel (opcional)
  TRACKING_ENABLED: false,
  PIXEL_ID: "24100361799629508",

  // Admin
  EMERGENCY_PIN: "4321",

  // ===== Promos =====
  // Mostrar/ocultar banner de promos (o usar ?promos=off / ?promos=on en la URL)
  SHOW_PROMO_TICKER: true,

  // 0=Dom,1=Lun,2=Mar,3=Mié,4=Jue,5=Vie,6=Sáb
  PROMO_BONUS_BY_DAY: {
    0: 25, // Domingo
    1: 20, // Lunes
    2: 15, // Martes
    3: 10, // Miércoles
    4: 10, // Jueves
    5: 20, // Viernes
    6: 20  // Sábado
  },

  // Rango válido para promo del día
  PROMO_MIN: 2000,
  PROMO_MAX: 20000,

  // Bono para usuarios nuevos
  NEW_USER_BONO: 35,
  NEW_MIN: 500,

  // Age gate
  AGE_GATE_ENABLED: true,
  EDAD_MINIMA: 18
};
