"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { Styles, fmtDate, RevisoriaSummary, PTSummary } from "./QuestionnaireShared";

async function loadSaved() {
  const { data, error } = await supabase.from("intakes").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("No se pudo cargar", error);
    return [];
  }
  return data;
}

async function deleteSaved(id) {
  const { error } = await supabase.from("intakes").delete().eq("id", id);
  if (error) console.error("No se pudo eliminar", error);
}

async function abrirAdjunto(path) {
  if (!path) return;
  try {
    const res = await fetch("/api/signed-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });
    const data = await res.json();
    if (data.url) window.open(data.url, "_blank");
    else alert("No se pudo generar el enlace del documento.");
  } catch (e) {
    alert("No se pudo abrir el documento.");
  }
}

export default function AdminPanel() {
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState([]);
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("lista"); // lista | detalle

  useEffect(() => {
    (async () => {
      setSaved(await loadSaved());
      setReady(true);
    })();
  }, []);

  const refrescar = useCallback(async () => {
    setSaved(await loadSaved());
  }, []);

  const abrir = (r) => {
    setSelected(r);
    setView("detalle");
  };

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar este cuestionario?")) return;
    await deleteSaved(id);
    refrescar();
  };

  if (!ready) return <div className="lv-root" style={{ padding: 40 }}>Cargando…</div>;

  return (
    <div className="lv-root">
      <Styles />

      <div className="lv-topbar">
        <div className="lv-brand">
          <img src="/logo.png" alt="Optimice Colombia" style={{ height: 34, width: "auto" }} />
          <div>
            <div className="lv-brand-name">Panel interno</div>
            <div className="lv-brand-sub">Solo para tu equipo — cuestionarios recibidos</div>
          </div>
        </div>
        <div className="lv-tabs">
          <button className={`lv-tab ${view === "lista" ? "active" : ""}`} onClick={() => setView("lista")}>Recibidos ({saved.length})</button>
          <button className={`lv-tab ${view === "detalle" ? "active" : ""}`} onClick={() => setView("detalle")} disabled={!selected}>Detalle</button>
          <button className="lv-tab" onClick={refrescar}>Actualizar</button>
        </div>
      </div>

      {view === "lista" && (
        <div className="lv-layout" style={{ gridTemplateColumns: "1fr" }}>
          <div className="lv-card">
            <div className="lv-card-title">Cuestionarios recibidos de clientes</div>
            {saved.length === 0 ? (
              <div className="lv-empty">Todavía no ha llegado ningún cuestionario.</div>
            ) : (
              <table className="lv-list-table">
                <thead><tr><th>Empresa</th><th>Tipo</th><th>Fecha</th><th>Documentos</th><th></th></tr></thead>
                <tbody>
                  {saved.map((r) => (
                    <tr key={r.id}>
                      <td>{r.empresa}</td>
                      <td>{r.tipo === "revisoria" ? "Revisoría Fiscal" : "Precios de Transferencia"}</td>
                      <td>{fmtDate(r.fecha)}</td>
                      <td>
                        {r.camara_comercio_path && <span className="lv-badge" style={{ color: "var(--forest)", borderColor: "var(--forest)", marginRight: 4 }}>Cám. Comercio</span>}
                        {r.estados_financieros_path && <span className="lv-badge" style={{ color: "var(--forest)", borderColor: "var(--forest)" }}>Edos. Financieros</span>}
                        {!r.camara_comercio_path && !r.estados_financieros_path && <span style={{ color: "var(--slate)", fontSize: 12 }}>—</span>}
                      </td>
                      <td style={{ display: "flex", gap: 6 }}>
                        <button className="lv-btn ghost" onClick={() => abrir(r)}>Ver resumen</button>
                        <button className="lv-btn danger" onClick={() => eliminar(r.id)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {view === "detalle" && selected && (
        <div className="lv-doc-wrap">
          <div className="lv-doc">
            <div className="lv-no-print" style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 16 }}>
              <button className="lv-btn ghost" onClick={() => setView("lista")}>Volver a la lista</button>
              <button className="lv-btn gold" onClick={() => window.print()}>Imprimir / Guardar como PDF</button>
            </div>

            <div className="lv-doc-header">
              <div>
                <p className="lv-doc-title">Resumen del cuestionario</p>
                <p className="lv-doc-sub">{selected.tipo === "revisoria" ? "Revisoría Fiscal" : "Precios de Transferencia"} · {selected.empresa}</p>
              </div>
              <div className="lv-stamp">
                <div className="t1">USO INTERNO</div>
                <div className="t2">No enviar al cliente</div>
              </div>
            </div>

            <div className="lv-doc-section">
              <h4>Contacto</h4>
              <div className="lv-doc-row"><span className="q">Nombre</span><span className="a">{selected.data?.contacto?.nombre || "Sin diligenciar"}</span></div>
              <div className="lv-doc-row"><span className="q">Correo</span><span className="a">{selected.data?.contacto?.correo || "Sin diligenciar"}</span></div>
              <div className="lv-doc-row"><span className="q">Teléfono</span><span className="a">{selected.data?.contacto?.telefono || "Sin diligenciar"}</span></div>
            </div>

            <div className="lv-doc-section">
              <h4>Documentos adjuntos</h4>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button className="lv-btn ghost" disabled={!selected.camara_comercio_path} onClick={() => abrirAdjunto(selected.camara_comercio_path)}>
                  {selected.camara_comercio_path ? "Ver Cámara de Comercio" : "Sin Cámara de Comercio"}
                </button>
                <button className="lv-btn ghost" disabled={!selected.estados_financieros_path} onClick={() => abrirAdjunto(selected.estados_financieros_path)}>
                  {selected.estados_financieros_path ? "Ver Estados Financieros" : "Sin Estados Financieros"}
                </button>
              </div>
            </div>

            {selected.tipo === "revisoria" ? <RevisoriaSummary data={selected.data} /> : <PTSummary data={selected.data} />}
          </div>
        </div>
      )}
    </div>
  );
}
