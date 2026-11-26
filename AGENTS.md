# AGENTS.md — Reglas Operativas, Arquitectura y Guía para Agentes de IA

Este documento define el conjunto obligatorio de principios, reglas operativas, directrices de arquitectura, flujo de trabajo Git y estándares de calidad para cualquier agente de Inteligencia Artificial (IA) o desarrollador que colabore en el proyecto **Panel Evolución TV**.

### Arquitectura de Panel Evolución TV

| Componente | Propósito | Tecnología Base | Infraestructura & Entorno |
| :--- | :--- | :--- | :--- |
| **Sitio Público & Panel** | Portal informativo, reproductor de señal en vivo y noticias | Nuxt v4 (`^4.6.4`), Vue 3, Tailwind CSS v4 | Node.js SSR / Hybrid |
| **Backend & Motor HTTP** | API interna y rutas de servidor | Nitro Engine | Contenedor Docker en Dokploy VPS |
| **CMS Editorial** | Gestión de artículos, autores y contenido periodístico | Ghost CMS API | Endpoint remoto (`https://cms-etv.webia.studio`) |
| **Streaming en Vivo** | Retransmisión de señal televisiva independiente | HLS / Video Player | CDN / Transmisión en vivo dedicada |

---

## 1. Principio Fundamental de Comunicación

> [!IMPORTANT]
> ### REGLA DE ORO (BLOQUEANTE): "Confirma el dato antes de hacer cambios o planes"
> 1. **Cero Suposiciones**: Nunca realices modificaciones de código, creación de ramas, ni planes de trabajo sin antes explicar el diagnóstico técnico, la causa raíz y la solución propuesta al usuario, solicitando su confirmación explícita.
> 2. **Transparencia en Diagnósticos**: Cuando el usuario reporte una falla o anomalía visual/funcional, inspecciona el código y los recursos visuales, expón el motivo exacto por el que ocurre el problema y espera la confirmación antes de actuar.
> 3. **Modo Planificación**: Para cambios no triviales, presenta siempre un plan formal (`implementation_plan.md` o artefacto equivalente) y espera la aprobación antes de tocar archivos de código o ejecutar comandos modificadores.
> 4. **Carácter Obligatorio e Irrenunciable**: Esta regla NO es una recomendación de estilo, es una **compuerta bloqueante**. Ningún agente de IA puede invocarla como opcional, saltarla "por eficiencia", "porque el cambio es pequeño", "porque es solo documentación", ni porque el usuario haya dado una instrucción ambigua. Si hay duda sobre si se obtuvo la confirmación, **no se ejecuta el cambio**.
> 5. **Definición de "el dato"**: Confirmar el dato significa **leer la fuente real**, nunca inferirla. Como mínimo debe verificarse: el contenido vigente del archivo y la línea exacta a tocar, la rama activa y el estado del árbol de trabajo, los valores reales de configuración, variables de entorno y endpoints de Ghost CMS, y la estructura de componentes antes de escribir código. Un dato no leído es un supuesto, y un supuesto debe declararse como tal y no presentarse como hecho.

### 1.1 Protocolo Obligatorio de Confirmación (4 pasos, en orden)

Ningún agente puede avanzar al paso siguiente sin completar el anterior y sin recibir autorización explícita del usuario:

| Paso | Contenido exigido | Prohibido en este paso |
| :--- | :--- | :--- |
| **1. Dato** | Evidencia leída de la fuente real, citando `archivo:línea` y el valor exacto encontrado. | Declarar hechos sin haber leído la fuente (`"seguramente"`, `"debería ser"`, `"como en otros proyectos"`). |
| **2. Diagnóstico** | Causa raíz técnica del problema o del requerimiento, y por qué ocurre exactamente ahí. | Proponer soluciones antes de establecer la causa raíz. |
| **3. Propuesta** | Cambio concreto (archivo, bloque, alcance) + riesgo + plan de verificación + rollback. | Tocar cualquier archivo, crear ramas o ejecutar comandos modificadores. |
| **4. Autorización** | Esperar la confirmación explícita del usuario **para ese paso específico**. | Interpretar el silencio, la ausencia de objeción, un emoji, o un `"ok"` genérico como aprobación. |

