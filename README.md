# Cómo publicar tu app (paso a paso, sin experiencia previa)

Vas a hacer 3 cosas, en este orden:
1. Crear la base de datos (Supabase) — donde se guardan los cuestionarios.
2. Subir el código a GitHub — donde vive el proyecto.
3. Conectar GitHub con Vercel — quien publica la página web.

No necesitas instalar nada en tu computador para esto.

---

## Paso 1 — Crear la base de datos en Supabase (gratis)

1. Entra a https://supabase.com y crea una cuenta (puedes usar tu cuenta de Google).
2. Click en **"New project"**.
   - Ponle un nombre, ej. `cotizador-optimice`.
   - Crea una contraseña para la base de datos (guárdala, no la vuelves a ver).
   - Elige la región más cercana (ej. `South America (São Paulo)`).
   - Click en **"Create new project"** y espera 1-2 minutos.
3. Cuando cargue, ve al menú izquierdo → **SQL Editor** → **New query**.
4. Pega exactamente esto y dale click a **RUN**:

```sql
create table intakes (
  id text primary key,
  tipo text,
  empresa text,
  fecha date,
  data jsonb,
  created_at timestamp with time zone default now()
);

alter table intakes enable row level security;

create policy "acceso interno equipo" on intakes
  for all
  using (true)
  with check (true);
```

   Esto crea la tabla donde se guardan los cuestionarios, y le da permiso para que la app lea y escriba en ella.
   (Nota: esta política deja la tabla abierta a cualquiera que tenga el link de tu app — está bien para una
   herramienta interna que no vas a compartir públicamente, pero no publiques ese link fuera de tu equipo.)

5. Ve al menú izquierdo → **Project Settings** (ícono de engranaje) → **API**.
   Ahí vas a ver dos datos que necesitas copiar:
   - **Project URL** (algo como `https://xxxxx.supabase.co`)
   - **anon public key** (una clave larga de letras y números)

   Guárdalos, los usas en el Paso 3.

---

## Paso 2 — Subir el proyecto a GitHub

1. Entra a https://github.com y crea una cuenta (gratis).
2. Click en el botón verde **"New"** (nuevo repositorio).
   - Nombre: `cotizador-optimice` (o el que quieras).
   - Déjalo en **Private** (privado) si prefieres que no sea público.
   - Click **"Create repository"**.
3. En la página que aparece, busca el link **"uploading an existing file"**.
4. Verás una zona para arrastrar archivos. **Arrastra ahí TODA la carpeta** del proyecto que te
   voy a entregar (la carpeta completa, no un archivo por uno — la mayoría de navegadores permite
   arrastrar la carpeta completa).
5. Abajo, escribe un mensaje como "Primera versión" y click en **"Commit changes"**.

Listo, tu código ya está en GitHub.

---

## Paso 3 — Publicar en Vercel

1. Entra a https://vercel.com y crea una cuenta usando **"Continue with GitHub"** (así quedan conectados automáticamente).
2. Click en **"Add New..." → "Project"**.
3. Busca el repositorio que subiste (`cotizador-optimice`) y click en **"Import"**.
4. Antes de darle a "Deploy", abre la sección **"Environment Variables"** y agrega estas dos
   (ya son tus valores reales de Supabase, cópialos tal cual):

   | Name                            | Value                                                        |
   |----------------------------------|---------------------------------------------------------------|
   | `NEXT_PUBLIC_SUPABASE_URL`       | `https://frxriiffwayyserinjww.supabase.co`                    |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | `sb_publishable_1nKktaj3Y3xYb5O5eJzJ2Q_xsnarWoe`               |

5. Click en **"Deploy"** y espera 1-2 minutos.
6. Cuando termine, Vercel te da un link como `https://cotizador-optimice.vercel.app` — ese es el link
   que compartes con tu equipo comercial. Ábrelo, prueba a diligenciar un cuestionario y verifica que
   aparezca en "Guardados".

---

## Después de publicarlo

- Cada vez que quieras cambiar algo del formulario, se edita el código y se vuelve a subir a GitHub —
  Vercel lo vuelve a publicar solo, automáticamente.
- Si quieres agregar el cuestionario de Outsourcing o cambiar preguntas, lo más fácil es pedírmelo
  en esta misma conversación y yo te entrego los archivos actualizados para volver a subir.
