"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  Styles, Field, FileDrop, RevisoriaForm, PTForm,
  emptyRevisoria, emptyPT, sectionCompleteness,
} from "./QuestionnaireShared";

async function subirArchivo(file, tipo, campo) {
  if (!file) return null;
  const path = `${tipo}/${Date.now()}-${campo}-${file.name}`.replace(/\s+/g, "_");
  const { error } = await supabase.storage.from("adjuntos").upload(path, file);
  if (error) {
    console.error("Error subiendo archivo", error);
    return null;
  }
  return path;
}

export default function ClientIntakeForm() {
  const [view, setView] = useState("landing"); // landing | form | thanks
  const [tipo, setTipo] = useState(null);
  const [revisoria, setRevisoria] = useState(emptyRevisoria());
  const [pt, setPT] = useState(emptyPT());
  const [camaraComercio, setCamaraComercio] = useState(null);
  const [estadosFinancieros, setEstadosFinancieros] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState("");

  const currentData = tipo === "revisoria" ? revisoria : pt;
  const setCurrentData = tipo === "revisoria" ? setRevisoria : setPT;
  const empresaNombre = tipo === "revisoria" ? revisoria.generales.empresa : pt.general.nombreCompania;

  const overallPct =
    tipo === "revisoria"
      ? Math.round(
          ["generales", "cuentas", "fiscal", "personal", "financiera"]
            .map((s) => sectionCompleteness(revisoria[s]))
            .reduce((a, b) => a + b, 0) / 5
        )
      : tipo === "pt"
      ? Math.round(
          (sectionCompleteness(pt.general) +
            sectionCompleteness(pt.consideraciones) +
            Math.round((pt.transacciones.filter((t) => t.ingresos || t.egresos).length / pt.transacciones.length) * 100)) /
            3
        )
      : 0;

  const startNew = (t) => {
    setTipo(t);
    setRevisoria(emptyRevisoria());
    setPT(emptyPT());
    setCamaraComercio(null);
    setEstadosFinancieros(null);
    setView("form");
  };

  const enviar = async () => {
    setEnviando(true);
    setErrorEnvio("");
    try {
      const id = `${tipo === "revisoria" ? "RF" : "PT"}-${Date.now()}`;
      const [camaraPath, estadosPath] = await Promise.all([
        subirArchivo(camaraComercio, tipo, "camara-comercio"),
        subirArchivo(estadosFinancieros, tipo, "estados-financieros"),
      ]);

      const registro = {
        id,
        tipo,
        empresa: empresaNombre || "Sin nombre",
        fecha: new Date().toISOString().slice(0, 10),
        data: currentData,
        camara_comercio_path: camaraPath,
        estados_financieros_path: estadosPath,
      };

      const { error } = await supabase.from("intakes").insert(registro);
      if (error) throw error;

      fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: tipo === "revisoria" ? "Revisoría Fiscal" : "Precios de Transferencia",
          empresa: empresaNombre || "Sin nombre",
          contacto: currentData.contacto?.nombre || "",
          correo: currentData.contacto?.correo || "",
        }),
      }).catch(() => {});

      setView("thanks");
    } catch (e) {
      console.error(e);
      setErrorEnvio("No pudimos enviar la información. Por favor intenta de nuevo en unos minutos.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="lv-root">
      <Styles />

      <div className="lv-topbar">
        <div className="lv-brand">
          <img src="/logo.png" alt="Optimice Colombia" style={{ height: 38, width: "auto" }} />
          <div>
            <div className="lv-brand-sub" style={{ marginTop: 4 }}>Cuestionario para propuesta de servicios</div>
          </div>
        </div>
      </div>

      {view === "landing" && (
        <div className="lv-landing">
          <div style={{ display: "inline-block", background: "var(--gold-soft)", color: "var(--forest)", fontSize: 11.5, fontWeight: 700, padding: "6px 14px", borderRadius: 20, marginBottom: 16 }}>
            Cotización en un máximo de 1 a 2 días hábiles
          </div>
          <h1>Solicitud de cotización de servicios</h1>
          <p>
            Seleccione el servicio requerido y diligencie el cuestionario correspondiente. La información suministrada
            será utilizada para elaborar su propuesta de manera precisa y oportuna.
          </p>
          <div className="lv-choice-grid">
            <button className="lv-choice" onClick={() => startNew("revisoria")}>
              <div className="eyebrow">Servicio 1</div>
              <h3>Revisoría fiscal</h3>
              <p>Información societaria, contable y de la situación fiscal de la compañía.</p>
              <div style={{ marginTop: 14, fontSize: 12.5, fontWeight: 700, color: "var(--forest)" }}>Iniciar cuestionario →</div>
            </button>
            <button className="lv-choice" onClick={() => startNew("pt")}>
              <div className="eyebrow">Servicio 2</div>
              <h3>Precios de transferencia</h3>
              <p>Operaciones con vinculados económicos y partes relacionadas.</p>
              <div style={{ marginTop: 14, fontSize: 12.5, fontWeight: 700, color: "var(--forest)" }}>Iniciar cuestionario →</div>
            </button>
          </div>
          <p style={{ marginTop: 28, fontSize: 12 }}>
            Tiempo estimado de diligenciamiento: 5 a 10 minutos. La información suministrada es de uso exclusivo para la elaboración de la propuesta.
          </p>
        </div>
      )}

      {view === "form" && tipo && (
        <div className="lv-layout">
          <div>
            <div className="lv-card">
              <div className="lv-card-title">Datos de contacto</div>
              <div className="lv-grid2">
                <Field label="Nombre de quien diligencia">
                  <input
                    className="lv-input"
                    value={currentData.contacto.nombre}
                    onChange={(e) => setCurrentData((d) => ({ ...d, contacto: { ...d.contacto, nombre: e.target.value } }))}
                  />
                </Field>
                <Field label="Correo electrónico">
                  <input
                    type="email"
                    className="lv-input"
                    value={currentData.contacto.correo}
                    onChange={(e) => setCurrentData((d) => ({ ...d, contacto: { ...d.contacto, correo: e.target.value } }))}
                  />
                </Field>
                <Field label="Teléfono">
                  <input
                    className="lv-input"
                    value={currentData.contacto.telefono}
                    onChange={(e) => setCurrentData((d) => ({ ...d, contacto: { ...d.contacto, telefono: e.target.value } }))}
                  />
                </Field>
              </div>
            </div>

            {tipo === "revisoria" ? <RevisoriaForm data={revisoria} setData={setRevisoria} /> : <PTForm data={pt} setData={setPT} />}

            <div className="lv-card">
              <div className="lv-card-title">Documentos</div>
              <p className="lv-card-sub">Adjunta los siguientes documentos si los tienes a la mano (opcional, pero nos ayuda a preparar tu propuesta más rápido).</p>
              <div className="lv-grid2">
                <FileDrop label="Cámara de Comercio" file={camaraComercio} onChange={setCamaraComercio} />
                <FileDrop label="Últimos estados financieros" file={estadosFinancieros} onChange={setEstadosFinancieros} />
              </div>
            </div>
          </div>

          <div className="lv-summary">
            <div className="lv-summary-eyebrow">{tipo === "revisoria" ? "REVISORÍA FISCAL" : "PRECIOS DE TRANSFERENCIA"}</div>
            <div className="lv-summary-name">{empresaNombre || "Tu empresa"}</div>
            <div className="lv-progress-total">{overallPct}% del cuestionario completado</div>
            <div className="lv-progress-bar-track"><div className="lv-progress-bar-fill" style={{ width: `${overallPct}%` }} /></div>

            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,.15)" }}>
              <p style={{ fontSize: 10.5, color: "rgba(245,241,232,.7)", lineHeight: 1.6, marginBottom: 10 }}>
                <b>Aviso de tratamiento de información.</b> La información solicitada en este formulario será utilizada
                exclusivamente para conocer las necesidades del solicitante y elaborar una cotización de nuestros
                servicios. Los datos suministrados pueden ser aproximados y serán tratados de manera confidencial y
                con absoluta discreción. Al diligenciar y enviar este formulario, el titular autoriza a OPTIMICE
                COLOMBIA S.A.S. para recolectar, almacenar, consultar y utilizar la información proporcionada
                únicamente con fines comerciales, de contacto y elaboración de la cotización solicitada, de acuerdo
                con nuestra{" "}
                <a href="/politica-datos" target="_blank" rel="noreferrer" style={{ color: "var(--gold)" }}>
                  Política de Tratamiento de Datos Personales
                </a>.
              </p>
              <label style={{ display: "flex", gap: 8, fontSize: 11.5, color: "#F5F1E8", alignItems: "flex-start", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={currentData.autorizaTratamiento}
                  onChange={(e) => setCurrentData((d) => ({ ...d, autorizaTratamiento: e.target.checked }))}
                  style={{ marginTop: 2 }}
                />
                He leído y autorizo el tratamiento de mis datos personales para la elaboración y envío de la cotización.
              </label>
            </div>

            <button
              className="lv-btn gold"
              style={{ width: "100%", marginTop: 16 }}
              onClick={enviar}
              disabled={enviando || !empresaNombre || !currentData.autorizaTratamiento}
            >
              {enviando ? "Enviando…" : "Enviar información"}
            </button>
            {!empresaNombre && <div style={{ fontSize: 11.5, color: "rgba(245,241,232,.7)", marginTop: 8 }}>Escribe el nombre de la empresa para poder enviar.</div>}
            {empresaNombre && !currentData.autorizaTratamiento && <div style={{ fontSize: 11.5, color: "rgba(245,241,232,.7)", marginTop: 8 }}>Marca la autorización de datos para poder enviar.</div>}
            {errorEnvio && <div style={{ fontSize: 12, color: "#F2B8B5", marginTop: 8 }}>{errorEnvio}</div>}
          </div>
        </div>
      )}

      {view === "thanks" && (
        <div className="lv-thanks">
          <div className="mark">✓</div>
          <h1>¡Gracias! Recibimos tu información</h1>
          <p>Nuestro equipo va a revisar los datos que compartiste y te contactaremos pronto con una propuesta ajustada a tu empresa.</p>
        </div>
      )}

      <footer style={{ maxWidth: 900, margin: "40px auto 0 auto", padding: "20px 20px 32px 20px", borderTop: "1px solid var(--hairline)", textAlign: "center" }}>
        <p style={{ fontSize: 11.5, color: "var(--slate)", lineHeight: 1.6, margin: 0 }}>
          OPTIMICE COLOMBIA S.A.S. protege sus datos personales de acuerdo con la Ley 1581 de 2012 y su{" "}
          <a href="/politica-datos" target="_blank" rel="noreferrer" style={{ color: "var(--ink)", fontWeight: 600 }}>
            Política de Tratamiento y Protección de Datos Personales
          </a>
          . Para consultas, actualizaciones, correcciones, revocatorias o solicitudes de eliminación de información,
          puede comunicarse al correo{" "}
          <a href="mailto:info@optimice.com.co" style={{ color: "var(--ink)", fontWeight: 600 }}>info@optimice.com.co</a>.
        </p>
      </footer>
    </div>
  );
}