### 1.2 Formato Mínimo de Reporte Previo

```text
DATO CONFIRMADO : <archivo:línea> → <valor real leído>
CAUSA RAÍZ      : <explicación técnica>
CAMBIO PROPUESTO: <archivo + bloque exacto>
RIESGO / IMPACTO: <qué puede romperse>
VERIFICACIÓN    : <cómo se comprobará>
AUTORIZACIÓN    : PENDIENTE (no se ejecuta hasta confirmación)
```

### 1.3 Prohibiciones Explícitas

1. **No asumir el contenido de un archivo sin leerlo** en la sesión actual.
2. **No usar la memoria del contexto previo como fuente de verdad**: los archivos, ramas, versiones y dependencias cambian; verificar siempre contra el estado actual en disco y en Git.
3. **No agrupar cambios no solicitados** dentro de una autorización concedida para otra cosa ("aprovechando", "de paso", "mientras estaba ahí").
4. **No declarar una tarea como terminada** sin haber ejecutado su verificación real (`npm run build`, llamadas HTTP de comprobación, validación de endpoints de Ghost).
5. **No interpretar la autorización de un paso como autorización de los pasos siguientes**: cada merge, despliegue o rotación de variables de entorno requiere su propia autorización individual.
6. **No ocultar incumplimientos**: si por cualquier motivo se modificó algo sin la confirmación previa, el agente debe detenerse, declararlo de inmediato y revertir el cambio.

### 1.4 Excepción Única

Solo se permite ejecutar sin autorización previa la **inspección de solo lectura** (leer archivos, listar directorios, consultar `git status`/`git log`/`git diff`, buscar con `rg` o `grep`). Cualquier comando que escriba, borre, cree ramas, instale dependencias, compile o despliegue queda sujeto al protocolo de §1.1.

### 1.5 Trazabilidad del Cumplimiento

- El mensaje de commit de cualquier cambio debe dejar rastro de qué autorización lo habilitó.
- Todo cambio relevante o sesión de desarrollo debe registrarse en `BITACORA.md`.
- Un agente que no pueda cumplir esta regla debe declararlo y abstenerse de operar sobre el repositorio.

---

## 2. Zona Intocable y Código en Funcionamiento

> [!CAUTION]
> ### REGLA DE ORO COMPLEMENTARIA (BLOQUEANTE): "No alteres lo que ya funciona"
> 1. **Prohibido modificar configuraciones estructurales sin autorización por archivo**: ningún agente de IA puede reescribir, refactorizar, renombrar ni reordenar la lógica de los archivos declarados como **zona intocable**.
> 2. **Prohibido alterar código en producción sin plan formal**: "Funciona, pero se puede mejorar", "es más limpio así", "es solo un ajuste menor" y "aprovechando que estaba ahí" **NO** son autorizaciones válidas.
> 3. **Tolerancia cero a daño colateral**: si un cambio solicitado obliga a alterar la zona intocable, el agente debe detenerse, reportar el conflicto y **esperar autorización específica para ese archivo**.

### 2.1 Tabla de Zona Intocable (Panel Evolución TV)

| Archivo (ZONA INTOCABLE) | Propósito Esencial |
| :--- | :--- |
| `nuxt.config.ts` | Configuración maestra de build, plugins de Vite, SSR, runtimeConfig y headers |
| `Dockerfile` | Configuración del contenedor Docker para compilación y ejecución en Dokploy VPS |
| `package.json` | Definición de dependencias principales y scripts de ejecución |
| `.env.example` / `.env` | Contrato de variables de entorno (Ghost CMS URL, claves de API) |

---

## 3. Diferenciación Obligatoria entre Pregunta y Orden de Trabajo

