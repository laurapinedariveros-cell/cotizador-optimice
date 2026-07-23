export async function POST(req) {
  const body = await req.json();
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_EMAIL;

  if (!apiKey || !to) {
    // Si no se configuró el correo, simplemente no se envía nada (no rompe el formulario del cliente).
    return Response.json({ ok: false, skipped: true });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Cotizador <onboarding@resend.dev>",
        to: [to],
        subject: `Nuevo cuestionario recibido — ${body.empresa || "Cliente"}`,
        html: `
          <p>Se recibió un nuevo cuestionario de <b>${body.tipo || ""}</b>.</p>
          <p><b>Empresa:</b> ${body.empresa || ""}</p>
          <p><b>Contacto:</b> ${body.contacto || ""} — ${body.correo || ""}</p>
          <p>Entra al panel interno (/admin) para ver el detalle completo y los documentos adjuntos.</p>
        `,
      }),
    });
    const data = await res.json();
    return Response.json({ ok: res.ok, data });
  } catch (e) {
    console.error(e);
    return Response.json({ ok: false, error: String(e) });
  }
}
