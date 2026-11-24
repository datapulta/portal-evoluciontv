# Panel Evolución TV — Portal de Noticias y Señal Digital

Plataforma digital oficial del medio de comunicación independiente **Evolución TV**, diseñada para la cobertura periodística en tiempo real, difusión de investigaciones especiales y retransmisión de señal televisiva en vivo las 24 horas del día.

---

## 🏛️ Arquitectura del Sistema

| Componente | Tecnología | Entorno / Infraestructura |
| :--- | :--- | :--- |
| **Frontend Web** | [Nuxt v4](https://nuxt.com/) (`^4.6.4`), Vue 3, Tailwind CSS v4, Vite 8 | Node.js SSR / Hybrid |
| **Backend & Motor HTTP** | Nitro Engine | Contenedor Docker en Dokploy VPS |
| **CMS Editorial** | [Ghost CMS](https://ghost.org/) (Ghost Content API) | `https://cms-etv.webia.studio` (Dokploy Compose + MySQL 8) |
| **Transmisión de TV** | Reproductor multimedia HLS / Video Digital | Señal en vivo integrada 24/7 |

---

## 🚀 Inicio Rápido (Desarrollo Local)

### 1. Requisitos Previos
* **Node.js**: v22 LTS o superior (v26 compatible)
* **npm**: v11 o superior

### 2. Instalación de Dependencias
```bash
npm install
```

### 3. Variables de Entorno
Copia el archivo de ejemplo para configurar el enlace con Ghost CMS:
```bash
cp .env.example .env
```

Contenido del archivo `.env`:
```env
# URL de la instancia de Ghost CMS en Dokploy
NUXT_PUBLIC_GHOST_API_URL=https://cms-etv.webia.studio

# Clave de API de Contenido de Ghost (generada en Ghost Admin -> Settings -> Integrations)
NUXT_PUBLIC_GHOST_CONTENT_KEY=
```
> *Nota: Mientras no se ingrese una clave de API, el portal operará automáticamente con los contenidos editoriales de respaldo de Evolución TV.*

### 4. Servidor de Desarrollo
```bash
npm run dev
```

El servidor iniciará en: **[http://localhost:3005](http://localhost:3005)** *(puerto 3005 configurado para evitar colisiones con Dokploy local en el puerto 3000)*.

---

## 📦 Compilación y Despliegue en Producción

### Compilación local
```bash
npm run build
npm run preview
```

### Despliegue con Docker (Dokploy VPS)
El repositorio incluye un `Dockerfile` multi-stage optimizado para producción con Node.js 22 LTS:

```bash
docker build -t evoluciontv-web .
docker run -p 3000:3000 evoluciontv-web
```

---

## 📂 Estructura del Proyecto

```text
panel-evoluciontv/
├── app/
│   ├── assets/css/main.css         # Estilos globales y Tailwind CSS v4
│   ├── components/
│   │   ├── HeaderNav.vue          # Barra de navegación, última hora y fecha
│   │   ├── LiveStreamSection.vue  # Reproductor de televisión y parrilla de programación
│   │   ├── NewsCard.vue           # Tarjeta modular de noticias
│   │   └── FooterSection.vue      # Pie editorial e institucional
│   ├── composables/
│   │   └── useGhost.ts            # Cliente desacoplado de Ghost Content API
│   └── app.vue                    # Maquetación del Home Page
├── public/
│   └── favicon.svg                # Isotipo oficial de Evolución TV
├── AGENTS.md                      # Reglas operativas y gobernanza de IA
├── BITACORA.md                    # Registro histórico de intervenciones técnicas
├── Dockerfile                     # Multi-stage build para despliegue en Dokploy
├── nuxt.config.ts                 # Configuración de Nuxt 4, Vite y puerto 3005
└── package.json                   # Dependencias principales
```

---

## 📜 Gobernanza y Reglas de Desarrollo

Este repositorio opera bajo las directrices estrictas definidas en [AGENTS.md](./AGENTS.md):
- **Cero cambios sin confirmación previa de datos.**
- **Prohibido realizar commits directos a `main` o `master`.**
- **Preservación permanente del historial de ramas.**
- **Registro cronológico obligatorio en [BITACORA.md](./BITACORA.md).**
