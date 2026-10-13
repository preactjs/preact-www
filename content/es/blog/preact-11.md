---
title: Preact 11
description: '¡La espera por fin ha terminado: Preact 11 ya está aquí!'
date: 2026-09-29
authors:
  - The Preact Team
---

# Preact 11

¡La espera por fin ha terminado: Preact 11 ya está aquí!

Preact 11 es una actualización incremental que se apoya en la estabilidad y fiabilidad de Preact X e incorpora nuevas funcionalidades como la [hidratación 2.0](/guide/v11/upgrade-guide#hydration-20), el [reenvío automático de refs](/guide/v11/upgrade-guide#refs-are-forwarded-by-default) y las [comprobaciones de igualdad con Object.is en los argumentos de los hooks](/guide/v11/upgrade-guide#objectis-for-equality-checks-in-hook-arguments).

La incidencia [Road to Preact 11](https://github.com/preactjs/preact/issues/2621) se abrió hace más de seis años y, desde entonces, hemos logrado prolongar la vida de Preact X mucho más de lo que imaginábamos en aquel momento. Muchas funcionalidades, refactorizaciones y mejoras generales que parecían imposibles sin introducir cambios que rompieran la compatibilidad encontraron su lugar en X. Sin embargo, esto requirió un trabajo considerable para evitar que el rendimiento y el tamaño de la biblioteca se vieran afectados negativamente para quienes la utilizan.

Por eso hemos decidido que, por fin, ha llegado el momento de reunir todos los cambios que rompen la compatibilidad que hemos estado considerando durante estos años y lanzar una nueva versión mayor de Preact. Preact 11 nos permitirá desarrollar para la web moderna, depurar algunas funcionalidades que nunca llegaron a consolidarse y ofrecer un soporte mejor y más eficiente a los usuarios de ahora en adelante.

La [guía de actualización](/guide/v11/upgrade-guide) contiene toda la información necesaria para migrar tus aplicaciones de Preact X a Preact 11, incluida la lista de nuevas funcionalidades y las versiones de navegador compatibles. Para la mayoría de los usuarios, la actualización debería ser sencilla y rápida, ya que la mayor parte de los cambios están relacionados con los tipos: hemos trabajado mucho para hacerlos más estrictos y exportarlos desde una ubicación más adecuada.

Todos nuestros paquetes oficiales, como [@preact/signals](https://github.com/preactjs/signals), [preact-render-to-string](https://github.com/preactjs/preact-render-to-string), [preact-iso](https://github.com/preactjs/preact-iso), [prefresh](https://github.com/preactjs/prefresh) y [@preact/preset-vite](https://github.com/preactjs/preset-vite), son compatibles con Preact 11 desde que empezamos a publicar versiones preliminares hace meses, por lo que es muy probable que tus dependencias ya sean compatibles con Preact 11.

Queremos dar las gracias a todas las personas que han contribuido a Preact y a su ecosistema a lo largo de los años. Sin su ayuda, no estaríamos donde estamos hoy. ¡Esperamos que disfrutes de Preact 11 y que te entusiasme tanto como a nosotros!

<span>- El equipo de Preact</span>
