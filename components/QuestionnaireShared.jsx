"use client";
import { useMemo } from "react";

/* ------------------------------------------------------------------ */
/*  Modelos de datos                                                    */
/* ------------------------------------------------------------------ */

export function emptyContacto() {
  return { nombre: "", correo: "", telefono: "" };
}

export function emptyRevisoria() {
  return {
    contacto: emptyContacto(),
    generales: {
      empresa: "",
      giro: "",
      principalesServicios: "",
      fechaInicioOperaciones: "",
      numSucursales: "",
      subsidiarias: "",
      grupoNiif: "",
    },
    cuentas: {
      numClientesCxC: "",
      facturasVentaMensuales: "",
      notas: "",
    },
    fiscal: {
      retencionFuenteMes: "", retencionFuenteAnio: "",
      rentaMes: "", rentaAnio: "",
      ivaMes: "", ivaAnio: "",
      icaMes: "", icaAnio: "",
      otrosRevisiones: "",
      granContribuyente: null,
      recursosDian: null,
      aplazamientoDeudas: null,
      perdidasTributarias: null,
      perdidasDetalle: "",
      operacionesGravadasNoGravadas: null,
    },
    personal: {
      empleadosDirecta: "", empleadosIndirecta: "", equipoContable: "", notasEquipoContable: "",
    },
    financiera: {
      moneda: "pesos",
      ventasLocalesProyectado: "", ventasExportProyectado: "",
      ventasLocalesAnterior: "", ventasExportAnterior: "",
      resultadoActual: "", resultadoAnterior: "",
      activoFijoCantidad: "",
      notas: "",
    },
    notasGenerales: "",
    autorizaTratamiento: false,
  };
}

export const TRANSACCIONES_PT = [
  "Comercio de suministros, materias primas, mercaderías, productos en proceso, terminados o bienes",
  "Comercio de activos fijos",
  "Servicios del giro principal de la empresa",
  "Servicios de consultoría, legales, contables, administrativos, técnicos o informáticos",
  "Otros servicios secundarios (diferentes al giro principal de la empresa)",
  "Regalías",
  "Intereses por préstamos",
  "Arrendamiento y/o subarrendamiento",
  "Enajenación de acciones",
  "Transmisión de intangibles",
  "Operaciones con commodities",
  "Otros (detallar)",
];

export function emptyPT() {
  return {
    contacto: emptyContacto(),
    general: {
      nombreCompania: "",
      nit: "",
      tipoEntidad: "",
      actividadEconomica: "",
      periodoEvaluar: "",
    },
    consideraciones: {
      numPartesVinculadas: "",
      opDomiciliadas: null,
      opNoDomiciliadas: null,
      opParaisosFiscales: null,
      consolidaEEFF: null,
      testBeneficio: null,
    },
    transacciones: TRANSACCIONES_PT.map((nombre, i) => ({
      id: i,
      nombre,
      ingresos: false,
      egresos: false,
      cantidadIngresos: "",
      cantidadEgresos: "",
    })),
    otrosDetalle: "",
    notasGenerales: "",
    autorizaTratamiento: false,
  };
}

/* ------------------------------------------------------------------ */
/*  Utilidades                                                          */
/* ------------------------------------------------------------------ */

export function isFilled(v) {
  if (v === null || v === undefined) return false;
  if (typeof v === "boolean") return true;
  if (typeof v === "string") return v.trim() !== "";
  return true;
}

export function sectionCompleteness(obj) {
  const leaves = [];
  const walk = (o) => {
    Object.values(o).forEach((v) => {
      if (v !== null && typeof v === "object" && !Array.isArray(v)) walk(v);
      else leaves.push(v);
    });
  };
  walk(obj);
  const filled = leaves.filter(isFilled).length;
  return leaves.length ? Math.round((filled / leaves.length) * 100) : 100;
}

export function fmtDate(dateStr) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export function yn(v) {
  return v === true ? "Sí" : v === false ? "No" : "";
}

/* ------------------------------------------------------------------ */
/*  Estilos compartidos                                                 */
/* ------------------------------------------------------------------ */

