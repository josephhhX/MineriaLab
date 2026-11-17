# MineríaLab

Aplicación estática para practicar minería de datos. El progreso y la configuración se guardan en el navegador mediante localStorage.

## Ejecutar

```bash
npm install
npm run dev
```

Para validar: `npm test`, `npm run lint` y `npm run build`. Para previsualizar la compilación: `npm run preview`.

## Publicar en Vercel

Importa el repositorio en Vercel, selecciona Vite como framework y usa `npm run build` como comando de compilación y `dist` como directorio de salida. No se necesita servidor ni variables de entorno.

## Alcance actual

La práctica incluye ejercicios generados de siete temas, validación por pasos, pistas, procedimientos, calculadora y estadísticas. El examen conserva respuestas durante la sesión y presenta soluciones al finalizar. Los parámetros de generación son comunes a los temas seleccionados en un examen. Los árboles se limitan a elegir la raíz; no construyen el árbol completo. Las tablas auxiliares de Pearson se muestran calculadas, sin edición de celdas. No se incluyen ejercicios de significancia estadística, interpretación mediante selección, ni todos los tipos y controles de personalización solicitados. La calculadora necesita conexión solo para cargar las fuentes web; la aplicación funciona sin ellas.
