# Escalar El Método: v1 → v2 desde negocio

**Alcance:** decisiones de negocio y cambios en el dashboard interno (herramienta de coaches) durante el salto de v1 a v2 de asesorías. Es un proyecto distinto del caso de estudio de la app (UX/producto); aquí la perspectiva es de negocio e interna — qué se decide, por qué, y qué construye el equipo para operar mejor.

**Estado:** en curso, documentando en tiempo real. El dashboard sigue en construcción.

---

## Cancelaciones: cuando la fricción es la funcionalidad

**Rol:** Product Designer + PM · **Área:** Retención / herramienta interna de coaches · **Estado:** Propuesta presentada, fase 1 (formulario) sin construir

### El problema de negocio

En asesorías no hay botón de cancelar. Darse de baja pasa siempre por una persona: el cliente se lo dice al coach por WhatsApp, y de ahí a un grupo interno donde una sola persona —Andrea, en calidad— ejecuta la baja a mano. En dos años ese grupo ha tramitado **10.367 fichas de cliente y 6.100 bajas**, a un ritmo de ~300 al mes.

La primera decisión de este caso no fue de diseño: fue confirmar que ese proceso manual es **deliberado, no una carencia**. Inazio lo defendió así:

> *"Si pueden cancelarlo automáticamente, va a cancelar muchísima más gente. Con el coach puedes hablar, tranquilizarle, adaptar el programa o hacer un descuento, pero si no, imposible. Eso me gusta que esté fuera de la app."*

La fricción retiene: obliga a que exista una conversación antes de la baja, y esa conversación es donde caben el ajuste de programa y el descuento. Automatizar el botón habría resuelto un problema de producto (fricción) rompiendo la palanca de negocio que esa misma fricción sostiene. Se descartó explícitamente la cancelación self-service, no por coste, sino porque el volumen de bajas que generaría era el riesgo real.

Con eso fijado, la pregunta cambia: si el proceso humano se queda, **¿qué es lo que de verdad está costando dinero y datos?**

### Lo que el proceso manual esconde

Auditar dos años de ese grupo de WhatsApp destapó cuatro costes concretos, no hipotéticos:

- **Devoluciones evitables.** El coach no ve cuándo se le cobra al cliente, así que avisa tarde y el cargo ya ha salido. Está escrito literalmente en el grupo: *"no sé si se le pasa mañana el cargo, mira a ver si le da tiempo"*.
- **Riesgo de cancelar al cliente equivocado.** El coach conoce al cliente por un nombre; el pago puede estar a nombre de la pareja o un familiar. Andrea desambigua a ojo, mensaje a mensaje.
- **Cero visibilidad de las bajas salvadas.** Hay coaches que retienen con éxito, pero eso no queda registrado en ningún sitio. El sistema solo cuenta a los que se van, nunca a los que se quedan — y la retención es exactamente la palanca que la decisión de mantener el proceso humano dice que hay que proteger.
- **300-400 motivos de baja sin estructurar.** El coach sí pregunta el porqué y sí lo transmite; el fallo no es de recogida, es de formato: texto libre mezclado con la operativa de ejecutar bajas, ilegible de forma agregada. Y ni siquiera es el corpus completo: en junio el grupo registró 305 bajas y la base de datos tiene 411. Uno de cada cuatro clientes se va sin pasar por ninguna conversación — el más silencioso, y probablemente el más importante de los tres.

Ese último punto conecta directo con la métrica que le importa al negocio: las cancelaciones son la métrica del bonus acordado con Inazio, y hoy se cuenta *cuántas*, no *por qué* — ni *cuántas se evitan*.

### La propuesta: estructurar sin tocar la fricción

El diseño no toca la decisión de mantener la conversación humana. Lo que cambia es el canal por el que corre la información antes y después de esa conversación.

**El coach**, en vez de escribir a un grupo, entra en la ficha del cliente y pulsa *Solicitar baja*: el cliente ya está identificado (sin copiar nombre, email, teléfono a mano), la pantalla avisa del próximo cobro, y el motivo se elige de una lista corta más un campo libre. Si todavía está intentando retenerlo, la solicitud se marca *en retención* y no se envía todavía — el sistema deja de ser ciego a los intentos de retención en curso.

**Andrea** deja de leer un chat y pasa a trabajar sobre una bandeja ordenada por proximidad de cobro: lo urgente sube solo, sin que nadie tenga que avisarla, y cada solicitud llega con el cliente y su suscripción ya enlazados.

El recorrido de una baja queda como una máquina de estados explícita — *en retención → pendiente → ejecutada / rechazada*, con salida a *recuperado* si el cliente se queda — que es, en sí mismo, el dato que hoy no existe: cuántas bajas se salvan y qué coach retiene mejor.

### Cómo se decidió construirlo

La propuesta se secuenció en dos fases explícitamente para no comprometer desarrollo antes de validar adopción: primero un formulario suelto que sustituye al grupo, sin tocar el dashboard; solo si los coaches lo adoptan (y no vuelven al grupo) se integra dentro de la herramienta que ya usan a diario. Es una apuesta barata: *"si en la primera fase los coaches se saltan el formulario y vuelven al grupo, nos habremos ahorrado el desarrollo."*

### Por qué importa a nivel de negocio

Este caso es la intersección entre tres piezas que hasta ahora vivían separadas: el bonus por cancelaciones, el plan de analytics de negocio (que hoy no distingue churn voluntario de involuntario, ni tiene motivo estructurado dentro del voluntario) y la herramienta interna de coaches. El formulario de baja no es una feature de UX aislada — es la pieza de instrumentación que le falta al North Star metric de asesorías (clientes activos pagando) para poder desglosar *por qué* se mueve, no solo cuánto.

### Materiales

- Análisis del flujo actual y decisiones D1–D3 (`elmetodo_asesorias/casos-de-estudio/flujo-cancelaciones-asesorias.md`)
- Propuesta presentada a Inazio, 4 de agosto de 2026 (mismo archivo, y `analisis-whatsapp/flujo-cancelaciones-propuesta.md`)
- Conexión con el plan de métricas de negocio (`metricas-negocio-plan.md`)
