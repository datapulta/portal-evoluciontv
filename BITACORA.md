# BITÁCORA DE DESARROLLO Y REGISTRO HISTÓRICO DE CAMBIOS — PANEL EVOLUCIÓN TV

Este documento constituye la memoria técnica y bitácora cronológica exhaustiva de todas las intervenciones, sesiones de arquitectura, cambios de código, rediseños UX/UI y despliegues del proyecto **Panel Evolución TV** (Portal web Nuxt v4 + Ghost CMS API + Señal en vivo).

---

## Sesión 40 — 2026-11-24 · Reordenamiento Editorial en Página de Lectura de Artículos

**Rama activa**: `feat/layout-editorial-articulo`
**Autorización**: `plan_reordenamiento_editorial_articulo.md` (Proceed button, §4.4 AGENTS.md)

### Diagnóstico y Requerimiento
El cliente solicitó explícitamente reestructurar el orden visual de la página de lectura de artículos (`app/pages/noticias/[slug].vue`) para reflejar la maqueta periodística tradicional:
1. **Título arriba** (con categoría, fecha y tiempo de lectura).
2. **Primer párrafo de la nota** (bajada / copete con tipografía destacada) y barra de autor con botones para compartir.
3. **FOTO** (imagen destacada en medio, con proporción 16:9 y esquinas redondeadas).
4. **Segundo párrafo y resto de la nota** (cuerpo editorial con tipografía Newsreader).

### Cambios realizados
- **`app/pages/noticias/[slug].vue`**:
  - Reubicado el bloque `<div v-if="article.feature_image">` inmediatamente después de `<header>` y antes de `<div v-html="formattedArticleHtml">`.
  - Sincronizado el esqueleto de precarga (`skeleton animate-pulse`) para reflejar exactamente esta misma secuencia visual.
  - Ajustados espaciados verticales (`mb-7 md:mb-8` y `mb-8 md:mb-10`) para una transición limpia entre el encabezado, la fotografía y el cuerpo.

### Verificación
- `npm run build`: compilación limpia en 14.2s con Nitro y Vue 3.5.46.
- Comprobación en `http://localhost:3005/noticias/evolucion-tv-regresa-a-sus-origenes-con-portal-oficial`:
  - Secuencia de renderizado verificada en DOM:
    1. Título H1 (`Position: 21058`)
    2. Primer párrafo / Excerpt (`Position: 21332`)
    3. Barra de autor (`Position: 22153`)
    4. Foto destacada 16:9 (`Position: 23992`)
    5. Segundo párrafo / Cuerpo (`Position: 24413`)
  - Comprobado que el orden visual es exacto al solicitado: `Title < P1 < Author < FOTO < P2` (True).

---

## Sesión 39 — 2026-11-24 · Banner Institucional Oficial entre Header y Artículos

**Rama activa**: `feat/banner-institucional-portada`
**Autorización**: `plan_banner_institucional_portada.md` (Proceed button, §4.4 AGENTS.md)

### Diagnóstico y Requerimiento
Integrar el banner gráfico oficial de Evolución TV (*"ETV - La Casa de la Escena Independiente"*, `1024×376 px`) en la portada (`index.vue`), colocado entre la barra de navegación/cabecera y el inicio de la sección de artículos del Hero, optimizado tanto para dispositivos móviles como para pantallas de escritorio.

### Cambios realizados
- **`public/banner-escena-independiente.jpg` [NEW]**:
  - Incorporación del archivo gráfico oficial optimizado (`143 KB`, `1024×376 px`, proporción panorámica `2.72:1`).
- **`app/components/BannerSpot.vue` [NEW]**:
  - Componente de banner responsivo con `aspect-[2.72/1]`, contenedor `max-w-7xl mx-auto`, esquinas redondeadas `rounded-xl sm:rounded-2xl md:rounded-3xl`, borde sutil y sombra suave con elevación en hover.
  - Atributos `loading="eager"` y `fetchpriority="high"` para carga instantánea al estar en el pliegue superior.
- **`app/pages/index.vue`**:
  - Integrado `<BannerSpot />` en la parte superior del template, inmediatamente antes de `<section>` del Hero editorial.

### Verificación
- `npm run build`: compilación limpia en 15.4s con Nitro y Vue 3.5.46.
- Comprobación en `http://localhost:3005/`:
  - En desktop (`1280px+`): banner centrado y perfectamente alineado con las columnas de noticias.
  - En mobile (`360px`): escalado proporcionado sin desborde horizontal ni necesidad de scroll lateral.
  - Recurso estático `/banner-escena-independiente.jpg`: respuesta HTTP 200 OK (`image/jpeg`, 143 KB).

---

## Sesión 38 — 2026-11-24 · Soporte de Artículos Destacados ("Feature this post") de Ghost CMS en Portada

**Rama activa**: `feat/articulos-destacados-ghost`
**Autorización**: `plan_articulos_destacados_ghost_cms.md` (Proceed button, §4.4 AGENTS.md)

### Diagnóstico y Causa Raíz
La asignación de la nota principal en el Hero del Home se realizaba de manera estrictamente posicional por fecha de publicación (`articles[0]`), ignorando el interruptor editorial *"Feature this post"* (`featured: true`) de Ghost CMS. Además, las notas secundarias se obtenían con `slice(1)`, lo que generaba riesgo de duplicidad si una nota destacada no era la más reciente.

### Cambios realizados
- **`app/composables/useNews.ts`**:
  - Parámetro `order?: string` añadido a `getArticles()`, fijando por defecto `featured desc,published_at desc` en las consultas a la Content API de Ghost.
  - Ordenamiento prioritario equivalente en artículos de respaldo (`BACKUP_ARTICLES`).
- **`app/pages/index.vue`**:
  - `featuredArticle`: selección reactiva de la primera nota con `featured === true` (o la más reciente como fallback).
  - `remainingArticles`: filtrado dinámico de artículos excluyendo el ID del artículo destacado para garantizar cero notas duplicadas en la portada.
  - `secondaryArticles`: extracción de las notas secundarias del subconjunto restante.
  - `allArticles` & `loadMoreArticles`: deduplicación estricta incluyendo el ID del artículo principal.
  - Distintivo visual en el Hero: etiqueta dinámica `Destacado` cuando `featured === true` o `Nota Principal` cuando es cronológica.
- **`app/components/HeaderNav.vue`**:
  - Ticker de *Última Hora* fijado con `order: 'published_at desc'` para reflejar siempre eventos estrictamente cronológicos.
- **`app/pages/noticias/[slug].vue`**:
  - Implementado `formattedArticleHtml`: omisión automática del primer `<p>` del cuerpo del artículo cuando coincide sustancialmente con el extracto/bajada del encabezado (`article.excerpt`), evitando lecturas redundantes y permitiendo que el cuerpo comience directamente con el segundo párrafo.

### Verificación
- `npm run build`: compilación limpia en 15.3s con Nitro y Vue 3.5.46.
- Comprobación en `http://localhost:3005/`:
  - Artículo *"Evolución TV regresa a sus orígenes con portal oficial"* posicionado en el Hero con distintivo `Destacado`, sin duplicarse en las tarjetas secundarias ni en la cuadrícula inferior.
  - En la página de artículo individual `/noticias/...`, el párrafo inicial *"Luego de 13 años..."* se muestra una sola vez en el encabezado y el cuerpo inicia fluidamente con el segundo párrafo (*"Con fotogalerías, coberturas en vivo..."*).

---

## Sesión 37 — 2026-11-24 · Restauración de Texto Original Íntegro en Ghost CMS

**Rama activa**: `feat/setup-nuxt4-ghost-cms`
**Autorización**: `plan_restaurar_texto_original_articulo_ghost.md` (Proceed button, §4.4 AGENTS.md)

### Diagnóstico y Causa Raíz
En la publicación inicial del artículo *"Evolución TV regresa a sus orígenes con portal oficial"* (`6b06218fc506c700013dceba`), se incorporaron subtítulos `<h2>`, citas destacadas `<blockquote>` y paráfrasis que no formaban parte de la redacción oficial original de la dirección editorial de Evolución TV.

### Cambios realizados
- **Ghost CMS Admin API (`/ghost/api/admin/posts/6b06218fc506c700013dceba/?source=html`)**:
  - Actualizado el cuerpo HTML del post sustituyéndolo de forma literal por los 5 párrafos exactos provistos por el usuario, sin subtítulos intermedios ni citas añadidas.
  - Conservado título oficial, tags (`EvolucioNotas`, `Más bandas`) y featured image intactos.

### Verificación
- Content API (`/ghost/api/content/posts/slug/...`): Comprobada entrega de los 5 párrafos limpios sin etiquetas `<h2>`.
- SSR local (`http://localhost:3005/noticias/evolucion-tv-regresa-a-sus-origenes-con-portal-oficial`): Renderizado verificado con `200 OK`.

---

## Sesión 36 — 2026-11-24 · Página de Contacto Musical, Dominio @evoluciontv.mx, Anti-Spam y Titular Oficial

**Rama activa**: `feat/setup-nuxt4-ghost-cms`
**Autorización**: `plan_pagina_contacto.md`, `plan_enfoque_musical_bandas_contacto.md`, `plan_dominio_mx_y_proteccion_antispam_emails.md`, `plan_ocultar_menu_horizontal_en_movil.md`, `plan_titular_contacto_evolucion_tv.md` (Proceed button, §4.4 AGENTS.md)

### Cambios realizados
- **`app/pages/contacto.vue` [NEW]**: Página de contacto orientada a bandas independientes (ska, rock, reggae), prensa y coberturas, sin formularios vulnerables, con botones de copiado y canales oficiales.
- **Protección Anti-Spam (`app/components/ProtectedEmail.vue` [NEW])**:
  - Dominio migrado a `@evoluciontv.mx` en todos los archivos de la plataforma.
  - Ofuscación en cliente (`atob`) y honeypot invisible para crawlers.
- **`app/components/HeaderNav.vue`**: Navegación horizontal secundaria oculta en móvil (`hidden md:block`) para priorizar el menú hamburguesa.
- **Titular de Contacto**: Actualizado `h1` en `/contacto` a *"Contacto y Enlace con Evolución TV"*.

