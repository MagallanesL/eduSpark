# Edu-Spark

Versión gamificada de Edu-Spark lista para desplegar como sitio estático.

## Ejecutar localmente

Desde esta carpeta:

```powershell
python -m http.server 4181
```

Abrir:

```text
http://127.0.0.1:4181/index.html
```

## Deploy en Vercel

El proyecto está en la raíz del repo, por lo que en Vercel se puede usar la configuración por defecto para sitio estático:

- Framework Preset: `Other`
- Build Command: vacío
- Output Directory: `.`

No hace falta configurar `Root Directory`.
