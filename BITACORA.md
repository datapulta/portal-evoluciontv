# BITÁCORA DE DESARROLLO Y REGISTRO HISTÓRICO DE CAMBIOS — PANEL EVOLUCIÓN TV

Este documento constituye la memoria técnica y bitácora cronológica exhaustiva de todas las intervenciones, sesiones de arquitectura, cambios de código, rediseños UX/UI y despliegues del proyecto **Panel Evolución TV** (Portal web Nuxt v4 + Ghost CMS API + Señal en vivo).

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