---

## Sesión 35 — 2026-11-24 · Actualización de Texto Institucional en "Quiénes Somos"

**Rama activa**: `feat/setup-nuxt4-ghost-cms` (pendiente autorización de merge a `main` y deploy)
**Autorización**: `plan_actualizacion_texto_quienes_somos.md` (Proceed button, §4.4 AGENTS.md)

### Cambios realizados
- **`app/pages/quienes-somos.vue`**:
  - Actualizada la descripción principal y meta `description` sustituyendo *"proyecto de televisión en internet"* por **"medio de comunicación independiente"** y *"programas en vivo"* por **"sesiones en vivo"**.

### Verificación
- `npm run build` y validación HTTP local en `http://localhost:3005/quienes-somos`.

---

## Sesión 34 — 2026-11-24 · Ajuste Responsive Móvil y Barra de Navegación Visible

**Rama activa**: `feat/setup-nuxt4-ghost-cms` (pendiente autorización de merge a `main` y deploy)
**Autorización**: `plan_ajuste_responsive_movil.md` (Proceed button, §4.4 AGENTS.md)

### Diagnóstico
En pantallas móviles de `360px`, la fila principal de `HeaderNav.vue` y el input `min-w-[280px]` del boletín en `index.vue` desbordaban hacia la derecha recortando el botón `☰`, mientras la barra `<nav>` permanecía oculta (`hidden md:block`).

### Cambios realizados
- **`app/components/BrandMark.vue` y `app/components/HeaderNav.vue`**:
  - Logo, tipografía (`text-lg sm:text-2xl`), padding y botones compactados en móvil para encajar con holgura desde `320px`.
  - Barra `<nav>` visible también en móvil con desplazamiento horizontal táctil (`overflow-x-auto no-scrollbar`) y centrada en desktop (`md:justify-center`).
- **`app/pages/index.vue` y `app/app.vue`**:
  - Input del boletín ajustado a `w-full sm:w-auto sm:min-w-[280px]` y contenedor `p-5 sm:p-8 md:p-12`.
  - Añadido `overflow-x-clip` al wrapper raíz en `app.vue`.

### Verificación
- `npm run build` y comprobación SSR local en `http://localhost:3005/`.

---

## Sesión 33 — 2026-11-24 · Imagen Destacada al Inicio y Encabezado Inferior en Artículos

**Rama activa**: `feat/setup-nuxt4-ghost-cms` (pendiente autorización de merge a `main` y deploy)
**Autorización**: `plan_orden_imagen_y_titulo_articulo.md` (Proceed button, §4.4 AGENTS.md)

### Cambios realizados
- **`app/composables/useNews.ts`**: Añadido `feature_image_alt?: string` en `interface Article`.
- **`app/pages/noticias/[slug].vue`**:
  - Movida la imagen destacada al inicio del artículo y colocados título `<h1>`, categoría, fecha, extracto y firma del autor debajo.
  - Ajustada la proporción de imagen de `md:aspect-[21/9]` a `aspect-[16/10] md:aspect-[16/9]` evitando recortes agresivos.
  - Añadidos botones rápidos de compartir (`Copiar`, `WhatsApp`, `X`) junto al autor y sincronizado el skeleton de carga con el nuevo orden visual.

### Verificación
- `npm run build` y comprobación SSR local en `http://localhost:3005/noticias/...`.

---

## Sesión 32 — 2026-11-24 · Corrección de Cajas del Hero y Ticker Rotativo "Última Hora"

**Rama activa**: `feat/setup-nuxt4-ghost-cms` (pendiente autorización de merge a `main` y deploy)
**Autorización**: `plan_correccion_cajas_portada_y_ticker.md` (Proceed button, §4.4 AGENTS.md)

### Diagnóstico
1. En `app/pages/index.vue`, `items-stretch` + `flex-1` + `justify-between h-full` obligaba a las 2 tarjetas secundarias del Hero a estirarse verticalmente (~335 px) generando huecos vacíos entre el extracto y la fecha.
2. En `app/components/HeaderNav.vue`, la barra *Última Hora* consultaba solo 1 noticia estática sin rotación ni adaptación móvil/desktop.

### Cambios realizados
- **`app/pages/index.vue`**:
  - Reemplazado `items-stretch` por `items-start`, eliminado `flex-1` y `justify-between h-full` de las tarjetas secundarias (altura natural compacta y sin huecos vacíos).
  - Equilibrada la columna lateral `lg:col-span-4` con un bloque compacto **"Señal Digital 24/7"** (control directo de Evolución Radio con pista en vivo, enlace a Cabina TV y chips de secciones).
- **`app/components/HeaderNav.vue`**:
  - Ticker rotativo de hasta 5 noticias recientes cada `4.5s` con `<Transition mode="out-in">` vertical suave, pausa en `:hover`/`:focus-in` y controles `‹` `1/N` `›` responsivos en móvil y desktop.

### Verificación
- `npm run build` y comprobación SSR local en `http://localhost:3005/`.

---

## Sesión 31 — 2026-11-24 · Emblema Oficial Extraído (`logo-etv.png` y `BrandMark.vue`)

**Rama activa**: `feat/setup-nuxt4-ghost-cms` (pendiente autorización de merge a `main` y deploy)
**Autorización**: `plan_logo_isotipo_etv.md` / `plan_logo_emblema_oficial.md` (Proceed button, §4.4 AGENTS.md)

### Cambios realizados
- **`public/logo-etv.png` [NEW]**: Extracción limpia del emblema oficial (triángulo Play azul `#01ABE8` + siglas `ETV` naranja `#FE9903` con su contorno blanco) mediante segmentación C# `LockBits` con canal alfa transparente, omitiendo el fondo negro y el texto inferior.
- **`app/components/BrandMark.vue`**: Reemplazo de la caja cuadrada y SVG por `<img src="/logo-etv.png">` directo en cabecera y pie de página.
- **`public/favicon.svg`**: Sincronizado incrustando el emblema oficial transparente sin tocar `nuxt.config.ts`.

### Verificación
- Inspección visual directa de `public/logo-etv.png` (`619×663`).
- `npm run build` y validación HTTP local (`200 OK` en `/`, `/logo-etv.png` y `/favicon.svg`).

---

## Sesión 30 — 2026-11-24 · Rediseño del Isotipo de Marca (`BrandMark.vue`)

**Rama activa**: `feat/setup-nuxt4-ghost-cms` (pendiente autorización de merge a `main` y deploy)
**Autorización**: `plan_logo_isotipo_etv.md` (Proceed button, §4.4 AGENTS.md)

### Diagnóstico
El isotipo previo invertía la jerarquía cromática del logo oficial (fondo azul con triángulo naranja y contorno grueso) y usaba un ícono genérico duplicado en cabecera y footer.

### Cambios realizados
- **`app/components/BrandMark.vue` [NEW]**: Componente reutilizable (`size: 'sm' | 'md'`) con triángulo Play Azul `#01ABE8` detrás y pantalla/señal de TV digital Naranja `#FE9903` al frente con ondas blancas nítidas sobre contenedor adaptativo claro/oscuro.
- **`app/components/HeaderNav.vue` y `app/components/FooterSection.vue`**: Reemplazo del SVG duplicado por `<BrandMark />`.
- **`public/favicon.svg`**: Sincronizado con el nuevo isotipo de TV + Play sin fondo negro opaco.

### Verificación
- `npm run build` y validación HTTP local en `http://localhost:3005/`.

---

## Sesión 29 — 2026-11-24 · Identidad Cromática Oficial (Naranja `#FE9903` y Azul `#01ABE8`)

**Rama activa**: `feat/setup-nuxt4-ghost-cms` (pendiente autorización de merge a `main` y deploy)
**Autorización**: `plan_paleta_naranja_azul_logo.md` (Proceed button, §4.4 AGENTS.md)

### Origen de datos
Muestreo hexadecimal directo del logotipo oficial de Evolución TV (omitiendo el negro de fondo del JPG):
- **Naranja ETV (`etv-orange-500`)**: `#FE9903` (`RGB 254, 153, 3`)
- **Azul ETV (`etv-blue-500`)**: `#01ABE8` (`RGB 1, 171, 232`)

### Cambios realizados (19 archivos)
1. **`app/assets/css/main.css` y `public/favicon.svg`**:
   - Definición de las escalas completas `etv-orange-*` y `etv-blue-*` en `@theme` de Tailwind CSS v4 (`selection:bg-etv-orange-500`, `outline-etv-blue-500`).
   - Nuevo isotipo vectorial limpio en `public/favicon.svg` usando `#01ABE8` y `#FE9903` sin fondo negro opaco.
2. **Componentes globales** (`HeaderNav.vue`, `FooterSection.vue`, `RadioPlayer.vue`, `NewsCard.vue`, `SocialLinks.vue`, `LiveStreamSection.vue`):
   - Sustitución completa de la paleta roja anterior por Naranja `#FE9903` (marca, pestaña activa, botones principales con `text-neutral-950` accesible, hover editorial) y Azul `#01ABE8` (play, streaming en vivo, radio y focos).
3. **Páginas y fallbacks** (`index.vue`, `radio.vue`, `en-vivo.vue`, `noticias/[slug].vue`, `categoria/[slug].vue`, `buscar.vue`, `quienes-somos.vue`, `codigo-etica.vue`, `privacidad.vue`, `categories.get.ts`, `useNews.ts`):
   - Migración integral de gradientes, badges, barras de progreso, reglas CSS `.prose-news` y colores de respaldo.

### Verificación
- Escaneo de residuos rojos (`red-*`, `#dc2626`, `#ef4444`, `#991b1b`, `rgba(220`) → `ZERO_RED_LEFTOVERS`.
- `npm run build` → ✅ 0 errores (`13.9s`), CSS compilado verificado con `#fe9903` y `#01abe8`.
- Verificación HTTP local (`http://localhost:3005`) → ✅ `200 OK` en todas las rutas y `favicon.svg`.

---