export const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

    .lv-root {
      --ink: #404041; --ink-soft: #58585A; --paper: #FAFAFA; --card: #FFFFFF;
      --slate: #6E7173; --hairline: #E3E4E4; --gold: #71EF49; --gold-soft: #E7FBDD;
      --forest: #3F9142; --red: #A23E3E;
      font-family: 'Inter', sans-serif; color: var(--ink); background: var(--paper); min-height: 100%;
    }
    .lv-root * { box-sizing: border-box; }
    .lv-serif { font-family: 'Manrope', sans-serif; }
    .lv-mono { font-family: 'IBM Plex Mono', monospace; font-variant-numeric: tabular-nums; }

    .lv-topbar { display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; border-bottom: 1px solid var(--hairline); background: var(--card); flex-wrap: wrap; gap: 12px; }
    .lv-brand { display: flex; align-items: center; gap: 10px; }
    .lv-brand-mark { width: 34px; height: 34px; border-radius: 50%; background: var(--ink); color: var(--gold-soft); display: flex; align-items: center; justify-content: center; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 14px; }
    .lv-brand-name { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 17px; }
    .lv-brand-sub { font-size: 11px; color: var(--slate); letter-spacing: .04em; text-transform: uppercase; }

    .lv-tabs { display: flex; gap: 4px; background: var(--paper); border: 1px solid var(--hairline); border-radius: 8px; padding: 3px; }
    .lv-tab { border: none; background: transparent; padding: 7px 14px; border-radius: 6px; font-size: 13px; font-weight: 600; color: var(--slate); cursor: pointer; font-family: inherit; }
    .lv-tab.active { background: var(--ink); color: #fff; }
    .lv-tab:disabled { opacity: .35; cursor: not-allowed; }

    .lv-btn { border: 1px solid var(--ink); background: var(--ink); color: #fff; padding: 8px 14px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
    .lv-btn:hover { opacity: .9; }
    .lv-btn.ghost { background: transparent; color: var(--ink); }
    .lv-btn.gold { background: var(--gold); border-color: var(--gold); color: var(--ink); }
    .lv-btn.danger { background: transparent; color: var(--red); border-color: var(--red); }
    .lv-btn:disabled { opacity: .4; cursor: not-allowed; }

    .lv-landing { max-width: 720px; margin: 60px auto; text-align: center; padding: 0 20px; }
    .lv-landing h1 { font-family: 'Manrope', sans-serif; font-size: 26px; margin-bottom: 8px; }
    .lv-landing p { color: var(--slate); font-size: 14px; margin-bottom: 32px; }
    .lv-choice-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    @media (max-width: 640px) { .lv-choice-grid { grid-template-columns: 1fr; } }
    .lv-choice { background: var(--card); border: 1px solid var(--hairline); border-radius: 10px; padding: 26px; cursor: pointer; text-align: left; transition: .15s; }
    .lv-choice:hover { border-color: var(--gold); box-shadow: 0 2px 10px rgba(184,134,59,.12); }
    .lv-choice .eyebrow { font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: var(--gold); font-weight: 700; margin-bottom: 6px; }
    .lv-choice h3 { font-family: 'Manrope', sans-serif; margin: 0 0 8px 0; font-size: 17px; }
    .lv-choice p { color: var(--slate); font-size: 12.5px; margin: 0; }

    .lv-layout { display: grid; grid-template-columns: 1.6fr 1fr; gap: 20px; padding: 24px; max-width: 1180px; margin: 0 auto; align-items: start; }
    @media (max-width: 860px) { .lv-layout { grid-template-columns: 1fr; } }

    .lv-card { background: var(--card); border: 1px solid var(--hairline); border-radius: 10px; padding: 20px; margin-bottom: 16px; }
    .lv-card-title { font-family: 'Manrope', sans-serif; font-size: 15px; font-weight: 600; margin: 0 0 4px 0; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px; }
    .lv-card-sub { font-size: 11.5px; color: var(--slate); margin-bottom: 14px; }
    .lv-eyebrow { font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: var(--gold); font-weight: 700; margin-bottom: 4px; }
    .lv-badge { font-size: 10.5px; font-weight: 600; border: 1px solid; border-radius: 20px; padding: 2px 9px; }

    .lv-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .lv-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; }
    .lv-field label { font-size: 11.5px; color: var(--slate); font-weight: 600; }
    .lv-input, .lv-select, textarea.lv-input { border: 1px solid var(--hairline); border-radius: 6px; padding: 8px 10px; font-size: 13.5px; font-family: inherit; color: var(--ink); background: #fff; width: 100%; }
    .lv-input:focus, .lv-select:focus { outline: 2px solid var(--gold-soft); border-color: var(--gold); }

    .lv-chip-row { display: flex; gap: 8px; }
    .lv-chip { border: 1px solid var(--hairline); background: #fff; padding: 7px 16px; border-radius: 20px; font-size: 12.5px; font-weight: 600; cursor: pointer; color: var(--slate); font-family: inherit; }
    .lv-chip.active-yes { background: var(--forest); border-color: var(--forest); color: #fff; }
    .lv-chip.active-no { background: var(--red); border-color: var(--red); color: #fff; }

    .lv-tx-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
    .lv-tx-table th { text-align: left; font-size: 10px; text-transform: uppercase; color: var(--slate); padding: 6px 4px; border-bottom: 1px solid var(--ink); }
    .lv-tx-table td { padding: 8px 4px; border-bottom: 1px solid var(--hairline); vertical-align: middle; }
    .lv-tx-table input[type=number] { width: 90px; }
    .lv-tx-check { display: flex; align-items: center; justify-content: center; }
    .lv-tx-check input { width: 16px; height: 16px; }

    .lv-file-drop { border: 1.5px dashed var(--hairline); border-radius: 8px; padding: 16px; text-align: center; cursor: pointer; background: var(--paper); }
    .lv-file-drop:hover { border-color: var(--gold); }
    .lv-file-drop input { display: none; }
    .lv-file-name { font-size: 12.5px; color: var(--forest); font-weight: 600; margin-top: 6px; }

    .lv-summary { position: sticky; top: 20px; background: var(--ink); color: #F5F1E8; border-radius: 10px; padding: 22px; }
    .lv-summary-eyebrow { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--gold-soft); letter-spacing: .05em; }
    .lv-summary-name { font-family: 'Manrope', sans-serif; font-size: 18px; margin: 4px 0 16px 0; }
    .lv-progress-line { display: flex; justify-content: space-between; font-size: 12.5px; padding: 7px 0; border-bottom: 1px solid rgba(255,255,255,.12); }
    .lv-progress-bar-track { background: rgba(255,255,255,.15); border-radius: 6px; height: 6px; width: 100%; overflow: hidden; margin-top: 20px; }
    .lv-progress-bar-fill { background: var(--gold); height: 100%; border-radius: 6px; }
    .lv-progress-total { text-align: center; margin-top: 8px; font-size: 12px; color: rgba(245,241,232,.75); }

    .lv-doc-wrap { padding: 32px 16px; display: flex; justify-content: center; }
    .lv-doc { background: #fff; width: 100%; max-width: 780px; padding: 48px; border: 1px solid var(--hairline); position: relative; }
    .lv-doc-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid var(--ink); padding-bottom: 18px; margin-bottom: 24px; }
    .lv-doc-title { font-family: 'Manrope', sans-serif; font-size: 22px; font-weight: 700; margin: 0; }
    .lv-doc-sub { font-size: 12px; color: var(--slate); margin-top: 4px; }
    .lv-stamp { border: 2px solid var(--red); color: var(--red); border-radius: 6px; padding: 8px 14px; transform: rotate(-4deg); text-align: center; flex-shrink: 0; }
    .lv-stamp .t1 { font-size: 11px; font-weight: 700; letter-spacing: .04em; }
    .lv-stamp .t2 { font-size: 8.5px; letter-spacing: .05em; }

    .lv-doc-section { margin-bottom: 22px; }
    .lv-doc-section h4 { font-family: 'Manrope', sans-serif; font-size: 14.5px; border-bottom: 1px solid var(--hairline); padding-bottom: 6px; margin-bottom: 10px; }
    .lv-doc-row { display: flex; justify-content: space-between; gap: 16px; font-size: 12.5px; padding: 5px 0; }
    .lv-doc-row .q { color: var(--slate); max-width: 62%; }
    .lv-doc-row .a { font-weight: 600; text-align: right; }
    .lv-doc-row .a.empty { color: #B5504F; font-weight: 400; font-style: italic; }

    .lv-empty { text-align: center; padding: 60px 20px; color: var(--slate); }
    .lv-list-table { width: 100%; border-collapse: collapse; }
    .lv-list-table th { text-align: left; font-size: 11px; text-transform: uppercase; color: var(--slate); border-bottom: 1px solid var(--hairline); padding: 8px 6px; }
    .lv-list-table td { padding: 10px 6px; border-bottom: 1px solid var(--hairline); font-size: 13px; }

    .lv-thanks { max-width: 560px; margin: 80px auto; text-align: center; padding: 0 20px; }
    .lv-thanks .mark { width: 56px; height: 56px; border-radius: 50%; background: var(--forest); color: #fff; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; font-size: 26px; }
    .lv-thanks h1 { font-family: 'Manrope', sans-serif; font-size: 24px; margin-bottom: 10px; }
    .lv-thanks p { color: var(--slate); font-size: 14px; }

    .lv-login { max-width: 360px; margin: 100px auto; text-align: center; padding: 0 20px; }
    .lv-login h1 { font-family: 'Manrope', sans-serif; font-size: 20px; margin-bottom: 16px; }

    @media print {
      .lv-no-print { display: none !important; }
      .lv-root { background: #fff !important; }
      .lv-doc-wrap { padding: 0; }
      .lv-doc { border: none; box-shadow: none; max-width: 100%; padding: 0; }
    }
  `}</style>
);

/* ------------------------------------------------------------------ */
/*  Componentes reutilizables                                           */
/* ------------------------------------------------------------------ */

export function CompletBadge({ pct }) {
  const color = pct === 100 ? "var(--forest)" : pct === 0 ? "var(--slate)" : "var(--gold)";
  return (
    <span className="lv-badge" style={{ color, borderColor: color }}>
      {pct}% diligenciado
    </span>
  );
}

export function Field({ label, children }) {
  return (
    <div className="lv-field">
      <label>{label}</label>
      {children}
    </div>
  );
}

export function YesNo({ label, value, onChange }) {
  return (
    <Field label={label}>
      <div className="lv-chip-row">
        <button type="button" className={`lv-chip ${value === true ? "active-yes" : ""}`} onClick={() => onChange(value === true ? null : true)}>Sí</button>
        <button type="button" className={`lv-chip ${value === false ? "active-no" : ""}`} onClick={() => onChange(value === false ? null : false)}>No</button>
      </div>
    </Field>
  );
}

export function Card({ title, eyebrow, pct, children }) {
  return (
    <div className="lv-card">
      <div className="lv-eyebrow">{eyebrow}</div>
      <div className="lv-card-title">
        <span>{title}</span>
        {pct !== undefined && <CompletBadge pct={pct} />}
      </div>
      {children}
    </div>
  );
}

export function FileDrop({ label, file, onChange }) {
  return (
    <Field label={label}>
      <label className="lv-file-drop">
        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => onChange(e.target.files?.[0] || null)} />
        {file ? <div className="lv-file-name">✓ {file.name}</div> : <div style={{ fontSize: 12.5, color: "var(--slate)" }}>Click para adjuntar (PDF o imagen)</div>}
      </label>
    </Field>
  );
}

export function Select1a100({ value, onChange, placeholder = "—" }) {
  return (
    <select className="lv-select" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{placeholder}</option>
      {Array.from({ length: 100 }, (_, i) => i + 1).map((n) => (
        <option key={n} value={n}>{n}</option>
      ))}
    </select>
  );
}

/* ------------------------------------------------------------------ */
/*  Formulario: Revisoría Fiscal                                        */
/* ------------------------------------------------------------------ */

export function RevisoriaForm({ data, setData }) {
  const set = (section, patch) => setData((d) => ({ ...d, [section]: { ...d[section], ...patch } }));

  return (
    <>
      <Card title="Datos generales" eyebrow="Sección 1" pct={sectionCompleteness(data.generales)}>
        <div className="lv-grid2">
          <Field label="Nombre de la empresa"><input className="lv-input" value={data.generales.empresa} onChange={(e) => set("generales", { empresa: e.target.value })} /></Field>
          <Field label="Giro / industria"><input className="lv-input" value={data.generales.giro} onChange={(e) => set("generales", { giro: e.target.value })} /></Field>
          <Field label="Principales servicios o productos"><input className="lv-input" value={data.generales.principalesServicios} onChange={(e) => set("generales", { principalesServicios: e.target.value })} /></Field>
          <Field label="Fecha de inicio de operaciones"><input type="date" className="lv-input" value={data.generales.fechaInicioOperaciones} onChange={(e) => set("generales", { fechaInicioOperaciones: e.target.value })} /></Field>
          <Field label="Número de sucursales"><input type="number" className="lv-input" value={data.generales.numSucursales} onChange={(e) => set("generales", { numSucursales: e.target.value })} /></Field>
          <Field label="Subsidiarias o afiliadas"><input className="lv-input" value={data.generales.subsidiarias} onChange={(e) => set("generales", { subsidiarias: e.target.value })} /></Field>
          <Field label="Grupo de NIIF al que pertenece">
            <select className="lv-select" value={data.generales.grupoNiif} onChange={(e) => set("generales", { grupoNiif: e.target.value })}>
              <option value="">Seleccionar…</option>
              <option value="1">Grupo 1</option>
              <option value="2">Grupo 2 (Pymes)</option>
              <option value="3">Grupo 3 (Microempresas)</option>
            </select>
          </Field>
        </div>
      </Card>

      <Card title="Volumen de cuentas y transacciones" eyebrow="Sección 2" pct={sectionCompleteness(data.cuentas)}>
        <div className="lv-grid2">
          <Field label="Número de clientes"><input type="number" className="lv-input" value={data.cuentas.numClientesCxC} onChange={(e) => set("cuentas", { numClientesCxC: e.target.value })} /></Field>
          <Field label="Facturas de venta emitidas por mes (promedio)"><input type="number" className="lv-input" value={data.cuentas.facturasVentaMensuales} onChange={(e) => set("cuentas", { facturasVentaMensuales: e.target.value })} /></Field>
        </div>
        <Field label="Notas sobre volumen de transacciones">
          <textarea className="lv-input" rows={2} value={data.cuentas.notas} onChange={(e) => set("cuentas", { notas: e.target.value })} placeholder="Ej: cuentas por pagar, inventarios, nómina detallada, activos fijos…" />
        </Field>
      </Card>

      <Card title="Situación fiscal" eyebrow="Sección 3" pct={sectionCompleteness(data.fiscal)}>
        <p className="lv-card-sub">Últimos períodos revisados por auditores fiscales</p>
        <div className="lv-grid2">
          <Field label="Retención en la fuente — mes / año">
            <div style={{ display: "flex", gap: 8 }}>
              <input className="lv-input" placeholder="Mes" value={data.fiscal.retencionFuenteMes} onChange={(e) => set("fiscal", { retencionFuenteMes: e.target.value })} />
              <input className="lv-input" placeholder="Año" value={data.fiscal.retencionFuenteAnio} onChange={(e) => set("fiscal", { retencionFuenteAnio: e.target.value })} />
            </div>
          </Field>
          <Field label="Impuesto a la renta — mes / año">
            <div style={{ display: "flex", gap: 8 }}>
              <input className="lv-input" placeholder="Mes" value={data.fiscal.rentaMes} onChange={(e) => set("fiscal", { rentaMes: e.target.value })} />
              <input className="lv-input" placeholder="Año" value={data.fiscal.rentaAnio} onChange={(e) => set("fiscal", { rentaAnio: e.target.value })} />
            </div>
          </Field>
          <Field label="IVA — mes / año">
            <div style={{ display: "flex", gap: 8 }}>
              <input className="lv-input" placeholder="Mes" value={data.fiscal.ivaMes} onChange={(e) => set("fiscal", { ivaMes: e.target.value })} />
              <input className="lv-input" placeholder="Año" value={data.fiscal.ivaAnio} onChange={(e) => set("fiscal", { ivaAnio: e.target.value })} />
            </div>
          </Field>
          <Field label="Retenciones de ICA — mes / año">
            <div style={{ display: "flex", gap: 8 }}>
              <input className="lv-input" placeholder="Mes" value={data.fiscal.icaMes} onChange={(e) => set("fiscal", { icaMes: e.target.value })} />
              <input className="lv-input" placeholder="Año" value={data.fiscal.icaAnio} onChange={(e) => set("fiscal", { icaAnio: e.target.value })} />
            </div>
          </Field>
        </div>
        <Field label="Otros períodos / observaciones">
          <input className="lv-input" value={data.fiscal.otrosRevisiones} onChange={(e) => set("fiscal", { otrosRevisiones: e.target.value })} />
        </Field>

        <p className="lv-card-sub" style={{ marginTop: 10 }}>Resultado de revisiones fiscales</p>
        <YesNo label="¿Está calificada como gran contribuyente?" value={data.fiscal.granContribuyente} onChange={(v) => set("fiscal", { granContribuyente: v })} />
        <YesNo label="¿Se han presentado recursos de reclamación y/o apelación ante la DIAN?" value={data.fiscal.recursosDian} onChange={(v) => set("fiscal", { recursosDian: v })} />
        <YesNo label="¿Se ha solicitado aplazamiento y/o fraccionamiento de deudas tributarias?" value={data.fiscal.aplazamientoDeudas} onChange={(v) => set("fiscal", { aplazamientoDeudas: v })} />
        <YesNo label="¿Existen pérdidas tributarias arrastrables?" value={data.fiscal.perdidasTributarias} onChange={(v) => set("fiscal", { perdidasTributarias: v })} />
        {data.fiscal.perdidasTributarias && (
          <Field label="¿En qué? (renta, IVA, etc.)"><input className="lv-input" value={data.fiscal.perdidasDetalle} onChange={(e) => set("fiscal", { perdidasDetalle: e.target.value })} /></Field>
        )}
        <YesNo label="¿Realiza operaciones gravadas y no gravadas por IVA?" value={data.fiscal.operacionesGravadasNoGravadas} onChange={(v) => set("fiscal", { operacionesGravadasNoGravadas: v })} />
      </Card>

      <Card title="Personal" eyebrow="Sección 4" pct={sectionCompleteness(data.personal)}>
        <div className="lv-grid2">
          <Field label="Empleados con vinculación directa"><input type="number" className="lv-input" value={data.personal.empleadosDirecta} onChange={(e) => set("personal", { empleadosDirecta: e.target.value })} /></Field>
          <Field label="Empleados con vinculación indirecta"><input type="number" className="lv-input" value={data.personal.empleadosIndirecta} onChange={(e) => set("personal", { empleadosIndirecta: e.target.value })} /></Field>
          <Field label="Personal en el equipo contable"><input type="number" className="lv-input" value={data.personal.equipoContable} onChange={(e) => set("personal", { equipoContable: e.target.value })} /></Field>
        </div>
        <Field label="Notas sobre el equipo contable">
          <textarea className="lv-input" rows={2} value={data.personal.notasEquipoContable} onChange={(e) => set("personal", { notasEquipoContable: e.target.value })} />
        </Field>
      </Card>

      <Card title="Información administrativa y financiera" eyebrow="Sección 5" pct={sectionCompleteness(data.financiera)}>
        <Field label="Moneda en la que informa">
          <div className="lv-chip-row">
            <button type="button" className={`lv-chip ${data.financiera.moneda === "pesos" ? "active-yes" : ""}`} onClick={() => set("financiera", { moneda: "pesos" })}>Pesos</button>
            <button type="button" className={`lv-chip ${data.financiera.moneda === "dolares" ? "active-yes" : ""}`} onClick={() => set("financiera", { moneda: "dolares" })}>Dólares</button>
          </div>
        </Field>
        <p className="lv-card-sub">Ventas anuales</p>
        <div className="lv-grid2">
          <Field label="Locales — proyectado año actual"><input type="number" className="lv-input" value={data.financiera.ventasLocalesProyectado} onChange={(e) => set("financiera", { ventasLocalesProyectado: e.target.value })} /></Field>
          <Field label="Exportaciones — proyectado año actual"><input type="number" className="lv-input" value={data.financiera.ventasExportProyectado} onChange={(e) => set("financiera", { ventasExportProyectado: e.target.value })} /></Field>
          <Field label="Locales — año anterior"><input type="number" className="lv-input" value={data.financiera.ventasLocalesAnterior} onChange={(e) => set("financiera", { ventasLocalesAnterior: e.target.value })} /></Field>
          <Field label="Exportaciones — año anterior"><input type="number" className="lv-input" value={data.financiera.ventasExportAnterior} onChange={(e) => set("financiera", { ventasExportAnterior: e.target.value })} /></Field>
        </div>
        <p className="lv-card-sub">Resultado contable del ejercicio (utilidad / pérdida)</p>
        <div className="lv-grid2">
          <Field label="Año actual"><input type="number" className="lv-input" value={data.financiera.resultadoActual} onChange={(e) => set("financiera", { resultadoActual: e.target.value })} /></Field>
          <Field label="Año anterior"><input type="number" className="lv-input" value={data.financiera.resultadoAnterior} onChange={(e) => set("financiera", { resultadoAnterior: e.target.value })} /></Field>
          <Field label="Activo fijo (cantidad de ítems)"><input type="number" className="lv-input" value={data.financiera.activoFijoCantidad} onChange={(e) => set("financiera", { activoFijoCantidad: e.target.value })} /></Field>
        </div>
        <Field label="Notas financieras adicionales">
          <textarea className="lv-input" rows={2} value={data.financiera.notas} onChange={(e) => set("financiera", { notas: e.target.value })} />
        </Field>
      </Card>

      <div className="lv-card">
        <div className="lv-card-title">Observaciones adicionales</div>
        <textarea className="lv-input" rows={3} value={data.notasGenerales} onChange={(e) => setData((d) => ({ ...d, notasGenerales: e.target.value }))} />
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Formulario: Precios de Transferencia                                */
/* ------------------------------------------------------------------ */

export function PTForm({ data, setData }) {
  const set = (section, patch) => setData((d) => ({ ...d, [section]: { ...d[section], ...patch } }));
  const setTx = (id, patch) => setData((d) => ({ ...d, transacciones: d.transacciones.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));

  const txCompleteness = useMemo(() => {
    const marked = data.transacciones.filter((t) => t.ingresos || t.egresos).length;
    return data.transacciones.length ? Math.round((marked / data.transacciones.length) * 100) : 0;
  }, [data.transacciones]);

  return (
    <>
      <Card title="Información general" eyebrow="Sección 1" pct={sectionCompleteness(data.general)}>
        <div className="lv-grid2">
          <Field label="Nombre de la compañía"><input className="lv-input" value={data.general.nombreCompania} onChange={(e) => set("general", { nombreCompania: e.target.value })} /></Field>
          <Field label="Documento de identificación tributaria (NIT)"><input className="lv-input" value={data.general.nit} onChange={(e) => set("general", { nit: e.target.value })} /></Field>
          <Field label="Compañía o entidad (tipo)"><input className="lv-input" value={data.general.tipoEntidad} onChange={(e) => set("general", { tipoEntidad: e.target.value })} /></Field>
          <Field label="Actividad económica principal"><input className="lv-input" value={data.general.actividadEconomica} onChange={(e) => set("general", { actividadEconomica: e.target.value })} /></Field>
          <Field label="Período o año a evaluar"><input className="lv-input" value={data.general.periodoEvaluar} onChange={(e) => set("general", { periodoEvaluar: e.target.value })} /></Field>
        </div>
      </Card>

      <Card title="Consideraciones generales" eyebrow="Sección 2" pct={sectionCompleteness(data.consideraciones)}>
        <Field label="¿Con cuántas partes vinculadas realizó transacciones? (dato aproximado)">
          <input type="number" className="lv-input" value={data.consideraciones.numPartesVinculadas} onChange={(e) => set("consideraciones", { numPartesVinculadas: e.target.value })} />
        </Field>
        <YesNo label="¿Ha realizado operaciones con partes vinculadas domiciliadas en Colombia?" value={data.consideraciones.opDomiciliadas} onChange={(v) => set("consideraciones", { opDomiciliadas: v })} />
        <YesNo label="¿Ha realizado operaciones con partes vinculadas no domiciliadas en Colombia?" value={data.consideraciones.opNoDomiciliadas} onChange={(v) => set("consideraciones", { opNoDomiciliadas: v })} />
        <YesNo label="¿Ha realizado operaciones con paraísos fiscales?" value={data.consideraciones.opParaisosFiscales} onChange={(v) => set("consideraciones", { opParaisosFiscales: v })} />
        <YesNo label="¿La empresa consolida estados financieros o es parte de una consolidación?" value={data.consideraciones.consolidaEEFF} onChange={(v) => set("consideraciones", { consolidaEEFF: v })} />
        <YesNo label="¿La empresa ha desarrollado la evaluación del test de beneficio?" value={data.consideraciones.testBeneficio} onChange={(v) => set("consideraciones", { testBeneficio: v })} />
      </Card>

      <Card title="Transacciones con vinculados" eyebrow="Sección 3" pct={txCompleteness}>
        <p className="lv-card-sub">Marca Ingresos y/o Egresos según corresponda. En servicios, indica la cantidad aproximada de contratos u operaciones.</p>
        <table className="lv-tx-table">
          <thead>
            <tr>
              <th>Tipo de transacción</th>
              <th style={{ textAlign: "center" }}>Ingresos</th>
              <th>Cantidad (ingresos)</th>
              <th style={{ textAlign: "center" }}>Egresos</th>
              <th>Cantidad (egresos)</th>
            </tr>
          </thead>
          <tbody>
            {data.transacciones.map((t) => (
              <tr key={t.id}>
                <td>{t.nombre}</td>
                <td className="lv-tx-check"><input type="checkbox" checked={t.ingresos} onChange={(e) => setTx(t.id, { ingresos: e.target.checked })} /></td>
                <td><Select1a100 value={t.cantidadIngresos} onChange={(v) => setTx(t.id, { cantidadIngresos: v })} /></td>
                <td className="lv-tx-check"><input type="checkbox" checked={t.egresos} onChange={(e) => setTx(t.id, { egresos: e.target.checked })} /></td>
                <td><Select1a100 value={t.cantidadEgresos} onChange={(v) => setTx(t.id, { cantidadEgresos: v })} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Field label="Detalle de 'Otros' u observaciones sobre las transacciones">
          <textarea className="lv-input" rows={2} value={data.otrosDetalle} onChange={(e) => setData((d) => ({ ...d, otrosDetalle: e.target.value }))} />
        </Field>
      </Card>

      <div className="lv-card">
        <div className="lv-card-title">Observaciones adicionales</div>
        <textarea className="lv-input" rows={3} value={data.notasGenerales} onChange={(e) => setData((d) => ({ ...d, notasGenerales: e.target.value }))} />
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Resumen (solo para el panel interno)                                */
/* ------------------------------------------------------------------ */

export function Row({ q, a }) {
  const empty = a === "" || a === null || a === undefined || a === "N/D";
  return (
    <div className="lv-doc-row">
      <span className="q">{q}</span>
      <span className={`a ${empty ? "empty" : ""}`}>{empty ? "Sin diligenciar" : String(a)}</span>
    </div>
  );
}

export function RevisoriaSummary({ data }) {
  const g = data.generales, c = data.cuentas, f = data.fiscal, p = data.personal, fin = data.financiera;
  return (
    <>
      <div className="lv-doc-section">
        <h4>1. Datos generales</h4>
        <Row q="Empresa" a={g.empresa} />
        <Row q="Giro / industria" a={g.giro} />
        <Row q="Principales servicios o productos" a={g.principalesServicios} />
        <Row q="Fecha de inicio de operaciones" a={g.fechaInicioOperaciones && fmtDate(g.fechaInicioOperaciones)} />
        <Row q="Número de sucursales" a={g.numSucursales} />
        <Row q="Subsidiarias o afiliadas" a={g.subsidiarias} />
        <Row q="Grupo de NIIF" a={g.grupoNiif && `Grupo ${g.grupoNiif}`} />
      </div>
      <div className="lv-doc-section">
        <h4>2. Volumen de cuentas y transacciones</h4>
        <Row q="Número de clientes" a={c.numClientesCxC} />
        <Row q="Facturas de venta mensuales (promedio)" a={c.facturasVentaMensuales} />
        <Row q="Notas" a={c.notas} />
      </div>
      <div className="lv-doc-section">
        <h4>3. Situación fiscal</h4>
        <Row q="Retención en la fuente revisada" a={f.retencionFuenteMes && `${f.retencionFuenteMes} ${f.retencionFuenteAnio}`} />
        <Row q="Impuesto a la renta revisado" a={f.rentaMes && `${f.rentaMes} ${f.rentaAnio}`} />
        <Row q="IVA revisado" a={f.ivaMes && `${f.ivaMes} ${f.ivaAnio}`} />
        <Row q="ICA revisado" a={f.icaMes && `${f.icaMes} ${f.icaAnio}`} />
        <Row q="Gran contribuyente" a={yn(f.granContribuyente)} />
        <Row q="Recursos de reclamación/apelación ante la DIAN" a={yn(f.recursosDian)} />
        <Row q="Aplazamiento/fraccionamiento de deudas tributarias" a={yn(f.aplazamientoDeudas)} />
        <Row q="Pérdidas tributarias arrastrables" a={f.perdidasTributarias ? `Sí — ${f.perdidasDetalle || "sin detalle"}` : yn(f.perdidasTributarias)} />
        <Row q="Operaciones gravadas y no gravadas por IVA" a={yn(f.operacionesGravadasNoGravadas)} />
      </div>
      <div className="lv-doc-section">
        <h4>4. Personal</h4>
        <Row q="Empleados con vinculación directa" a={p.empleadosDirecta} />
        <Row q="Empleados con vinculación indirecta" a={p.empleadosIndirecta} />
        <Row q="Personal en el equipo contable" a={p.equipoContable} />
        <Row q="Notas del equipo contable" a={p.notasEquipoContable} />
      </div>
      <div className="lv-doc-section">
        <h4>5. Información administrativa y financiera</h4>
        <Row q="Moneda" a={fin.moneda === "pesos" ? "Pesos" : "Dólares"} />
        <Row q="Ventas locales — proyectado" a={fin.ventasLocalesProyectado} />
        <Row q="Ventas exportación — proyectado" a={fin.ventasExportProyectado} />
        <Row q="Ventas locales — año anterior" a={fin.ventasLocalesAnterior} />
        <Row q="Ventas exportación — año anterior" a={fin.ventasExportAnterior} />
        <Row q="Resultado contable — año actual" a={fin.resultadoActual} />
        <Row q="Resultado contable — año anterior" a={fin.resultadoAnterior} />
        <Row q="Activo fijo (cantidad de ítems)" a={fin.activoFijoCantidad} />
        <Row q="Notas financieras" a={fin.notas} />
      </div>
      {data.notasGenerales && (
        <div className="lv-doc-section">
          <h4>Observaciones adicionales</h4>
          <p style={{ fontSize: 13 }}>{data.notasGenerales}</p>
        </div>
      )}
    </>
  );
}

export function PTSummary({ data }) {
  const g = data.general, c = data.consideraciones;
  const activas = data.transacciones.filter((t) => t.ingresos || t.egresos);
  return (
    <>
      <div className="lv-doc-section">
        <h4>1. Información general</h4>
        <Row q="Nombre de la compañía" a={g.nombreCompania} />
        <Row q="NIT" a={g.nit} />
        <Row q="Tipo de entidad" a={g.tipoEntidad} />
        <Row q="Actividad económica principal" a={g.actividadEconomica} />
        <Row q="Período a evaluar" a={g.periodoEvaluar} />
      </div>
      <div className="lv-doc-section">
        <h4>2. Consideraciones generales</h4>
        <Row q="Partes vinculadas (aprox.)" a={c.numPartesVinculadas} />
        <Row q="Operaciones con vinculadas domiciliadas" a={yn(c.opDomiciliadas)} />
        <Row q="Operaciones con vinculadas no domiciliadas" a={yn(c.opNoDomiciliadas)} />
        <Row q="Operaciones con paraísos fiscales" a={yn(c.opParaisosFiscales)} />
        <Row q="Consolida estados financieros" a={yn(c.consolidaEEFF)} />
        <Row q="Evaluación del test de beneficio realizada" a={yn(c.testBeneficio)} />
      </div>
      <div className="lv-doc-section">
        <h4>3. Transacciones con vinculados</h4>
        {activas.length === 0 ? (
          <p style={{ fontSize: 12.5, color: "var(--slate)" }}>Sin diligenciar</p>
        ) : (
          activas.map((t) => (
            <Row
              key={t.id}
              q={t.nombre}
              a={`${t.ingresos ? `Ingresos${t.cantidadIngresos ? ` (${t.cantidadIngresos})` : ""}` : ""}${t.ingresos && t.egresos ? " / " : ""}${t.egresos ? `Egresos${t.cantidadEgresos ? ` (${t.cantidadEgresos})` : ""}` : ""}`}
            />
          ))
        )}
        {data.otrosDetalle && <Row q="Detalle de 'Otros' / observaciones" a={data.otrosDetalle} />}
      </div>
      {data.notasGenerales && (
        <div className="lv-doc-section">
          <h4>Observaciones adicionales</h4>
          <p style={{ fontSize: 13 }}>{data.notasGenerales}</p>
        </div>
      )}
    </>
  );
}
