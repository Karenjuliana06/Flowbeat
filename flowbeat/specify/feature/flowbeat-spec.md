# Spec — Flowbeat: Descubrimiento Musical por Estado de Ánimo

**Feature**: Core de la aplicación  
**Branch**: main  
**Estado**: ✅ Implementada  

---

## 1. Intención

Flowbeat es una plataforma web de descubrimiento musical diseñada para romper la "burbuja algorítmica". A diferencia de apps como Spotify o YouTube Music que refuerzan siempre los mismos gustos, Flowbeat introduce intencionalmente un porcentaje de música desconocida y sorpresiva, obligando al usuario a expandir sus horizontes musicales.

**Problema que resuelve**: Los algoritmos de recomendación tradicionales crean bucles de retroalimentación que limitan la exploración musical.

**Usuarios objetivo**: Personas que quieren descubrir música nueva pero no saben por dónde empezar.

---

## 2. Funcionalidades especificadas

### 2.1 Selector de estado de ánimo
El usuario elige entre 4 estados de ánimo:
- ⚡ **Energético** — canciones de géneros como dance y electronic
- 🌧 **Melancólico** — géneros como indie, folk y sad
- 🌿 **Relajado** — géneros como chill, lo-fi y acoustic
- 🔥 **Eufórico** — géneros como hip-hop, R&B y euphoria

### 2.2 Motor de recomendación 70/30
Dado un estado de ánimo seleccionado:
- **70% familiar**: 7 canciones del tag principal del mood
- **30% sorpresa**: 3 canciones de un tag inesperado/diferente
- Las canciones se mezclan aleatoriamente en la lista final
- Cada canción está marcada visualmente como "Familiar" o "Sorpresa"

### 2.3 Datos reales via Last.fm API
- Endpoint usado: `tag.getTopTracks`
- Se selecciona aleatoriamente un tag primario y uno sorpresa del mood
- Se obtienen hasta 30 canciones del tag primario y 15 del sorpresa
- Cada canción muestra: nombre, artista, imagen de portada (si existe), badge de tipo

### 2.4 Guardar descubrimientos
- Botón de estrella (☆/★) en cada canción para guardarla
- Al guardar, la canción se almacena en `localStorage` bajo la key `flowbeat_history`
- El historial persiste entre sesiones del navegador

### 2.5 Panel de historial
- Botón en el header que muestra el contador de canciones guardadas
- Panel lateral deslizante con todas las canciones guardadas
- Opción de eliminar canciones individuales del historial
- Opción de limpiar todo el historial

### 2.6 Refrescar sesión
- Botón "Refrescar" que vuelve a llamar la API con el mismo mood
- Genera una selección diferente gracias al shuffle aleatorio

---

## 3. Flujo de usuario

```
Usuario abre la app
        ↓
Ve las 4 cards de estado de ánimo
        ↓
Hace clic en un mood
        ↓
Loader "Buscando tu próxima obsesión..."
        ↓
Se muestran 10 canciones (7 familiar + 3 sorpresa)
        ↓
Usuario escucha en Last.fm (link externo) / guarda favoritas
        ↓
Puede refrescar para obtener nuevas canciones del mismo mood
        ↓
Puede ver su historial de descubrimientos en el panel lateral
```

---

## 4. Estados de la UI

| Estado | Descripción |
|--------|-------------|
| Inicial | Hero + 4 cards de mood visibles |
| Cargando | Loader animado visible, results oculto |
| Con resultados | Lista de 10 tracks visible con badges |
| Error de API | Mensaje amigable de error en lugar de tracks |
| Historial abierto | Panel lateral visible + overlay oscuro |

---

## 5. Decisiones técnicas tomadas

| Decisión | Alternativa descartada | Razón |
|----------|----------------------|-------|
| Vanilla JS | React / Vue | Proyecto pequeño, sin necesidad de reactividad compleja |
| Last.fm API | Spotify API | Last.fm es gratuita sin OAuth requerido |
| localStorage | Base de datos | Sin backend propio en el scope del proyecto |
| CSS puro | Tailwind | Control total del diseño, sin dependencias |
| `Promise.all` para fetch | Fetch secuencial | Reduce tiempo de carga a la mitad |

---

## 6. Limitaciones conocidas

- Last.fm no provee previews de audio (solo links a su plataforma)
- Las imágenes de portada pueden estar vacías para algunas canciones
- El free tier de Last.fm tiene rate limiting (no relevante para uso académico)
- Sin autenticación de usuarios — el historial es local por dispositivo