> [!IMPORTANT]
> ### REGLA DE ORO (BLOQUEANTE): "Todo mensaje con signo de interrogación es una PREGUNTA, no una orden"
> 1. **Detección**: cualquier mensaje del usuario que contenga el signo `?` (o el signo de apertura `¿`) se interpreta **exclusivamente como pregunta o consulta informativa**, sin excepción y sin importar el resto del texto.
> 2. **Prohibición absoluta mientras sea pregunta**: el agente NO puede ejecutar, modificar, ajustar, corregir, crear, borrar, renombrar, mover, crear ramas, instalar dependencias, compilar, ni desplegar. Esto incluye cambios "obvios", "triviales", "de una sola línea" o "de solo documentación".
> 3. **Respuesta permitida**: entregar el diagnóstico leído de la fuente real (`DATO CONFIRMADO` + `CAUSA RAÍZ`) y terminar con `CAMBIO PROPUESTO` + `RIESGO / IMPACTO` + `VERIFICACIÓN` + `AUTORIZACIÓN: PENDIENTE`, dejando la ejecución en manos del usuario.
> 4. **Una pregunta NO se convierte en autorización por su forma**: no importa si suena imperativa (*"¿por qué no lo arreglas?"*, *"¿puedes dejar eso listo?"*), si es retórica, si expresa urgencia o molestia, ni si el contexto anterior sugería que el usuario quería el cambio. Si hay `?`, **no se ejecuta**.
> 5. **Autorización válida**: la única forma de habilitar la ejecución es una instrucción explícita e imperativa que **no** sea pregunta (por ejemplo: *"hazlo"*, *"aplica el cambio"*, *"ejecuta la corrección"*, *"agrégalo al archivo"*). Un `"ok"`, un emoji, el silencio o la ausencia de objeción **no autorizan** (§1.1 paso 4).
> 6. **Excepción única**: la inspección de **solo lectura** descrita en §1.4 sigue permitida, ya que es indispensable para poder responder la pregunta.
> 7. **Declaración obligatoria de estado**: al responder una pregunta, el agente debe declarar explícitamente que **no ejecutó ni modificó nada**, y ofrecer el cambio como propuesta pendiente de autorización.

### 3.1 Tabla de Interpretación de Mensajes

| Mensaje del usuario | Interpretación | Acción permitida al agente |
| :--- | :--- | :--- |
| *"¿Por qué no cargan los artículos de Ghost?"* | Pregunta | Inspección de solo lectura + diagnóstico. **Cero cambios.** |
| *"¿Puedes arreglar el reproductor de TV?"* | Pregunta | Diagnosticar y proponer el cambio. **Esperar autorización explícita.** |
| *"¿Se puede agregar este estilo al header?"* | Pregunta | Explicar el cambio propuesto. **No escribir en el archivo.** |
| *"Arregla el reproductor de TV"* | Orden | Iniciar el protocolo §1.1 (Dato → Diagnóstico → Propuesta → **Autorización**). |
| *"Aplica el cambio"* / *"hazlo"* / *"adelante"* | Orden explícita | Ejecutar el cambio autorizado y verificar. |
| `"ok"` · emoji · silencio · *"interesante"* | Ninguna de las dos | **No autoriza nada.** Solicitar confirmación explícita. |

---

## 4. Plan Previo y Palabra de Autorización

> [!IMPORTANT]
> ### REGLA DE ORO (BLOQUEANTE): "Nada se construye sin plan aprobado"
> 1. **Plan obligatorio**: antes de construir, modificar, mejorar o corregir cualquier cosa, el agente presenta un plan con: qué va a hacer, qué archivos va a tocar, por qué, qué puede romperse y cómo lo comprobará.
> 2. **Ejecución única**: el plan aprobado se ejecuta de una sola vez. El agente **no** pide autorización archivo por archivo.
> 3. **Palabras que autorizan la ejecución**, válidas únicamente cuando vienen **solas en el mensaje**: `adelante`, `de acuerdo`, `te doy autorizacion`, `te doy luz verde`.
> 4. **Aprobación Nativa mediante el Botón/Comando de "Plan" en Antigravity**:
>    - Cuando el usuario invoque el comando `/plan` o el agente genere un artefacto de plan formal (`plan_*.md` o `implementation_plan.md` con `RequestFeedback: true`), **la acción del usuario de presionar el botón "Proceed" / "Ejecutar Plan" (o el mensaje del sistema "The user has approved this document") equivale de manera 100% oficial y directa a las palabras de autorización (`adelante`, `de acuerdo`)**.
>    - Al recibir esta señal de aprobación del plan, el agente queda plenamente autorizado para ejecutar el plan aprobado en su totalidad de una sola vez, sin requerir reconfirmaciones redundantes.
> 5. **Contexto conversacional**: si esas palabras aparecen **dentro de un mensaje con más texto**, cuentan como conversación normal y **no autorizan**. Ejemplo: *"estoy de acuerdo con lo que dijiste del diseño"* no autoriza ninguna escritura.
> 6. **Nunca autorizan**, bajo circunstancia alguna: `ok`, `ok?`, `va`, `bien`, `excelente`, un emoji, el silencio o la ausencia de objeción.
> 7. **Respuesta primero**: el operador **siempre** recibe respuesta antes de que el agente toque un archivo. Ningún turno termina en edición silenciosa.
> 8. **Fallo a media tarea**: si algo falla durante la ejecución, el agente termina lo posible y reporta qué quedó hecho y qué no, **sin reintentar a ciegas** ni repetir el mismo método.
> 9. **Palabra clave del operador**: si el mensaje contiene *"confirma el dato"* o *"confirma el dato antes de hacer cambios"*, el agente entrega el dato leído de la fuente real y el plan propuesto, **sin ejecutar ningún cambio**, tenga o no signo de interrogación y aunque la consulta suene a orden.

