# Nucleo Glass Icons — aviso de copyright

Los ficheros SVG de esta carpeta son **Nucleo Glass Icons**, propiedad de Nucleo.

    Icons by Nucleo — https://nucleoapp.com

## Licencia

Se usan bajo la [Nucleo Standard License](https://nucleoapp.com/license). Los
puntos que nos afectan:

- Uso ilimitado en proyectos personales y comerciales, propios o de cliente.
- **Máximo 250 iconos por proyecto** (100 si el proyecto es open source o se
  distribuye como plantilla/tema/plugin). Aquí hay 100.
- **No se pueden sublicenciar, revender, compartir ni redistribuir**, ni
  originales ni modificados.

Esa última cláusula es la razón por la que **este repositorio debe permanecer
privado**. Si en algún momento se hace público, hay que revisar el conteo (100
es justo el límite para open source) y este aviso pasa a ser obligatorio en los
ficheros descargables.

Nucleo los anuncia como "open-source SVG icons" en su página de iconos
gratuitos, pero no publican ninguna licencia libre (ni MIT, ni CC): la única
licencia que existe es la Standard License propietaria enlazada arriba.

## Procedencia

Extraídos del paquete npm [`nucleo-glass-icons`](https://github.com/tinglinzh/nucleo-glass-icons)
v0.2.1, un envoltorio de terceros (MIT sobre su propio código, no sobre el arte).
Contiene 100 de los 200+ iconos del set oficial, porque la descarga oficial exige
la app de escritorio de Nucleo.

Si hacen falta los que faltan: instalar la app de Nucleo, importar el set
`Nucleo-Glass-Essential` y exportar a SVG.

## Cómo se generaron

Los `id` internos de cada SVG venían minificados (`a`, `b`, `c`) e iguales en
todos los ficheros. Se han prefijado con el nombre del icono (`rocket-a`) para
que no colisionen si algún día se inlinean varios en el mismo documento.

## Degradado del cuerpo

Nucleo los sirve con el cuerpo en gris oscuro (`#575757` → `#151515`), pensado
para fondo claro. Sobre `--bg-base` (#0b1530) ese cuerpo desaparecía: las aletas
del cohete, la pupila del ojo o la placa inferior de `layers` quedaban negro
sobre azul muy oscuro.

Se ha sustituido por un degradado claro y frío:

    #f4f6fb → #5f6f8c

El tono de arriba es exactamente `--w-moon`, así que el set engancha con la
paleta meteorológica que ya existe. El de abajo es más profundo a propósito: si
se sube demasiado (p. ej. `#d6dbe6`), el cuerpo y el panel de cristal se igualan
en valor y el icono pierde las capas, que es justo lo que lo hace funcionar en
tamaño grande.

Para cambiarlo, un buscar-y-reemplazar de esos dos hex sobre los 100 ficheros.
