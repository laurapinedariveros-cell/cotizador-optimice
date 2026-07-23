import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function POST(req) {
  const { path } = await req.json();
  if (!path) {
    return Response.json({ error: "Falta la ruta del archivo" }, { status: 400 });
  }
  const { data, error } = await supabaseAdmin.storage.from("adjuntos").createSignedUrl(path, 600);
  if (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json({ url: data.signedUrl });
}