## Sesión 28 — 2026-11-24 · Optimización Integral UX y UI de la Plataforma

**Rama activa**: `feat/setup-nuxt4-ghost-cms` (pendiente autorización de merge a `main` y deploy)
**Autorización**: `plan_mejoras_ux_ui_plataforma.md` (Proceed button, §4.4 AGENTS.md)

### Diagnóstico y alcance
Auditoría completa de los 17 archivos en `app/` y endpoints en `server/`, integrando además dos observaciones visuales del operador en desktop (`/radio`): centrado del menú de navegación y eliminación total de espacios vacíos en la cabina del reproductor de radio.

### Cambios realizados

1. **Backend Nitro & Utilidades**:
   - `server/utils/ghostAdmin.ts`: helper compartido para configuración y JWT HMAC-SHA256 de Ghost Admin API (eliminando duplicación en `categories.get.ts`).
   - `server/api/radio/nowplaying.get.ts`: proxy con caché 15s a AzuraCast (`r3.webia.studio/api/nowplaying/estereo_fonik`) exponiendo canción, artista, carátula y oyentes.
   - `server/api/newsletter.post.ts`: alta real de suscriptores en Ghost Members API con etiqueta `boletin-web` y manejo de duplicados (`422`).
   - `server/api/search.get.ts`: búsqueda insensible a acentos (`NFD`) sobre posts públicos de Ghost CMS.
   - Actualizados `sitemap.xml.get.ts` y `llms.txt.get.ts` con `/codigo-etica`, `/privacidad` y `/buscar`.

2. **Tipografía, Accesibilidad y Composables**:
   - `app/app.vue` y `app/assets/css/main.css`: Google Fonts (`Plus Jakarta Sans` + `Newsreader`) configuradas vía `useHead` + `@theme` (sin modificar `nuxt.config.ts`) y anillos `:focus-visible` accesibles.
   - `app/composables/useNews.ts`: paginación real (`PaginationMeta`) y método `searchArticles`.
   - `app/composables/useRadio.ts`: polling de metadatos en vivo (`/api/radio/nowplaying`), `MediaSession` con carátula y dock minimizado por defecto en móvil (`< 640px`) sin preferencia previa.

3. **Navegación, Pie y Dock**:
   - `app/components/HeaderNav.vue`: menú de navegación centrado simétricamente en desktop (`md:flex-wrap md:justify-center`), indicador de ruta activa, barra *Última Hora* dinámica enlazada al artículo más reciente, y buscador rápido desplegable.
   - `app/components/FooterSection.vue`: ancla `id="contacto"` (`scroll-mt-32`) y enlaces reales a `/codigo-etica`, `/privacidad` y `/buscar`.
   - `app/components/RadioPlayer.vue`: carátula de pista actual en el botón Play y título en vivo actualizado.

4. **Páginas**:
   - `app/pages/radio.vue`: ultra-optimización desktop (`max-w-3xl`, cabecera integrada sin banda vacía superior, bloque Play de ancho exacto `md:w-44` eliminando huecos laterales y carátula/metadatos reales de AzuraCast).
   - `app/pages/index.vue`: fecha/autoría consistente en Hero, botón *"Cargar más noticias"* con paginación real y boletín conectado a `/api/newsletter`.
   - `app/pages/noticias/[slug].vue`: reemplazo de `sticky top-14` oculto bajo el header por breadcrumbs limpios, barra superior de progreso de lectura, cuerpo `font-serif`, skeleton loader, compartir en WhatsApp/X/Facebook/nativo y botón *"Volver arriba"*.
   - `app/pages/categoria/[slug].vue`: skeletons de carga y paginación *"Cargar más artículos"*.
   - `app/pages/en-vivo.vue`: corrección de `sticky top-14` y rediseño transparente hacia *"Cabina Digital en Espera de Emisión"* con acceso a YouTube y Evolución Radio.
   - Nuevas páginas: `app/pages/buscar.vue`, `app/pages/codigo-etica.vue` y `app/pages/privacidad.vue`.

### Verificación
- `npm run build` → ✅ 0 errores (208 módulos cliente, 118 server).
- Verificación HTTP local (`http://localhost:3005`): `/api/radio/nowplaying`, `/api/search`, `/api/newsletter`, `/`, `/radio`, `/buscar`, `/codigo-etica`, `/privacidad`, `/en-vivo`, `/noticias/<slug>`, `/sitemap.xml` y `/llms.txt` → ✅ todos `200 OK`.

---

## Sesión 27 — 2026-11-24 · v1.0.8: Optimización UX Desktop Página /radio

**Rama activa**: `feat/setup-nuxt4-ghost-cms` → merge a `main`
**Commit**: `3e9341e` (feature) · `092ccfc` (merge main)
**Tag**: `v1.0.8`
**Autorización**: `plan_optimizacion_ux_desktop_radio.md` (Proceed button)

### Diagnóstico
La página `/radio` presentaba exceso de espacio visual en viewport desktop (≥768px) debido a paddings generosos heredados del diseño mobile-first y botones del dock flotante en posición `absolute` que generaban espacio muerto superior.

### Cambios realizados

**`app/pages/radio.vue`** (6 ajustes de clases Tailwind):
- Padding wrapper desktop: `md:py-8` → `md:py-6`
- Padding sección cabina: `md:p-12` → `md:p-10`
- Gap grid columnas: `gap-8` → `gap-6`
- Col. izquierda (botón play): `py-6 gap-5` → `py-2 gap-4`
- Col. derecha (info): `space-y-6` → `space-y-4`
- Sección social links: `pt-4 gap-4` → `pt-3 gap-3`

**`app/components/RadioPlayer.vue`** — Refactor dock expandido:
- Eliminado layout `relative` con botones en `absolute top-2 right-2`
- Nuevo layout de **2 filas**: fila 1 (play + título + acciones inline) · fila 2 (volumen ancho completo)
- Botón play reducido: `w-14 h-14` → `w-12 h-12` para proporcionar mejor con el nuevo layout
- Eliminado `pr-4` en área de texto (ya no necesario sin botones absolutos)

### Verificación
- `npm run build` → ✅ 0 errores, 201 módulos transformados
- Desplegado a producción Dokploy (`OD0duHt9W9jees8yl_TEa`)

---

## 1. Identificación y Autoría del Sistema

- **Proyecto**: Panel Evolución TV (`panel-evoluciontv`)
- **Arquitectura**: Monolito Web Fullstack (Nuxt v4 SSR, Tailwind CSS v4, Nitro Engine)
- **CMS Editorial**: Ghost CMS (`https://cms-etv.webia.studio`)
- **Infraestructura**: Dokploy VPS / Dockerfile
- **Agente de Inteligencia Artificial Responsable**: Antigravity AI (Google DeepMind)
- **Operador & Arquitecto Líder**: mexolder
- **Fecha de Inicio de Bitácora**: 23 de Noviembre de 2026

---

## 2. Registro Cronológico por Sesión

### Sesión 1 — 23 de Noviembre de 2026
**Objetivo**: Establecimiento de directrices maestras de desarrollo, gobernanza operativa de IA y preservación histórica.
- **Actividades Realizadas**:
  1. Creación del documento de reglas operativas `AGENTS.md` adaptado a Nuxt 4, Dokploy y Ghost CMS API.
  2. Integración de la compuerta de aprobación nativa mediante el botón "Proceed" / "Ejecutar Plan" de Antigravity.
  3. Inicialización de la bitácora técnica de desarrollo `BITACORA.md`.
  4. Configuración de reglas automáticas de contexto para Gemini y agentes de IA.

---

### Sesión 2 — 23 de Noviembre de 2026
**Objetivo**: Despliegue de infraestructura editorial Ghost CMS en Dokploy VPS y construcción del portal frontend en Nuxt v4.
- **Autorización**: Concedida explícitamente por el operador (`adelante`) tras presentación de diagnóstico técnico.
- **Actividades Realizadas**:
  1. **Despliegue de Ghost CMS en Dokploy VPS (`lania.webia.studio`)**:
     - Localización del proyecto oficial "Evolucion TV" (`projectId: WKovOg3IGCeA3WTJ296t7`, `environmentId: 8PDnGjjqSj7dTwFqsGp3j`).
     - Creación del servicio Compose `ghost-cms` (`composeId: hgWRvSGf6XaayU2_gEPRb`) con Docker Compose (Ghost 5-alpine + MySQL 8.0).
     - Vinculación a la red externa `dokploy-network` para comunicación con el proxy inverso Traefik.
     - Asignación de dominio `cms-etv.webia.studio` con emisión de certificado SSL Let's Encrypt automático (HTTPS 200 OK verificado).
  2. **Inicialización y Arquitectura del Portal Web en Nuxt v4 (`^4.6.4`)**:
     - Inicialización con motor Vite 8, Nitro 2.14 y Vue 3.5.
     - Integración de Tailwind CSS v4 mediante `@tailwindcss/vite` y estilos globales en `app/assets/css/main.css`.
     - Creación de componentes modulares:
       - `HeaderNav.vue`: Ticker de última hora, fecha dinámica, acceso a redacción y selector de señal en vivo.
       - `LiveStreamSection.vue`: Reproductor multimedia de televisión digital 24/7 y parrilla de programación diaria.
       - `NewsCard.vue`: Tarjeta editorial responsiva con metadatos de categoría, autor y tiempo de lectura.
       - `FooterSection.vue`: Pie institucional con principios de periodismo independiente y aviso de Fediverse / ActivityPub.
     - Implementación de `app/composables/useGhost.ts` con consumo desacoplado de la API de contenido de Ghost y datos de respaldo tipados en TypeScript.
     - Construcción del Home Page en `app/app.vue`.
  3. **Resolución de Conflictos de Puerto**:
     - Detección de colisión en el puerto local 3000 ocupado por `wslrelay.exe` (Dokploy local).
     - Reconfiguración del servidor de desarrollo de Nuxt en `nuxt.config.ts` al puerto `3005` (`devServer: { port: 3005 }`).
  4. **Preparación de Despliegue Docker**:
     - Creación de `Dockerfile` multi-stage con Node.js 22 LTS y `.dockerignore` para despliegue productivo del frontend en Dokploy.
