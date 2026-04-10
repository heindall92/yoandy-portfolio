# Memory: features/technical-reports

Sistema de visualización de informes técnicos basado en rutas dinámicas e iframes que cargan archivos HTML desde 'public/reports/'. **TODOS los informes deben seguir estrictamente el formato de Brutus.** Sin excepciones.

## Formato Brutus (obligatorio para todos los reportes):

1. **Esquema de colores**: Fondo azul oscuro (#0a0e1a) con acentos verde (#4ade80).
2. **Encabezado hero**: Centrado y proporcionado con contenedor `.hero-inner` de `max-width: 1200px`.
3. **Barra lateral (sidebar)**: Secciones de Skills (con barras de progreso), Tools, MITRE ATT&CK y Tabla de Contenidos (TOC).
4. **Tipografía**: Sistema ('Segoe UI', sans-serif) sin dependencias externas.
5. **Sin navegación interna**: No logos ni barras de retroceso propias; el portfolio proporciona la navegación global.
6. **Fondo animado Matrix**: Canvas con efecto de caracteres cayendo, sincronizado con la página principal.
7. **Bloques de código**: Cabecera de terminal estilo macOS (botones rojo, amarillo, verde + etiqueta 'terminal'). Control de overflow para evitar romper el layout.
8. **Secciones numeradas**: Contenido con numeración destacada y colores de tokens (cred/flag/highlight).
9. **Layout responsive**: Dos columnas (contenido + sidebar) en desktop, una columna en mobile.
10. **Tarjetas de descripción**: Cada máquina debe tener una descripción técnica precisa que refleje la cadena de ataque real del reporte (vector de entrada, explotación, escalada, técnicas usadas).

## Checklist al crear un nuevo reporte:
- [ ] Copiar estructura HTML de Brutus como plantilla
- [ ] Adaptar colores hero según plataforma (verde HTB, magenta HackMyVM)
- [ ] Verificar que hero-inner esté centrado con max-width 1200px
- [ ] Incluir sidebar con Skills, Tools, MITRE, TOC
- [ ] Agregar canvas Matrix al final
- [ ] Verificar bloques de código con cabecera terminal
- [ ] Actualizar tarjeta en Machines.tsx/HackMyVM.tsx con descripción técnica precisa
- [ ] Verificar que el botón "atrás" redirige a la sección correcta (no a Index)
