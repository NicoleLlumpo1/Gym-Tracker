# 🏋️ GymTracker — Registro de Entrenamiento 2026

Aplicación web personal para registrar el entrenamiento diario: asistencia, cardio, ejercicios con cargas, y sensaciones físicas. Desarrollada con **HTML, CSS y JavaScript** — sin frameworks ni dependencias externas.

Inspirada en mis propias planillas de Excel que usaba para trackear todo, transformadas en una sola app que puedo abrir desde cualquier dispositivo.

## Demo

> Abrí `index.html` directo en el navegador. No necesita servidor ni conexión a internet.

---

## Funcionalidades

| Módulo | Qué registra |
|---|---|
| **Hoy** | Grupo muscular, energía (1–5), fatiga, sensación post-entreno, progresión, calidad de sueño, molestias y notas libres |
| **Cardio** | Min caminando / corriendo / bici · pulsaciones · total automático |
| **Ejercicios** | Nombre, descripción del peso, kg totales, series y semana — con progresión visual por mes |
| **Asistencia** | Grilla mensual ✅/❌ por día para gym y cardio por separado |
| **Historial** | Todos los registros filtrados por mes con badges de estado |
| **Rutina** | Rutina semanal completa con ejercicios y series, consultable offline |
| **Rutina del día** | En *Ejercicios*: armás la rutina de hoy (cambiás variantes, salteás ejercicios con ✕, agregás otros) y la guardás de una vez, con kg precargados del último registro |
| **Ejercicio suelto** | Grupo muscular → ejercicio → variante (agarre abierto/cerrado, libre/hack/con mancuerna, etc.); podés crear ejercicios y variantes nuevos |
| **Recordatorio** | Notificación diaria (Lun–Vie) "Hoy no completaste tu rutina" + banner de estado en *Hoy* |

---

## Estructura del proyecto

```
gymtracker/
├── gym.css
├── gym.js 
├── index.html    
└── README.md
```

---

## Cómo usar

```bash
# Abrí directo en el navegador
open index.html

# O con Live Server (VSCode)
# Click derecho en index.html → "Open with Live Server"
```

Al abrirlo por primera vez, la app está vacía. Empezá desde la pestaña **"Hoy"** para registrar tu primer entrenamiento.

---

## Persistencia de datos

Todos los datos se guardan en `localStorage` del navegador, organizados en estas colecciones:

| Key | Contenido |
|---|---|
| `registros` | Registros diarios (energía, fatiga, sensaciones, etc.) |
| `cardios` | Sesiones de cardio con minutos por modalidad |
| `ejercicios` | Cargas por ejercicio, semana y mes |
| `asist_gym` | Asistencia al gym por mes (✅/❌ por día) |
| `asist_cardio` | Cardio completado por mes (✅/❌ por día) |
| `recordatorio` | Configuración del aviso diario (activo, hora, último aviso) |
| `ejerciciosPersonalizados` | Ejercicios nuevos creados por vos (grupo + nombre) |
| `variantesPersonalizadas` | Variantes nuevas por ejercicio |
| `ultimaVariante` | Última variante usada por ejercicio (queda preseleccionada) |

---

## Decisiones de diseño

- **Una sola pestaña = un solo flujo**: cada módulo tiene su propia pantalla para no mezclar datos.
- **Guardar desde "Hoy" marca asistencia automáticamente**: si guardás un registro, el día se marca ✅ en la grilla de asistencia.
- **Guardar cardio también actualiza asistencia**: consistencia entre módulos sin doble entrada.
- **Progresión visual**: cada ejercicio muestra barras de progreso relativas al peso máximo del mes para visualizar la evolución.

---

## Origen del proyecto

Reemplacé 5 archivos de Excel (Asistencia, Cardio, Proceso Piernas, Proceso Superior, Registro Simple) con esta app unificada. La lógica de cada planilla está representada en la estructura de datos y los módulos de la app.

---

> Desarrollado por **Nicole Llumpo** — Futura Ingeniera en Sistemas de Información 
> Buenos Aires, 2026