- **Verificación Técnica**:
  - Compilación de producción exitosa (`npm run build` completado en 13.2s).
  - Servidor de desarrollo respondiendo exitosamente en `http://localhost:3005/` (HTTP 200 OK).

---

### Sesión 3 — 23 de Noviembre de 2026
**Objetivo**: Purificación de marca blanca y eliminación total de referencias visuales y técnicas de Ghost CMS en el proyecto Nuxt.
- **Autorización**: Aprobación nativa formal del plan `plan_limpieza_marcas_cms.md` mediante botón de plan / Proceed del operador (§4.4 de AGENTS.md).
- **Actividades Realizadas**:
  1. **Purificación de Interfaz Visual**:
     - Eliminación total del banner de depuración amarillo en `app/app.vue` que contenía menciones directas a Ghost CMS.
     - Actualización de badges y pie en `app/components/FooterSection.vue` a "Transmisión Digital & Cobertura en Vivo" y derechos reservados de Evolución TV.
  2. **Refactorización de Capa de Datos a Modelo Neutral**:
     - Creación de `app/composables/useNews.ts` con interfaces de dominio `Article`, `Author`, `Category` y función `useNews()`.
     - Migración de `app/components/NewsCard.vue` para consumir el tipo `Article`.
     - Eliminación del composable previo `app/composables/useGhost.ts`.
  3. **Ajuste de Zona Intocable (Autorizado)**:
     - En `nuxt.config.ts`: sustitución de `ghostApiUrl` / `ghostContentKey` por `newsApiUrl` / `newsApiKey`.
     - En `.env` y `.env.example`: migración a `NUXT_PUBLIC_NEWS_API_URL` y `NUXT_PUBLIC_NEWS_API_KEY`.
- **Verificación Técnica**:
  - Auditoría de cero coincidencias de etiquetas en plantillas visuales.
  - Compilación de producción limpia ejecutada con éxito (`npm run build` completado en 18.5s).
  - Servidor de desarrollo verificado en `http://localhost:3005/` libre de cualquier franja de aviso.

---

### Sesión 4 — 23 de Noviembre de 2026
**Objetivo**: Puesta en marcha editorial definitiva: configuración DNS en Cloudflare, emisión SSL Let's Encrypt y enlace en vivo de Ghost CMS con Nuxt v4.
- **Autorización**: Aprobación nativa formal del plan `plan_puesta_en_marcha_editorial.md` mediante botón Proceed del operador (§4.4 de AGENTS.md).
- **Actividades Realizadas**:
  1. **Configuración de Dominio en Cloudflare con Módulo Oficial Antigravity**:
     - Autenticación OAuth del CLI oficial de Cloudflare (`cf`).
     - Creación de registro DNS tipo `A` para `cms-etv.webia.studio` apuntando a `159.195.13.43` (zona `069a9614bab6db407df6503269088a0e`).
     - Configuración en modo `proxied: false` (DNS Only) para permitir la validación ACME directa de Traefik.
  2. **Emisión de Certificado SSL Let's Encrypt y Verificación de Ghost**:
     - Recarga de Traefik mediante API de Dokploy (`/api/settings.reloadTraefik`).
     - Emisión exitosa de certificado SSL por parte de Let's Encrypt (Emisor: `Let's Encrypt / YR2`, válido hasta febrero 2027).
     - Validación de respuesta HTTPS 200 OK en `https://cms-etv.webia.studio/ghost/`.
  3. **Conexión de Ghost Content API y Pipeline SSR en Nuxt v4**:
     - Recepción de Content API Key generada por el operador en el panel de redacción (`0d0973d2adbf82eee9052eb3de`).
     - Registro de clave en `.env` bajo `NUXT_PUBLIC_NEWS_API_KEY`.
     - Optimización de `app/app.vue` con `useAsyncData` para Server-Side Rendering (SSR) indexable por motores de búsqueda.
     - Refuerzo en `app/composables/useNews.ts` combinando artículos en vivo de Ghost con contenido de respaldo para mantener la cuadrícula visual completa.
- **Verificación Técnica**:
  - Petición HTTP a la API de Ghost retornando artículo en vivo *"Coming soon"*.
  - Comprobación de renderizado en `http://localhost:3005/` (SSR HTML incluye *"Coming soon"*).
  - Compilación de producción exitosa (`npm run build` completado en 14.2s).

---

### Sesión 5 — 23 de Noviembre de 2026
**Objetivo**: Habilitación del sistema de enrutamiento declarativo y visualización/lectura completa de artículos en el portal local (Nuxt 4 + Ghost CMS).
- **Autorización**: Aprobación nativa formal del plan `plan_visualizacion_y_lectura_articulos.md` mediante botón Proceed del operador (§4.4 de AGENTS.md).
- **Actividades Realizadas**:
  1. **Extensión del Composable `useNews.ts`**:
     - Implementación de `getArticleBySlug(slug: string)` para consultar artículos individuales vía Ghost Content API (`/ghost/api/content/posts/slug/${slug}/`).
     - Respaldo a `BACKUP_ARTICLES` con contenido periodístico enriquecido en formato HTML para navegación offline o notas previas a publicación.
  2. **Arquitectura de Enrutamiento Declarativo (`NuxtPage`)**:
     - Conversión de `app/app.vue` en layout contenedor maestro con `HeaderNav`, `<NuxtPage />` y `FooterSection`.
     - Creación de `app/pages/index.vue` encapsulando la portada de noticias destacadas, transmisión en vivo, cuadrícula de actualidad y boletín.
  3. **Navegación SPA y Tarjetas Editoriales**:
     - Actualización de `app/components/NewsCard.vue` y `app/pages/index.vue` sustituyendo anclas locales (`#slug`) por `<NuxtLink :to="'/noticias/' + slug">`.
  4. **Página de Lectura Individual de Artículos (`app/pages/noticias/[slug].vue`)**:
     - Titular H1 de alto impacto, fecha en español, tiempo de lectura, autor y metadatos dinámicos `useHead`.
     - Imagen destacada (*feature image*) panorámica en alta resolución.
     - Cuerpo del artículo con tipografía y estilos editoriales dedicados (`prose-news`) para párrafos, citas de bloque, encabezados y enlaces.
     - Botón de retorno rápido *"← Volver a la Portada"*.
     - Sección inferior de investigaciones y notas relacionadas.
- **Verificación Técnica**:
  - Compilación de producción exitosa con `npm run build` (0 errores en cliente, servidor y Nitro).
  - Verificación HTTP 200 OK en portada (`/`), artículo en vivo de Ghost (`/noticias/coming-soon`) y notas de respaldo (`/noticias/evolucion-tv-nueva-plataforma-digital`).
  - Validación de renderizado de contenido de Ghost (`This is Evolucion TV`) en el HTML SSR de la página de lectura.

---

### Sesión 6 — 23 de Noviembre de 2026
**Objetivo**: Enlace interactivo y directo en la imagen destacada de la Nota Principal (Hero) hacia la ruta del artículo.
- **Autorización**: Aprobación nativa formal del plan `plan_enlace_imagen_nota_principal.md` mediante botón Proceed del operador (§4.4 de AGENTS.md).
- **Actividades Realizadas**:
  1. **Navegabilidad Completa en Hero Card (`app/pages/index.vue`)**:
     - Envoltura de la imagen panorámica y gradiente protector dentro de un enlace nativo `<NuxtLink :to="'/noticias/' + featuredArticle.slug">`.
     - Inclusión de clase `cursor-pointer`, `aria-label` para accesibilidad y mantenimiento de transiciones de escala `group-hover:scale-105`.
     - Ajuste de capas de eventos para que los clics sobre cualquier sector de la imagen trasladen directamente a la vista del artículo.
- **Verificación Técnica**:
  - Compilación de producción limpia ejecutada con `npm run build` (13.4s, 0 errores).
  - Verificación de renderizado de `href="/noticias/coming-soon"` envolviendo la imagen destacada en `http://localhost:3005/`.

---

### Sesión 7 — 23 de Noviembre de 2026
**Objetivo**: Integración de la Ghost Admin API y automatización de creación/publicación de artículos programáticos desde Node.js hacia Ghost CMS.
- **Autorización**: Aprobación nativa formal del plan `plan_creacion_articulos_ghost_admin_api.md` mediante botón Proceed del operador (§4.4 de AGENTS.md) y suministro de `Admin API Key`.
- **Actividades Realizadas**:
  1. **Autenticación Criptográfica JWT Nativa (HS256)**:
     - Desarrollo del generador de tokens en `scripts/publish-article.mjs` utilizando `node:crypto` sin dependencias externas.
     - Firma HMAC-SHA256 con el secreto hexadecimal y cabecera `kid: keyId` según el estándar de Ghost Admin API v5.
  2. **Configuración Segura de Credenciales**:
     - Registro de `NEWS_ADMIN_API_KEY` en `.env` (área restringida del servidor, aislada de `runtimeConfig.public`).
     - Actualización del contrato de variables en `.env.example`.
  3. **Publicación y Verificación en Vivo**:
     - Ejecución de publicación de prueba: *"Investigación Especial: El Futuro del Periodismo Digital en Evolución TV"* (`id: 6b04d5c2c506c700013dce4e`).
     - Artículo creado con éxito con estado `published`, etiquetas `Especial` e `Investigación` e imagen de portada en alta resolución.
- **Verificación Técnica**:
  - Ghost Content API confirma 2 posts publicados en total (`/ghost/api/content/posts/?limit=all`).
  - El portal local `http://localhost:3005/` actualiza inmediatamente la Nota Principal con el nuevo artículo.
  - La página de lectura `http://localhost:3005/noticias/investigacion-especial-el-futuro-del-periodismo-digital-en-evolucion-tv` responde HTTP 200 OK y renderiza el contenido completo en SSR.
  - Compilación exitosa con `npm run build` (15.0s, 0 errores).

---

