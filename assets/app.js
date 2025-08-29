// Lógica principal VegasBett (privado) — v16
(function () {
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const CFG = window.VEGASBETT_CONFIG || {};

  // ----------------- Utilidades
  const DIAS = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];

  function getTodayPromo() {
    const d = new Date().getDay(); // 0=Dom
    const percent = (CFG.PROMO_BONUS_BY_DAY && CFG.PROMO_BONUS_BY_DAY[d]) || 0;
    return { dayIndex: d, dayName: DIAS[d], percent };
  }

  function waUrl(number, text) {
    const msg = encodeURIComponent(text || "");
    return number ? `https://wa.me/${number}?text=${msg}` : `https://wa.me/?text=${msg}`;
  }
  function moneyFormat(n) {
    try {
      const v = Number(n);
      if (isNaN(v)) return n;
      return v.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
    } catch (e) { return n; }
  }
  function copyFromSelector(sel) {
    const el = document.querySelector(sel);
    if (!el) return false;
    el.select();
    document.execCommand("copy");
    toast("Copiado ✅");
    return true;
  }
  function toast(text) {
    const t = $("#toast");
    if (!t) return;
    t.textContent = text;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 1600);
  }

  // Footer año
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Overrides por URL (emergencia) + mostrar Admin si ?admin=1
  try {
    const url = new URL(location.href);
    const p = url.searchParams.get("principal");
    const r = url.searchParams.get("respaldo");
    const adminFlag = url.searchParams.get("admin");
    if (p) CFG.NUMERO_PRINCIPAL = p;
    if (r) CFG.NUMERO_RESPALDO  = r;
    if (adminFlag === "1") { $("#adminToggle")?.classList.remove("hidden"); }
  } catch (e) {}

  // ----------------- PROMO DEL DÍA (Index)
  (function promoTicker(){
    const a = $("#promoTicker"); if (!a) return;

    const qp = new URLSearchParams(location.search);
    const forceOff = qp.get("promos")==="off";
    const forceOn  = qp.get("promos")==="on";

    if ((!CFG.SHOW_PROMO_TICKER && !forceOn) || forceOff) {
      a.classList.add("hidden");
      return;
    }

    const today = getTodayPromo();
    const pct = today.percent;
    if (!pct) { a.classList.add("hidden"); return; }

    // Texto visible
    const min = CFG.PROMO_MIN || 2000;
    const max = CFG.PROMO_MAX || 20000;
    $("#promoText").textContent = `Hoy ${today.dayName}: bono +${pct}% en cargas de ${moneyFormat(min)} a ${moneyFormat(max)}.`;

    // HREF al flujo de carga con promo del día
    const base = location.origin + location.pathname.replace(/index\.html?$/i,'');
    a.href = `${base}cargar.html?promo=today`;

    a.classList.remove("hidden");
  })();

  // ----------------- Botones Home
  if ($("#btnPrincipal")) {
    $("#btnPrincipal").addEventListener("click", () => {
      const text = `Hola, soy ____.
Necesito atención del *número principal*.
Gracias.`;
      if (typeof fbq === "function") { fbq("track", "Contact", { flow: "direct", target: "principal" }); }
      location.href = waUrl(CFG.NUMERO_PRINCIPAL, text);
    });
  }

  if ($("#btnRespaldo")) {
    $("#btnRespaldo").addEventListener("click", () => {
      const text = `Hola, soy ____.
Necesito atención del *número de reclamos*.
Gracias.`;
      if (typeof fbq === "function") { fbq("track", "Contact", { flow: "direct", target: "respaldo" }); }
      location.href = waUrl(CFG.NUMERO_RESPALDO, text);
    });
  }

  // ----------------- CARGAR
  if ($("#formCargar")) {
    const form  = $("#formCargar");
    const paso2 = $("#paso2");
    const cbu   = $("#cbu");
    const alias = $("#alias");
    const titularSpan = $("#titularSpan");

    if (cbu)   cbu.value   = CFG.CBU   || "";
    if (alias) alias.value = CFG.ALIAS || "";
    if (titularSpan) titularSpan.textContent = CFG.TITULAR || "";

    $$(".copybtn").forEach(btn => btn.addEventListener("click", (e) => {
      e.preventDefault();
      copyFromSelector(btn.getAttribute("data-copy"));
    }));

    // Detectar promo
    const qp = new URLSearchParams(location.search);
    const promoParam = qp.get('promo'); // 'today' | 'new' | null
    let activePromo = null;

    if (promoParam === 'today') {
      const today = getTodayPromo();
      if (today.percent) {
        activePromo = {
          type: 'today',
          label: 'Bono del día',
          percent: today.percent,
          dayName: today.dayName,
          min: CFG.PROMO_MIN || 2000,
          max: CFG.PROMO_MAX || 20000,
        };
        const n = $("#promoNotice");
        if (n) {
          n.textContent = `Promo activa: +${today.percent}% (${today.dayName}) de ${moneyFormat(activePromo.min)} a ${moneyFormat(activePromo.max)}.`;
          n.classList.remove("hidden");
        }
      }
    }

    if (promoParam === 'new') {
      activePromo = {
        type: 'new',
        label: 'Bono de bienvenida',
        percent: CFG.NEW_USER_BONO || 35,
        min: CFG.NEW_MIN || 500,
        max: null,
      };
      const n = $("#promoNotice");
      if (n) {
        n.textContent = `Bono de bienvenida +${activePromo.percent}% (mínimo ${moneyFormat(activePromo.min)}).`;
        n.classList.remove("hidden");
      }
    }

    // Enforce mínimo del input según promo
    const montoInput = $('#monto');
    if (montoInput && activePromo?.min) {
      montoInput.min = String(activePromo.min);
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const nombre = $("#nombre").value.trim();
      const monto  = $("#monto").value.trim();
      if (!nombre || !monto) { alert("Completá nombre y monto."); return; }
      paso2.classList.remove("hidden");
      paso2.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    const enviar = $("#enviarWhatsCargar");
    if (enviar) {
      enviar.addEventListener("click", () => {
        const nombre = $("#nombre").value.trim();
        const monto  = $("#monto").value.trim();
        if (!nombre || !monto) { alert("Completá nombre y monto."); return; }

        // Validaciones según promo
        if (activePromo) {
          const m = Number(monto);
          if (activePromo.type === 'today') {
            const {min, max} = activePromo;
            if (m < min || m > max) {
              alert(`El ${activePromo.label} aplica entre ${moneyFormat(min)} y ${moneyFormat(max)}.`);
              return;
            }
          }
          if (activePromo.type === 'new') {
            const {min} = activePromo;
            if (m < min) {
              alert(`El ${activePromo.label} aplica desde ${moneyFormat(min)}.`);
              return;
            }
          }
        }

        const lineas = [
          `Hola, soy *${nombre}*.`,
          `Quiero *CARGAR* ${moneyFormat(monto)}.`
        ];

        if (activePromo) {
          if (activePromo.type === 'today') {
            lineas.push(`Aplicar *${activePromo.label}* (${activePromo.dayName} +${activePromo.percent}%).`);
          }
          if (activePromo.type === 'new') {
            lineas.push(`Soy nuevo/a y quiero el *${activePromo.label}* (+${activePromo.percent}%).`);
          }
        }

        lineas.push(`CBU/ALIAS copiado. Envío el comprobante aquí.`);

        const text = lineas.join('\n');
        if (typeof fbq === "function") {
          fbq("track", "Contact", { flow: activePromo ? (activePromo.type==='new'?'cargar_new':'cargar_promo') : 'cargar' });
        }
        location.href = waUrl(CFG.NUMERO_PRINCIPAL, text);
      });
    }
  }

  // ----------------- RETIRAR
  if ($("#formRetirar")) {
    const titularInput = $("#titularR");
    const cbuAliasInput = $("#cbuAliasR");
    if (titularInput && CFG.TITULAR) titularInput.value = CFG.TITULAR;
    if (cbuAliasInput) cbuAliasInput.value = (CFG.ALIAS || CFG.CBU || "");

    $("#formRetirar").addEventListener("submit", (e) => {
      e.preventDefault();

      const usuario  = $("#usuarioR").value.trim();
      const titular  = $("#titularR").value.trim();
      const cbuAlias = $("#cbuAliasR").value.trim();
      const monto    = $("#montoR").value.trim();

      if (!usuario || !titular || !cbuAlias || !monto) {
        alert("Completá todos los campos.");
        return;
      }
      if (Number(monto) > 250000) {
        alert("El monto máximo por retiro es $250.000");
        return;
      }

      const text = `Usuario: ${usuario}
Titular: ${titular}
CBU o Alias: ${cbuAlias}
Monto a retirar: ${moneyFormat(monto)}`;

      const url = waUrl(CFG.NUMERO_PRINCIPAL, text);
      if (typeof fbq === "function") { fbq("track", "Contact", { flow: "retirar" }); }
      window.location.href = url;
    });
  }

  // ----------------- Panel Admin
  const adminToggle = $("#adminToggle");
  const panel = $("#adminPanel");
  const pin   = $("#pin");
  const nP    = $("#nPrincipal");
  const nR    = $("#nRespaldo");

  if (adminToggle && panel) adminToggle.addEventListener("click", () => panel.classList.toggle("hidden"));
  if ($("#aplicarAdmin")) {
    $("#aplicarAdmin").addEventListener("click", () => {
      if (!pin.value || pin.value !== (CFG.EMERGENCY_PIN || "")) { alert("PIN incorrecto"); return; }
      if (nP && nP.value) CFG.NUMERO_PRINCIPAL = nP.value.trim();
      if (nR && nR.value) CFG.NUMERO_RESPALDO  = nR.value.trim();
      toast("Números aplicados (solo en esta sesión)");
    });
  }
  if ($("#genLink")) {
    $("#genLink").addEventListener("click", () => {
      if (!pin.value || pin.value !== (CFG.EMERGENCY_PIN || "")) { alert("PIN incorrecto"); return; }
      const base = location.origin + location.pathname.replace(/index\.html?$/i, "");
      const qp = new URLSearchParams();
      if (nP && nP.value) qp.set("principal", nP.value.trim());
      if (nR && nR.value) qp.set("respaldo",  nR.value.trim());
      const link = base + "index.html?" + qp.toString();
      const out = $("#linkResult");
      if (out) { out.value = link; out.select(); document.execCommand("copy"); toast("Link generado"); }
    });
  }

  // ----------------- Age Gate 18+
  (function ageGate(){
    if (!CFG.AGE_GATE_ENABLED) return;
    if (localStorage.getItem('AGE_OK') === '1') return;

    const minAge = CFG.EDAD_MINIMA || 18;
    const backdrop = document.createElement('div');
    backdrop.className = 'age-backdrop';
    backdrop.innerHTML = `
      <div class="age-modal">
        <h3>Confirmación de edad <span class="age-badge">${minAge}+</span></h3>
        <p>Para continuar, confirmá que sos mayor de ${minAge} años. Jugá responsable.</p>
        <div class="age-actions">
          <button id="ageYes" class="btn ok">Sí, soy mayor</button>
          <button id="ageNo" class="btn warn">No, salir</button>
        </div>
      </div>`;
    document.body.appendChild(backdrop);
    $("#ageYes")?.addEventListener('click', () => { localStorage.setItem('AGE_OK','1'); backdrop.remove(); });
    $("#ageNo")?.addEventListener('click', () => { window.location.href = 'https://www.google.com'; });
  })();

  // ----------------- Modal "Más info"
  (function(){
    const modal   = $("#modalInfo");
    const btnOpen = $("#btnMasInfo");
    const btnClose= $("#modalClose");
    const btnOk   = $("#modalOk");
    const btnCopy = $("#copySpech");
    const spech   = $("#spechText");
    if (!modal || !btnOpen) return;

    const open  = ()=> { modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false'); };
    const close = ()=> { modal.classList.add('hidden');   modal.setAttribute('aria-hidden','true');  };
    btnOpen.addEventListener('click', open);
    btnClose?.addEventListener('click', close);
    btnOk?.addEventListener('click', close);
    modal.querySelector('.vb-modal__backdrop')?.addEventListener('click', e=>{ if (e.target.dataset.close) close(); });
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') close(); });
    btnCopy?.addEventListener('click', ()=>{
      const txt = spech?.innerText || '';
      (navigator.clipboard?.writeText(txt) || Promise.reject()).then(
        ()=> toast('Texto copiado ✅'),
        ()=> { const ta=document.createElement('textarea'); ta.value=txt; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); toast('Texto copiado ✅'); }
      );
    });
  })();
})();