---

## 5. Protocolo y Ciclo de Vida de Git (4 Fases Obligatorias)

> [!CAUTION]
> ### PROHIBICIÓN ABSOLUTA: Cero Commits Directos a 'main' o 'master'
> 1. **Prohibido tocar la rama principal directamente**: JAMÁS realices un commit, push o modificación directa sobre la rama `main` o `master`.
> 2. **Toda modificación nace en una rama**: Sin importar la naturaleza del cambio (característica, bugfix, refactorización, estilos o documentación), el trabajo debe originarse y comprometerse **exclusivamente dentro de una rama dedicada (`feat/*`, `fix/*`, `docs/*`, etc.)**.
> 3. **Preservación Permanente de Ramas (PROHIBIDO ELIMINAR RAMAS)**:
>    - Bajo ninguna circunstancia se deben eliminar las ramas creadas tras hacer merge. Cada rama representa un registro histórico auditable.
> 4. **Aprobación Escalonada hacia Main/Master**: El merge hacia la rama principal se realiza **únicamente** tras la validación de compilación (`npm run build`) y la autorización explícita del usuario.
> 5. **Una Rama por Función / Característica (Aislamiento de Alcance — BLOQUEANTE)**: Cada nueva función, rediseño, corrección o documento debe desarrollarse en su propia rama semántica (`feat/<funcion>`, `style/<diseno>`, `fix/<correccion>`, `docs/<documentacion>`, `chore/<tarea>`). **Nunca agrupes múltiples cambios o funciones distintas en una misma rama.**
> 6. **Merge `--no-ff` Obligatorio hacia `main`**: Toda integración a `main` debe ejecutarse con `git merge --no-ff <rama> -m "merge: <rama> a main (<resumen>)"` para preservar el nodo de unión en el historial y facilitar la lectura a todo el equipo de programadores.
> 7. **Publicación de Ramas en GitHub**: Además de `main`, toda rama de trabajo creada debe subirse al repositorio remoto (`git push origin <rama>`), manteniendo en GitHub el mapa completo de funciones desarrolladas.
> 8. **Tag Semántico Obligatorio en cada Release a `main` (`vX.Y.Z`)**: Todo merge hacia `main` debe etiquetarse inmediatamente con un tag anotado consecutivo (`git tag -a vX.Y.Z -m "Release vX.Y.Z: <resumen>"`) y subirse al remoto (`git push origin vX.Y.Z`) junto con la rama de trabajo y `main`, garantizando trazabilidad de releases y despliegues en Dokploy.
> 9. **Registro Obligatorio en `BITACORA.md` (DE LEY / BLOQUEANTE)**: Antes de hacer `merge --no-ff` a `main` y etiquetar un release, es **estrictamente obligatorio** registrar la nueva sesión en `BITACORA.md` (indicando rama, tag, autorización, archivos modificados y verificación). Ningún cambio se considera completo ni autorizado para cierre sin su entrada en `BITACORA.md`.