### Sesión 8 — 23 de Noviembre de 2026
**Objetivo**: Redacción y publicación remota en vivo del artículo sobre Jensen Huang en Ghost CMS y validación de renderizado completo en local.
- **Autorización**: Aprobación nativa formal del plan `plan_publicacion_articulo_jensen_huang.md` mediante botón Proceed del operador (§4.4 de AGENTS.md).
- **Actividades Realizadas**:
  1. **Redacción y Publicación Automática**:
     - Noticia creada mediante Ghost Admin API: *"El Retorno de Jensen Huang: La Nueva Era de la Computación Acelerada y las Fábricas de IA"* (`id: 6b04d6c5c506c700013dce58`, `slug: el-retorno-de-jensen-huang-la-nueva-era-de-la-computacion-acelerada-y-las-fabricas-de-ia`).
     - Metadatos: etiquetas `Tecnología` e `Innovación`, imagen de microarquitectura de IA y formato periodístico `prose-news`.
  2. **Verificación de Indexación y Renderizado**:
     - Ghost Content API incrementa el total de artículos publicados a 3.
     - Portada de `http://localhost:3005/` actualizada en tiempo real: la nota de Jensen Huang asume la posición de Nota Principal (Hero).
     - Ruta de lectura individual `http://localhost:3005/noticias/el-retorno-de-jensen-huang-la-nueva-era-de-la-computacion-acelerada-y-las-fabricas-de-ia` responde 200 OK y renderiza el contenido íntegro con autor, tiempo de lectura y enlaces de regreso.

---

### Sesión 9 — 23 de Noviembre de 2026
**Objetivo**: Despliegue completo a producción de la plataforma Evolución TV en el subdominio `etv.webia.studio` mediante Dokploy VPS y Cloudflare DNS.
- **Autorización**: Aprobación nativa formal del plan `plan_despliegue_produccion_etv.md` mediante botón Proceed del operador (§4.4 de AGENTS.md).
- **Actividades Realizadas**:
  1. **Configuración DNS en Cloudflare**:
     - Creación de registro `A` para `etv.webia.studio` (`id: e8b83a2ecaf198e71c60ae24068b07e8`) apuntando a la IP `159.195.13.43` con `proxied: false` (DNS Only) en la zona `webia.studio`.
  2. **Inicialización y Publicación del Repositorio Remoto en GitHub**:
     - Creación del repositorio `datapulta/panel-evoluciontv` en GitHub.
     - Vinculación como remoto `origin` y publicación de ramas `main` y `feat/setup-nuxt4-ghost-cms` (preservando el historial completo conforme a §5 de AGENTS.md).
  3. **Aprovisionamiento y Despliegue en Dokploy VPS (`lania.webia.studio`)**:
     - Creación del servicio de aplicación `panel-evoluciontv` (`applicationId: OD0duHt9W9jees8yl_TEa`, nombre interno: `app-synthesize-neural-panel-svqkpk`) dentro del proyecto `Evolución TV` (`WKovOg3IGCeA3WTJ296t7`) y entorno `production`.
     - Vinculación con repositorio GitHub `datapulta/panel-evoluciontv.git` en rama `main` y Build Type `dockerfile`.
     - Configuración de variables de entorno de producción (`PORT=3000`, `HOST=0.0.0.0`, `NUXT_PUBLIC_NEWS_API_URL`, `NUXT_PUBLIC_NEWS_API_KEY`, `NEWS_ADMIN_API_KEY`).
     - Asignación de dominio `etv.webia.studio` en puerto `3000` con certificado SSL automático `letsencrypt`.
     - Despliegue completado con éxito (`deploymentId: 59ZphmAzTa2aybQheXZi9`, status `done`).
  4. **Emisión de Certificado SSL Let's Encrypt**:
     - Recarga del proxy Traefik mediante `/api/settings.reloadTraefik`.
     - Emisión exitosa de certificado SSL oficial por Let's Encrypt para `etv.webia.studio` (válido hasta febrero 2027).
- **Verificación Técnica**:
  - `Resolve-DnsName etv.webia.studio` resuelve directamente a `159.195.13.43`.
  - Petición HTTPS a `https://etv.webia.studio/` responde HTTP 200 OK con SSR íntegro (título oficial, señal en vivo y noticias publicadas en Ghost).
  - Petición a nota individual `https://etv.webia.studio/noticias/el-retorno-de-jensen-huang-la-nueva-era-de-la-computacion-acelerada-y-las-fabricas-de-ia` responde HTTP 200 OK.
  - Validación TLS confirma certificado emitido por Let's Encrypt.

---

### Sesión 10 — 23 de Noviembre de 2026
**Objetivo**: Desacoplamiento de la sección de streaming de televisión de la portada y creación de la página dedicada `/en-vivo`.
- **Autorización**: Aprobación nativa formal del plan `plan_pagina_dedicada_senal_en_vivo.md` mediante botón Proceed del operador (§4.4 de AGENTS.md).
- **Actividades Realizadas**:
  1. **Creación de la Página Dedicada (`app/pages/en-vivo.vue`)**:
     - Vista cinematográfica de transmisión digital con reproductor 16:9 interactivo, selector 1080p HD, contador de espectadores y barra de programa actual.
     - Guía interactiva de programación del día con estados dinámicos (*En Vivo Ahora*, *Siguiente*, *Madrugada*, *Mañana*).
     - Módulo de participación y denuncia ciudadana en vivo enlazado a la redacción.
     - Sección de investigaciones y coberturas periodísticas recientes al pie.
  2. **Purificación de la Portada (`app/pages/index.vue`)**:
     - Retiro del componente `LiveStreamSection` de la portada para enfocarla enteramente en el contenido editorial escrito y las investigaciones de Ghost CMS.
  3. **Navegación Global en `app/components/HeaderNav.vue`**:
     - Botón pulsante "SEÑAL EN VIVO" y enlace de categoría actualizados a `<NuxtLink to="/en-vivo">`.
     - Logo y enlace "Portada" configurados a `<NuxtLink to="/">`.
- **Verificación Técnica**:
  - Compilación de producción limpia ejecutada con `npm run build` (13.2s, 0 errores).
  - Comprobación local: `http://localhost:3005/` libre del bloque de video y `http://localhost:3005/en-vivo` con la experiencia televisiva completa (200 OK).

---

### Sesión 11 — 23 de Noviembre de 2026
**Objetivo**: Creación de las 4 categorías periodísticas oficiales en Ghost CMS y sincronización de la taxonomía en la cabecera de navegación del portal.
- **Autorización**: Aprobación nativa formal del plan `plan_creacion_categorias_ghost_y_navegacion.md` mediante botón Proceed del operador (§4.4 de AGENTS.md).
- **Actividades Realizadas**:
  1. **Aprovisionamiento de Categorías en Ghost CMS**:
     - Ejecución de `scripts/create-tags.mjs` autenticado con Ghost Admin API.
     - Creación de las 4 etiquetas oficiales: *"Quiénes somos"* (`id: 6b04dda1c506c700013dce6d`), *"Coberturas ETV"* (`id: 6b04dda1c506c700013dce6f`), *"Más bandas"* (`id: 6b04dda1c506c700013dce71`) y *"EvolucioNotas"* (`id: 6b04dda1c506c700013dce73`).
     - Asignación de colores identificadores y metadatos para clasificación periodística.
  2. **Sincronización de Navegación en `app/components/HeaderNav.vue`**:
     - Actualización del menú de categorías: *Portada*, *Coberturas ETV*, *Más bandas*, *EvolucioNotas*, *Señal en Vivo*, *Quiénes somos* y canal de *Contacto*.
- **Verificación Técnica**:
  - Ghost Admin API confirma las 4 etiquetas creadas y activas.
  - Compilación de producción exitosa con `npm run build` (13.2s, 0 errores).
  - Validación de renderizado de las 5 opciones de navegación en el HTML SSR de `http://localhost:3005/` y `https://etv.webia.studio/`.

---

### Sesión 12 — 23 de Noviembre de 2026
**Objetivo**: Depuración de categorías obsoletas en Ghost CMS, reclasificación de 2 artículos, API de categorías dinámicas en Nitro (`/api/categories`), página de categorías (`/categoria/[slug]`), y sistema de Modo Claro y Oscuro optimizado con protección anti-FOUC.
- **Autorización**: Aprobación nativa formal del plan `plan_categorias_dinamicas_ghost_y_navegacion.md` mediante botón Proceed del operador (§4.4 de AGENTS.md).
- **Actividades Realizadas**:
  1. **Depuración y Reclasificación en Ghost CMS (`scripts/sync-ghost-categories.mjs`)**:
     - Reclasificación del artículo de Jensen Huang a la categoría oficial *Coberturas ETV* (`coberturas-etv`).
     - Reclasificación del artículo de investigación institucional a la categoría oficial *Quiénes somos* (`quienes-somos`).
     - Eliminación exitosa de las 5 etiquetas obsoletas de Ghost CMS (*News*, *Especial*, *Investigación*, *Tecnología*, *Innovación*).
     - Asignación de colores de acento oficiales en Ghost: `#dc2626`, `#ea580c`, `#8b5cf6`, `#0284c7`.
  2. **Endpoint de Categorías Dinámicas en Nitro (`server/api/categories.get.ts`)**:
     - Implementación de ruta server en Nitro que consulta la Ghost Admin API con token HMAC-SHA256 firmado con `process.env.NEWS_ADMIN_API_KEY`.
     - Permite que cualquier nueva categoría agregada en Ghost CMS aparezca en Nuxt inmediatamente sin cambios de código.
  3. **Sistema Optimizado de Modo Claro y Modo Oscuro**:
     - Configuración de `@custom-variant dark (&:where(.dark, .dark *));` en Tailwind CSS v4 (`app/assets/css/main.css`).
     - Composable reactivo `app/composables/useTheme.ts` con persistencia en `localStorage` ('etv-theme') y sincronización con el sistema operativo (`prefers-color-scheme`).
     - Inyección de script anti-FOUC en `app/app.vue` para garantizar cero parpadeo al cargar.
     - Botón selector conmutador (Sol ☀️ / Luna 🌙) en `app/components/HeaderNav.vue` en barra de escritorio y menú móvil.
     - Adaptación de paleta de colores y contraste de alto estándar en `HeaderNav.vue`, `NewsCard.vue`, `index.vue`, `noticias/[slug].vue`, `en-vivo.vue` y `FooterSection.vue`.
  4. **Página Dedicada de Categorías (`app/pages/categoria/[slug].vue`)**:
     - Visualización de artículos filtrados por categoría (`/categoria/:slug`) con badge distintivo, metadatos y estado amigable para secciones en preparación.
