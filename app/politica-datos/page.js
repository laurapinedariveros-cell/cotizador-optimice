import { POLITICA_DATOS_TEXTO } from "../../lib/politicaDatos";

function Parrafos({ texto }) {
  const bloques = texto.split("\n\n");
  return bloques.map((bloque, i) => {
    const esTitulo = /^\d+\.\s/.test(bloque.trim()) && bloque.trim().length < 80;
    if (esTitulo) {
      return (
        <h3 key={i} style={{ fontFamily: "'Manrope', sans-serif", fontSize: 17, color: "#404041", marginTop: 28, marginBottom: 10, borderBottom: "1px solid #DCE1E8", paddingBottom: 6 }}>
          {bloque.trim()}
        </h3>
      );
    }
    return (
      <p key={i} style={{ fontSize: 13.5, lineHeight: 1.7, color: "#33383a", marginBottom: 14, whiteSpace: "pre-line" }}>
        {bloque.trim()}
      </p>
    );
  });
}

export default function PoliticaDatosPage() {
  const [titulo, ...resto] = POLITICA_DATOS_TEXTO.split("\n\n");
  return (
    <div style={{ background: "#FAFAF8", minHeight: "100vh", padding: "40px 20px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');`}</style>
      <div style={{ maxWidth: 720, margin: "0 auto", background: "#fff", border: "1px solid #DCE1E8", borderRadius: 10, padding: "40px 48px", fontFamily: "'Inter', sans-serif" }}>
        <a href="/" style={{ fontSize: 12.5, color: "#404041", textDecoration: "none", fontWeight: 600 }}>← Volver al formulario</a>
        <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 22, color: "#404041", marginTop: 18, marginBottom: 4 }}>
          Política de Tratamiento y Protección de Datos Personales
        </h1>
        <p style={{ fontSize: 12.5, color: "#5C7089", marginBottom: 24 }}>OPTIMICE COLOMBIA S.A.S. · Vigente desde el 23 de julio de 2026</p>
        <Parrafos texto={resto.join("\n\n")} />
      </div>
    </div>
  );
}
