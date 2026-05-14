# Documento de Reflexión — Flowbeat
**Tecnologías Disruptivas**  

_________________________________________
## Al inicio del proyecto

Decidimos construir una aplicación web llamada Flowbeat enfocada en el descubrimiento musical basado en estados de ánimo. La idea surgió porque quería crear algo diferente a una aplicación convencional de playlists: una experiencia que mezclara recomendaciones acordes al gusto del usuario con un pequeño porcentaje de exploración inesperada. Nos pareció un proyecto interesante porque combina lógica, diseño de experiencia y consumo de APIs externas.

Inicialmente esperaba que el proceso de vibe coding fuera mucho más automático. Pensabamos que bastaría con darle instrucciones claras a la IA para que generara la mayoría de la estructura del proyecto y guiara todo el desarrollo de manera casi inmediata. Al principio utilizamos una IA general que me daba instrucciones más manuales, centradas en ejecutar comandos y configurar herramientas desde cero.

Después decidimos intentar un enfoque más avanzado utilizando Spec Kit y Claude Code, ya que la idea era trabajar bajo un flujo más cercano al vibe coding moderno: primero generar especificaciones, planes y tareas automáticamente antes de implementar el código. Para lograrlo empezamos a instalar y configurar distintas herramientas necesarias para el entorno de desarrollo, incluyendo Python, Node.js, npm, npx y paquetes relacionados mediante comandos de instalación. También seguimos parte de la guía publicada por el profesor para instalar herramientas como UV y preparar el entorno correctamente.

---

## Durante el desarrollo

Durante este proceso trabajamos principalmente desde PowerShell. Una parte importante de la experiencia consistió en resolver problemas técnicos relacionados con rutas de variables de entorno (PATH), permisos de ejecución de scripts en Windows y reconocimiento de comandos como `git`, `npm` y `claude`. Varias veces el flujo se trabó por configuraciones del sistema operativo más que por errores de programación directamente. Por ejemplo, Git estaba instalado pero PowerShell no lo reconocía inicialmente, y npm presentaba bloqueos debido a las políticas de ejecución de scripts de Windows.

Luego intentamos utilizar Claude Code para seguir con el flujo completo de Spec Kit, incluyendo comandos como `/constitution`, `/specify`, `/plan`. Sin embargo, descubrimos que el acceso completo requería una suscripción Claude Pro o Max, algo que no había considerado al inicio. Ese fue uno de los puntos más inesperados del proceso: técnicamente había logrado instalar y ejecutar la herramienta, pero no podiamos continuar sin acceso pago o configuración mediante API.

### Decisiones sobre las especificaciones

A partir de ese momento decidimos adaptar el plan original. En lugar de depender completamente de Claude Code, optamos por continuar el desarrollo usando IA conversacional (Claude en el navegador) para construir el proyecto paso a paso: primero configurar Vite, luego definir la estructura HTML, después los estilos, y finalmente la lógica con la API de Last.fm.

Las especificaciones (`constitution.md` y `flowbeat-spec.md`) las construimos de manera colaborativa con la IA conversacional, documentando las decisiones técnicas que tomamos durante el proceso. No fue el flujo exacto de Spec Kit, pero cumplió la misma función: tener un documento de referencia claro antes de escribir código.

### Dónde se trabó el proceso

Los principales puntos de fricción fueron:
- Configurar las variables de entorno de Git en Windows (PATH)
- El descubrimiento de que Claude Code requería suscripción paga
- Sincronizar el repositorio local con GitHub (error de `https:https` doble por error de tipeo)
- Eliminar `counter.js` sin actualizar correctamente las referencias en `main.js`

### Ajustes al plan original

El ajuste más grande fue abandonar Claude Code como agente central y usar en su lugar la IA conversacional de Claude.ai para guiar cada decisión. Esto terminó siendo incluso más útil porque me obligó a comprender mejor la estructura del proyecto, el funcionamiento de Git, npm, y el flujo real del desarrollo frontend.


## Al final del proyecto

### ¿Qué funcionó mejor de lo esperado?

La capacidad de la IA para guiar la resolución de problemas técnicos y acelerar el aprendizaje de herramientas nuevas superó mis expectativas. También funcionó muy bien para estructurar ideas, explicar errores de consola y ayudar a organizar el proyecto de manera coherente. El resultado visual de Flowbeat quedó mucho más cuidado de lo que esperaba: diseño oscuro, animaciones fluidas, tipografía distintiva.

### ¿Qué funcionó peor de lo esperado?

La expectativa de automatización total fue la que más chocó con la realidad. En la práctica, todavía se necesita bastante intervención humana para configurar entornos, resolver incompatibilidades y tomar decisiones técnicas. El vibe coding acelera el desarrollo, pero no elimina la necesidad de entender lo que estás construyendo.

### ¿Para qué tipo de problemas volvería a usar vibe coding?

Lo volvería a usar para:
- Prototipos rápidos de ideas
- Proyectos frontend pequeños o medianos
- Exploración de tecnologías o APIs que no conozco
- Aprendizaje acelerado de ecosistemas nuevos (como aprendí Vite y Git en este proyecto)

### ¿Para qué NO lo usaría?

Probablemente no lo usaría como único método para:
- Proyectos críticos donde la seguridad importa mucho
- Sistemas con arquitecturas complejas o escalables
- Proyectos donde necesito control total sobre cada decisión técnica
- Trabajo en equipo sin convenciones claras establecidas primero

### Si pudiera aconsejarme al inicio, ¿qué me diría?

Me diría que no subestimara el tiempo necesario para preparar el entorno de desarrollo, y que entendiera que las herramientas de IA ayudan muchísimo pero no reemplazan la necesidad de comprender cómo funciona realmente el ecosistema técnico. También me aconsejaría que verificara los requisitos (y costos) de las herramientas antes de empezar a instalarlas. Y sobre todo: que los errores de configuración son parte del proceso, no señales de que algo está fundamentalmente mal.

________________________
*Repositorio del proyecto: https://github.com/Karenjuliana06/Flowbeat*