- **Verificación Técnica**:
  - `http://localhost:3005/api/categories` responde con las 4 categorías oficiales.
  - `http://localhost:3005/categoria/coberturas-etv` y `http://localhost:3005/categoria/quienes-somos` cargan sus respectivos artículos (200 OK).
  - Compilación de producción limpia ejecutada con `npm run build` (13.3s, 0 errores).

---

### Sesión 13 — 24 de Noviembre de 2026
**Objetivo**: Ajuste de cabecera móvil (`HeaderNav.vue`) y eliminación de enlaces públicos al Panel de Redacción (`cms-etv.webia.studio/ghost`) para proteger la plataforma.
- **Autorización**: Aprobación nativa formal del plan `plan_ajuste_header_movil.md` mediante botón Proceed del operador (§4.4 de AGENTS.md).
- **Actividades Realizadas**:
  1. **Cabecera Móvil Limpia (`app/components/HeaderNav.vue`)**:
     - Se ocultó el botón flotante "SEÑAL EN VIVO" en la vista móvil (`hidden md:flex`), evitando que desplace el menú hamburguesa; el acceso permanece disponible dentro del menú móvil desplegable.
  2. **Endurecimiento de Seguridad en Interfaz Pública**:
     - Se eliminaron todos los enlaces y textos públicos hacia `https://cms-etv.webia.studio/ghost` ("Panel de Redacción" y "Acceso Redacción (CMS)") en `HeaderNav.vue` y `FooterSection.vue`.
     - Se actualizó el botón "Contactar a Cabina" en `app/pages/en-vivo.vue` hacia `mailto:redaccion@evoluciontv.com`.
- **Verificación Técnica**:
  - Búsqueda en `app/` confirma 0 enlaces restantes a `cms-etv.webia.studio/ghost`.
  - Compilación de producción limpia ejecutada con `npm run build` (0 errores).

---

### Sesión 14 — 24 de Noviembre de 2026
**Objetivo**: Creación de la página dedicada `/quienes-somos` con identidad, Misión, Visión y Objetivos de Evolución TV.
- **Autorización**: Aprobación nativa formal del plan `plan_pagina_quienes_somos.md` mediante botón Proceed del operador (§4.4 de AGENTS.md).
- **Actividades Realizadas**:
  1. **Nueva Página Dedicada (`app/pages/quienes-somos.vue`)**:
     - Se integraron los bloques institucionales: descripción general de Evolución TV, Misión, Visión, Objetivos (Corto, Mediano y Largo plazo) y llamado a la acción final.
     - Diseño optimizado con soporte completo para Modo Claro y Modo Oscuro.
  2. **Actualización de Enlaces (`HeaderNav.vue` y `FooterSection.vue`)**:
     - El enlace `Quiénes somos` (tanto en el menú dinámico superior como en el pie de página) ahora apunta directamente a `/quienes-somos`.
- **Verificación Técnica**:
  - Compilación de producción limpia ejecutada con `npm run build` (0 errores).
  - Verificación en `http://localhost:3005/quienes-somos` (200 OK).

---

### Sesión 15 — 24 de Noviembre de 2026
**Objetivo**: Optimización de experiencia de lectura (UX) en `app/pages/noticias/[slug].vue`: cambio a "Más Noticias y Coberturas", navegación secuencial y carrusel horizontal.
- **Autorización**: Aprobación nativa formal del plan `plan_navegacion_y_slider_articulos.md` mediante botón Proceed del operador (§4.4 de AGENTS.md).
- **Actividades Realizadas**:
  1. **Navegación Secuencial (`← Nota anterior / Nota siguiente →`)**:
     - Se amplió la consulta de notas a `limit: 8` y se implementaron tarjetas interactivas al pie del artículo para navegar directamente entre notas.
  2. **Carrusel / Slider Horizontal ("Más Noticias y Coberturas")**:
     - Se actualizó el título de "Más Investigaciones y Coberturas" a "Más Noticias y Coberturas".
     - Se reemplazó la cuadrícula fija por un slider nativo con CSS Scroll Snap (`snap-x snap-mandatory`), deslizamiento táctil en móvil y controles `‹` / `›` en escritorio.
- **Verificación Técnica**:
  - Compilación de producción limpia ejecutada con `npm run build` (0 errores).
  - Verificación en `http://localhost:3005/noticias/el-retorno-de-jensen-huang-la-nueva-era-de-la-computacion-acelerada-y-las-fabricas-de-ia` (`200 OK`).

---

### Sesión 16 — 24 de Noviembre de 2026
**Objetivo**: Mostrar únicamente artículos reales de Ghost CMS, ocultar la barra de desplazamiento del slider e integrar las 5 redes sociales oficiales de Evolución TV.
- **Autorización**: Aprobación nativa formal del plan `plan_optimizacion_slider_sin_scrollbar.md` mediante botón Proceed del operador (§4.4 de AGENTS.md).
- **Actividades Realizadas**:
  1. **Solo Artículos Reales de Ghost CMS (`useNews.ts`, `index.vue`, `categoria/[slug].vue`)**:
     - Se eliminó la mezcla con `BACKUP_ARTICLES` cuando Ghost CMS responde correctamente, mostrando exclusivamente las notas publicadas en Ghost.
     - Se añadió `v-if="allArticles.length > 0"` en `index.vue` para ocultar la cuadrícula secundaria si hay 3 o menos notas reales.
  2. **Slider sin Scrollbar Nativa (`main.css`, `noticias/[slug].vue`)**:
     - Se creó la utilidad `.no-scrollbar` en `app/assets/css/main.css` y se aplicó al carrusel de artículos.
     - Se añadieron estados reactivos `canScrollPrev` y `canScrollNext` para ocultar/deshabilitar flechas innecesarias.
  3. **Redes Sociales Oficiales (`SocialLinks.vue`, `HeaderNav.vue`, `FooterSection.vue`, `quienes-somos.vue`)**:
     - Se integraron los enlaces oficiales de Evolución TV en Facebook, YouTube, X, Instagram y TikTok.
- **Verificación Técnica**:
  - Compilación de producción limpia ejecutada con `npm run build` (0 errores).

---

### Sesión 17 — 24 de Noviembre de 2026
**Objetivo**: Rediseño editorial limpio en `app/pages/index.vue` e integración del reproductor flotante persistente **Evolución Radio** (`useRadio.ts`, `RadioPlayer.vue`), conservando intacto el diseño de `HeaderNav.vue`.
- **Autorización**: Aprobación nativa formal del plan `plan_rediseno_portada_y_evolucion_radio.md` mediante botón Proceed del operador (§4.4 de AGENTS.md).
- **Actividades Realizadas**:
  1. **Reproductor Flotante Persistente (`useRadio.ts`, `RadioPlayer.vue`, `app.vue`)**:
     - Se implementó el reproductor flotante de **Evolución Radio** en esquina inferior izquierda con Play/Pause circular rojo, barra de volumen, silencio y opción de minimizar/expandir en píldora.
  2. **Portada Editorial Limpia (`app/pages/index.vue`)**:
     - Nota principal en móvil *full-bleed* sin texto encimado y titular + extracto limpios debajo de la fotografía.
     - Notas secundarias en formato compacto horizontal con divisores sutiles.
     - Se mantuvo intacto `HeaderNav.vue`.
- **Verificación Técnica**:
  - Compilación de producción limpia ejecutada con `npm run build` (0 errores).

---

### Sesión 18 — 24 de Noviembre de 2026
**Objetivo**: Tarjetas con ligera curvatura en portada (`index.vue`), ajuste del titular en `quienes-somos.vue` y adaptación del reproductor flotante persistente **Evolución Radio** para navegación continua sin cortes.
- **Autorización**: Aprobación nativa formal del plan `plan_ajustes_tarjetas_portada_y_quienes_somos.md` mediante botón Proceed del operador (§4.4 de AGENTS.md).
- **Actividades Realizadas**:
  1. **Tarjetas con Curvatura en Portada (`app/pages/index.vue`)**:
     - Se dotó de contenedor tipo tarjeta (`rounded-2xl`, borde sutil y sombra) tanto a la Nota Principal como a cada Nota Secundaria.
  2. **Ajuste de Titular (`app/pages/quienes-somos.vue`)**:
     - Se cambió el `<h1>` a *"Medio digital independiente, sin límites y en constante evolución."*
  3. **Reproductor Persistente Sin Cortes (`useRadio.ts`, `RadioPlayer.vue`, `app.vue`)**:
     - Instancia única en `globalThis`, reconexión automática (`stalled`/`error`), persistencia en `localStorage`, Media Session API, `<ClientOnly>` en `app.vue` y modo mini-dock con Play/Pause directo.
- **Verificación Técnica**:
  - Compilación de producción limpia ejecutada con `npm run build` (0 errores).

---

### Sesión 19 — 24 de Noviembre de 2026
**Objetivo**: Eliminación de márgenes exteriores alrededor de la Nota Principal en móvil (`app/pages/index.vue`).
- **Autorización**: Aprobación nativa formal del plan `plan_ajuste_espacios_caja_principal.md` mediante botón Proceed del operador (§4.4 de AGENTS.md).
- **Actividades Realizadas**:
  - Se retiró el padding lateral y superior (`px-0 pt-0`) del contenedor Hero en móvil y se ajustó la tarjeta principal a `rounded-b-2xl md:rounded-2xl` para ocupar el ancho completo sin espacios sobrantes.
- **Verificación Técnica**:
  - Compilación de producción limpia ejecutada con `npm run build` (0 errores).

---

