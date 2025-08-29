// Configuración central — VegasBett (OWNER MODE + Admin) — v16
window.VEGASBETT_CONFIG = {
  MARCA: "VegasBett",

  // Números (sin + ni espacios)
  NUMERO_PRINCIPAL: "5492233415879",
  NUMERO_RESPALDO:  "5492233458173",

  // Datos bancarios
  CBU:     "0000003100056935839518",
  ALIAS:   "Vegass.bet",
  TITULAR: "Priscila Correa",

  // Vista previa / privacidad
  SHARE_PREVIEW: true,
  OG_IMAGE: "assets/portada_paginaweb.png",
  NO_INDEX: true,

  // Pixel Meta
  TRACKING_ENABLED: false,
  PIXEL_ID: "24100361799629508",

  // 🔒 Dueño (sólo vos). Cambiá este token largo y guardalo privado.
  OWNER_TOKEN: "vb_R8e6hL3nq2vA1y7fK9mT5pQ0sZ4cX8bD1",
  EMERGENCY_PIN: "4321", // PIN para aplicar cambios desde el panel

  // Age Gate + cartel fijo
  AGE_GATE_ENABLED: true,
  EDAD_MINIMA: 18,
  SHOW_18_BADGE: true,   // cartel superior “+18 Jugá responsable”

  // Banner de promos (0=Dom … 6=Sáb)
  SHOW_PROMO_TICKER: true,
  PROMO_MIN: 2000,
  PROMO_MAX: 20000,
  PROMO_BONUS_BY_DAY: {
    0: 25, // Domingo
    1: 20, // Lunes
    2: 15, // Martes
    3: 10, // Miércoles
    4: 10, // Jueves
    5: 20, // Viernes
    6: 20  // Sábado
  },

  // Bono bienvenida
  NEW_USER_BONO: 35,
  NEW_MIN: 500
};
