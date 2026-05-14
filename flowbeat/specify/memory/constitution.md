# Constitution — Flowbeat

> Principios no negociables del proyecto. Toda decisión técnica debe respetarlos.

## Stack tecnológico
- **Frontend**: Vite + Vanilla JavaScript (sin frameworks como React o Vue)
- **Estilos**: CSS puro con variables CSS (sin Tailwind, sin Bootstrap)
- **API externa**: Last.fm API (free tier) para datos musicales reales
- **Almacenamiento**: localStorage del navegador (sin backend propio)
- **Build tool**: Vite v8

## Reglas de arquitectura
- Todo el código corre en el cliente (no hay servidor propio)
- Un solo archivo HTML (`index.html`) — Single Page Application
- La lógica de la app vive en `src/main.js`
- Los estilos viven en `src/style.css`
- No usar librerías externas de JavaScript (sin jQuery, sin lodash)

## Reglas de calidad
- Siempre verificar que la API key de Last.fm esté presente antes de hacer requests
- Escapar siempre el HTML que venga de la API (prevenir XSS)
- Manejar errores de red con mensajes amigables al usuario
- La app debe funcionar sin consola de errores en Chrome DevTools

## Reglas de diseño
- Diseño mobile-first
- Tema oscuro como base (`#080b10`)
- Tipografía: Syne (display) + DM Sans (body) via Google Fonts
- Paleta: acento verde-lima (`#c8f55a`) + sorpresa rojo coral (`#ff6b6b`)
- Sin imágenes locales innecesarias — usar placeholders si la API no devuelve imagen

## Contexto del proyecto
- Proyecto académico — Tecnologías Disruptivas
- Paradigma: Vibe Coding con Spec Kit
- Desarrollado por: Juliana Borja / Karen Juliana
- Repositorio: https://github.com/Karenjuliana06/Flowbeat