### Sesión 20 — 24 de Noviembre de 2026
**Objetivo**: Configuración de Ghost CMS (`https://cms-etv.webia.studio`) en modo Headless mediante `redirects.yaml`.
- **Autorización**: Confirmación explícita del operador sobre `plan_desactivar_home_ghost_headless.md` (§4 de AGENTS.md).
- **Actividades Realizadas**:
  - Se cargaron las reglas `redirects.yaml` en Ghost CMS (`Settings → Labs → Redirects`), redirigiendo `^/$`, `^/tag/...`, `^/author/...` y `^/page/...` con `301` hacia `https://etv.webia.studio/`.
- **Verificación Técnica**:
  - `https://cms-etv.webia.studio/` responde `301` con `Location: https://etv.webia.studio/`.
  - `https://cms-etv.webia.studio/ghost/` (`200 OK`), Content API (`200 OK`, 2 artículos) y `https://etv.webia.studio/` (`200 OK`) operativos sin interrupciones.

---

### Sesión 21 — 24 de Noviembre de 2026
**Objetivo**: Optimización de artículos y portal para plataformas y chats de IA (GEO / AIO + SEO).
- **Autorización**: Aprobación nativa formal del plan `plan_optimizacion_ia_geo_seo.md` mediante botón Proceed del operador (§4.4 de AGENTS.md).
- **Actividades Realizadas**:
  1. **Endpoints Dinámicos para IA y Buscadores**:
     - `server/routes/llms.txt.get.ts`: Índice `/llms.txt` en Markdown limpio con secciones, categorías y notas reales de Ghost CMS.
     - `server/routes/sitemap.xml.get.ts`: Mapa del sitio XML dinámico `/sitemap.xml` con fechas de actualización.
     - `public/robots.txt`: Configuración `Allow: /` y enlace a `Sitemap: https://etv.webia.studio/sitemap.xml`.
  2. **JSON-LD `NewsArticle` y Metadatos Completos (`app/pages/noticias/[slug].vue`)**:
     - Se agregaron `<link rel="canonical">`, `og:type: 'article'`, `twitter:card: 'summary_large_image'`, `<script type="application/ld+json">` (`NewsArticle`) y botones de consulta rápida (Copiar enlace, Resumir en ChatGPT, Consultar en Perplexity).
- **Verificación Técnica**:
  - Compilación de producción limpia ejecutada con `npm run build` (0 errores).
  - Validación local en `/llms.txt`, `/sitemap.xml` y `/noticias/...`.

---

### Sesión 22 — 24 de Noviembre de 2026
**Objetivo**: Conexión del stream oficial de **Evolución Radio** (`https://r3.webia.studio/listen/estereo_fonik/radio-320.mp3`) y creación de la página dedicada `/radio`.
- **Autorización**: Aprobación nativa formal del plan `plan_evolucion_radio_stream_y_pagina.md` mediante botón Proceed del operador (§4.4 de AGENTS.md).
- **Actividades Realizadas**:
  1. **Conexión del Stream (`app/composables/useRadio.ts`)**:
     - Se configuró `DEFAULT_RADIO_STREAM_URL` con el stream MP3 320 kbps validado (`200 OK`, `audio/mpeg`).
  2. **Página Dedicada (`app/pages/radio.vue`)**:
     - Reproductor protagonista con visualizador de barras, control Play/Pause, barra de volumen/silencio y redes sociales sincronizado con el reproductor flotante.
  3. **Sincronización de Enlaces (`HeaderNav.vue`, `FooterSection.vue`, `RadioPlayer.vue`, `llms.txt.get.ts`, `sitemap.xml.get.ts`)**:
     - Se añadió acceso directo a `/radio` en el menú, pie de página, título del reproductor flotante, `/llms.txt` y `/sitemap.xml`.
- **Verificación Técnica**:
  - Compilación de producción limpia ejecutada con `npm run build` (0 errores).
  - Validación local en `http://localhost:3005/radio` (`200 OK`).

---

### Sesión 23 — 24 de Noviembre de 2026
**Objetivo**: Optimización minimalista de `/radio` (`app/app.vue`, `app/pages/radio.vue`).
- **Autorización**: Aprobación nativa formal del plan `plan_optimizacion_pagina_radio.md` mediante botón Proceed del operador (§4.4 de AGENTS.md).
- **Actividades Realizadas**:
  1. Se ocultaron `<FooterSection />` y `<RadioPlayer />` en la ruta `/radio` (`app/app.vue`) para dejar el reproductor completamente limpio.
  2. Se retiró el control deslizante de volumen en `app/pages/radio.vue` y se reemplazó el espectro de barras por ondas radiales concéntricas animadas alrededor del botón Play/Pause + píldora de estado.
- **Verificación Técnica**:
  - Compilación de producción limpia ejecutada con `npm run build` (0 errores).
  - Validación local en `http://localhost:3005/radio` (`200 OK`, sin `<footer>`, sin control de volumen).

---

### Sesión 24 — 24 de Noviembre de 2026
**Objetivo**: Animación moderna del menú móvil (`HeaderNav.vue`) y botón "Explorar la plataforma" en `/radio` (`app/pages/radio.vue`).
- **Autorización**: Aprobación nativa formal del plan `plan_animacion_menu_y_boton_explorar_radio.md` mediante botón Proceed del operador (§4.4 de AGENTS.md).
- **Actividades Realizadas**:
  1. Se envolvió el menú móvil de `HeaderNav.vue` en `<Transition>` con efecto suave de deslizamiento y desvanecimiento (`duration-200 ease-out`) e icono alternante `☰` / `✕`.
  2. Se redujeron espacios en `app/pages/radio.vue` y se reemplazó el enlace superior por el botón **"Explorar la plataforma"**.
- **Verificación Técnica**:
  - Compilación de producción limpia ejecutada con `npm run build` (0 errores).
  - Validación local en `http://localhost:3005/radio` (`200 OK`).

---

### Sesión 25 — 24 de Noviembre de 2026
**Objetivo**: Agregar botón visible "Ir a Radio" en el reproductor flotante (`RadioPlayer.vue`).
- **Autorización**: Aprobación nativa formal del plan `plan_boton_ir_a_radio_en_reproductor.md` mediante botón Proceed del operador (§4.4 de AGENTS.md).
- **Actividades Realizadas**:
  - Se incorporó el botón `<NuxtLink to="/radio">` ("Ir a Radio ↗") en la esquina superior derecha del reproductor flotante junto al botón minimizar.
- **Verificación Técnica**:
  - Compilación de producción limpia ejecutada con `npm run build` (0 errores).

---

### Sesión 26 — 24 de Noviembre de 2026
**Objetivo**: Reemplazo de etiquetas técnicas de bitrate en `/radio` y `/llms.txt`.
- **Autorización**: Aprobación nativa formal del plan `plan_reemplazo_etiquetas_bitrate_radio.md` mediante botón Proceed del operador (§4.4 de AGENTS.md).
- **Actividades Realizadas**:
  - Se reemplazó `320 KBPS MP3 · EN VIVO` por `RADIO EN VIVO · 24/7` y `MP3 320k` por `AUDIO HD` en `app/pages/radio.vue` y sus metadatos en `llms.txt.get.ts`.
- **Verificación Técnica**:
  - Compilación de producción limpia ejecutada con `npm run build` (0 errores).
  - Validación local en `http://localhost:3005/radio` (`200 OK`).

---

### Sesión 27 — 24 de Noviembre de 2026
**Objetivo**: Ajustes de maquetación en artículos, optimizaciones responsive móvil y actualización de texto institucional en `/quienes-somos`.
- **Autorización**: Aprobación nativa formal de planes `plan_orden_imagen_y_titulo_articulo.md`, `plan_ajuste_responsive_movil.md` y `plan_actualizacion_texto_quienes_somos.md` mediante botón Proceed del operador (§4.4 de AGENTS.md).
- **Actividades Realizadas**:
  1. **Orden en Artículo (`app/pages/noticias/[slug].vue`)**: Imagen principal destacada colocada primero arriba del título y metadatos con aspect ratio `16/10` en móvil y `16/9` en desktop.
  2. **Responsive Móvil (`app/components/HeaderNav.vue`)**: Ajustes de padding, tipografía y desbordamiento horizontal en pantallas pequeñas de hasta 360px.
  3. **Texto Quiénes Somos (`app/pages/quienes-somos.vue`)**: Incorporación del texto institucional oficial de Evolución TV ("medio de comunicación independiente, sin límites, con contenidos propios y creativos...").
- **Verificación Técnica**:
  - Compilación de producción limpia ejecutada con `npm run build` (0 errores).
  - Verificación visual en servidor de desarrollo.

---

### Sesión 28 — 24 de Noviembre de 2026
**Objetivo**: Creación de la página dedicada de Contacto (`/contacto`) sin formularios, con canales de correo directos y redes sociales.
- **Autorización**: Aprobación nativa formal del plan `plan_pagina_contacto.md` mediante botón Proceed del operador (§4.4 de AGENTS.md).
- **Actividades Realizadas**:
  1. **Página Dedicada (`app/pages/contacto.vue`)**:
     - Canales directos de correo con tarjetas (`Redacción General`, `Buzón de Denuncias`, `Alianzas y Prensa`), botones directos `mailto:` con asuntos prellenados y botón interactivo para copiar dirección al portapapeles con feedback visual.
     - Grilla completa de redes sociales oficiales (`Facebook`, `YouTube`, `X`, `Instagram`, `TikTok`) con badges de identidad y enlaces seguros.
     - Bloque de transparencia informativa, plazos de atención editorial (24-48 hrs) y enlaces al Código de Ética y Aviso de Privacidad.
     - Cero formularios engorrosos ni campos captcha.
  2. **Navegación e Integración (`HeaderNav.vue`, `FooterSection.vue`)**:
     - Actualización del enlace `Contacto` en menú principal de `/#contacto` a `/contacto` con detección de ruta activa.
     - Enlace incorporado en el pie de página hacia la nueva página.
  3. **Indexación y Manifiesto (`sitemap.xml.get.ts`, `llms.txt.get.ts`)**:
     - Inclusión de `/contacto` en el mapa XML de URLs y en el índice textual para agentes de IA.
- **Verificación Técnica**:
  - Compilación de producción limpia ejecutada con `npm run build` (0 errores, 213 módulos).
  - Verificación HTTP `200 OK` en `http://localhost:3005/contacto`.
  - Verificación de presencia de `/contacto` en `/sitemap.xml` y `/llms.txt`.

---

### Sesión 29 — 24 de Noviembre de 2026
**Objetivo**: Reorientación integral de Contacto, Footer, En Vivo y Privacidad hacia la escena musical independiente en México (ska, reggae, rock, bandas y toquines), eliminando conceptos de reporte ciudadano / denuncias.
- **Autorización**: Aprobación nativa formal del plan `plan_enfoque_musical_bandas_contacto.md` mediante botón Proceed del operador (§4.4 de AGENTS.md).
- **Actividades Realizadas**:
  1. **Página de Contacto (`app/pages/contacto.vue`)**:
     - Sustitución de canales por: **Envío de Música & Bandas Independientes** (sencillos, EPK y comunicados de ska, reggae, rock), **Coberturas de Toquines & Festivales** (acreditaciones, reseñas y fotografía) y **Sesiones en Vivo & Entrevistas en Cabina**.
     - Actualización de metadatos SEO y texto del hero al perfil de cabina musical independiente.
     - Actualización de sección de compromiso editorial a *Compromiso Editorial y Escucha Musical* (respeto a derechos de autor y escucha en 24-48 hrs).
  2. **Pie de Página (`app/components/FooterSection.vue`)**:
     - Reemplazo de "Buzón de Denuncias" por **"Envío de Música y Bandas"** (`subject=Envio%20de%20Musica%20y%20Bandas`).
  3. **Cabina En Vivo (`app/pages/en-vivo.vue`)**:
     - Módulo de cabina actualizado a: *"¿Tienes una banda o toquín en puerta? Envía tus fechas, lanzamientos o propuestas de cobertura a nuestra cabina de redacción."*
  4. **Aviso de Privacidad (`app/pages/privacidad.vue`)**:
     - Cláusula de contacto actualizada para material de bandas y propuestas musicales.
- **Verificación Técnica**:
  - Compilación de producción limpia ejecutada con `npm run build` (0 errores).
  - Validación local en `http://localhost:3005/contacto` y `http://localhost:3005/en-vivo` (`200 OK`).

---

### Sesión 30 — 24 de Noviembre de 2026
**Objetivo**: Migración del dominio oficial de correo a **`evoluciontv.mx`** e implementación de protección integral anti-spam / anti-scraping de correos.
- **Autorización**: Aprobación nativa formal del plan `plan_dominio_mx_y_proteccion_antispam_emails.md` mediante botón Proceed del operador (§4.4 de AGENTS.md).
- **Actividades Realizadas**:
  1. **Componente Reutilizable (`app/components/ProtectedEmail.vue`)**:
     - Ensamblaje dinámico de correos en cliente (`user`, `domain`, `tld`), suprimiendo enlaces estáticos `mailto:` en el HTML plano para evitar recolección por robots (email harvesting).
     - Trampa invisible señuelo (*honeypot decoy* `<span class="hidden select-none" aria-hidden="true">[anti-spam-trap]</span>`) que invalida expresiones regulares de bots.
     - Apertura segura mediante evento `@click` que dispara el gestor de correo predeterminado del sistema operativo solo ante interacción humana.
     - Botón de copiado en 1 clic al portapapeles con feedback visual (*"¡Copiado!"*).
  2. **Página de Contacto (`app/pages/contacto.vue`)**:
     - Actualizado correo oficial a `redaccion@evoluciontv.mx`.
     - Reemplazados enlaces directos por botones interactivos seguros y ofuscación en la vista.
  3. **Plataforma Completa (`FooterSection.vue`, `LiveStreamSection.vue`, `en-vivo.vue`, `codigo-etica.vue`, `privacidad.vue`)**:
     - Reemplazo del dominio antiguo `@evoluciontv.com` por el dominio oficial **`@evoluciontv.mx`** con `ProtectedEmail`.
- **Verificación Técnica**:
  - Compilación de producción limpia ejecutada con `npm run build` (0 errores, 215 módulos).
  - Verificación anti-bot: `curl.exe` al HTML crudo demostró que no existen cadenas estáticas `mailto:` en los elementos DOM.
  - Verificación local en `http://localhost:3005/contacto` (`200 OK`).

---

### Sesión 31 — 24 de Noviembre de 2026
**Objetivo**: Ocultar la barra horizontal de navegación en celulares (`hidden md:block`) para evitar saturación de pantalla y mantener el menú hamburguesa limpio.
- **Autorización**: Aprobación nativa formal del plan `plan_ocultar_menu_horizontal_en_movil.md` mediante botón Proceed del operador (§4.4 de AGENTS.md).
- **Actividades Realizadas**:
  1. Se restauró la clase `hidden md:block` en el contenedor `<nav>` de `app/components/HeaderNav.vue`.
  2. En celulares (`< 768px`), la barra horizontal ya no se muestra debajo del encabezado, eliminando la duplicación con el botón hamburguesa (`☰`).
  3. En computadoras de escritorio (`>= 768px`), la barra de navegación se mantiene completa, centrada y con acceso directo a todas las secciones editoriales y a `/contacto`.
- **Verificación Técnica**:
  - Compilación de producción limpia ejecutada con `npm run build` (0 errores).
  - Verificación visual en servidor de desarrollo local `http://localhost:3005/`.

---

### Sesión 32 — 24 de Noviembre de 2026
**Objetivo**: Merge de la rama `feat/setup-nuxt4-ghost-cms` hacia `main`, publicación del tag oficial de release **`v1.0.10`** y despliegue a producción en Dokploy VPS.
- **Autorización**: Aprobación nativa formal del plan `plan_merge_y_release_v1_0_10.md` mediante botón Proceed del operador (§4.4 de AGENTS.md).
- **Actividades Realizadas**:
  1. **Merge no fast-forward (`--no-ff`) hacia `main`**:
     - Commit merge `e622520` integrando 7 conjuntos de mejoras: maquetación de artículos 16:9 arriba, ajustes responsive móvil, textos de quiénes somos, página dedicada `/contacto` sin formularios, enfoque en escena musical independiente (ska, reggae, rock), migración a `@evoluciontv.mx` con protección anti-spam (`ProtectedEmail.vue`) y limpieza de cabecera móvil (`hidden md:block`).
  2. **Etiquetado Semántico**:
     - Creación y publicación del tag anotado oficial **`v1.0.10`**.
  3. **Despliegue y Preservación**:
     - Despliegue automático en Dokploy VPS (`OD0duHt9W9jees8yl_TEa`) completado con éxito (`status: done`, contenedor activo).
     - Retorno a la rama de desarrollo `feat/setup-nuxt4-ghost-cms` preservándola intacta conforme a `AGENTS.md` §5.
- **Verificación Técnica en Producción (`https://etv.webia.studio/`)**:
  - `HTTP 200 OK` verificado en `https://etv.webia.studio/contacto` con título `<title>Contacto y Bandas Independientes | Evolución TV</title>`.
  - Verificada la presencia de la ruta en `https://etv.webia.studio/sitemap.xml` y `https://etv.webia.studio/llms.txt`.
  - `HTTP 200 OK` en `https://etv.webia.studio/quienes-somos` y artículos.

---

### Sesión 33 — 24 de Noviembre de 2026
**Objetivo**: Reemplazo del titular en `app/pages/contacto.vue` por "Contacto y Enlace con Evolución TV" y ajuste de redacción descriptiva.
- **Autorización**: Aprobación nativa formal del plan `plan_titular_contacto_evolucion_tv.md` mediante botón Proceed del operador (§4.4 de AGENTS.md).
- **Actividades Realizadas**:
  1. Se reemplazó el titular `<h1>` por: *"Contacto y Enlace con Evolución TV"*.
  2. Se ajustó el párrafo descriptivo a: *"Somos un medio de comunicación independiente dedicado a impulsar la escena musical en México: ska, reggae, rock y cultura alternativa. Sin intermediarios ni formularios: escríbenos directamente para difundir tu música, toquines o colaboraciones."*
- **Verificación Técnica**:
  - Compilación de producción limpia ejecutada con `npm run build` (0 errores).
  - Verificación visual en servidor de desarrollo local `http://localhost:3005/contacto`.

---

### Sesión 34 — 24 de Noviembre de 2026
**Objetivo**: Redacción, maquetación semántica y publicación en Ghost CMS del artículo oficial: *"Evolución TV regresa a sus orígenes con portal oficial"*.
- **Autorización**: Aprobación nativa formal del plan `plan_subir_articulo_regreso_origenes_ghost.md` mediante botón Proceed del operador (§4.4 de AGENTS.md).
- **Actividades Realizadas**:
  1. **Publicación Programática en Ghost Admin API**:
     - Generación de token JWT firmado con HMAC-SHA256 (`NEWS_ADMIN_API_KEY`).
     - Creación del post con ID `6b06218fc506c700013dceba` y slug `evolucion-tv-regresa-a-sus-origenes-con-portal-oficial`.
     - Tags asignados: `EvolucioNotas` (principal) y `Más bandas` (secundario).
     - Autor: `Equipo ETV` (mencionando a VicMan Gutiérrez y sus 13 años de trayectoria desde septiembre de 2013).
     - Imagen destacada de alta definición de concierto en vivo con luces y multitud.
     - Maquetación con subtítulos `<h2>` (Línea editorial, Música 24/7 y Apertura a bandas consolidadas / tienda oficial) y pullquote destacado.
- **Verificación Técnica**:
  - `HTTP 200 OK` en local: `http://localhost:3005/noticias/evolucion-tv-regresa-a-sus-origenes-con-portal-oficial`.
  - `HTTP 200 OK` en producción: `https://etv.webia.studio/noticias/evolucion-tv-regresa-a-sus-origenes-con-portal-oficial`.
  - Renderizado verificado en el ticker rotativo de última hora y metadatos NewsArticle Schema.org.


