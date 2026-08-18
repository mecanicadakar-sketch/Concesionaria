# MiCarro - Plataforma para Concesionarias & Portal de Autos

Plataforma integral estilo SaaS para agencias de autos, concesionarias y particulares:
- **Catálogo Público de Vehículos:** Búsqueda avanzada por marca, modelo, precio, año, combustible y tipo con galería multi-foto y contacto directo por WhatsApp al vendedor.
- **Portal de Tasación y Cotización:** Los usuarios particulares pueden ofrecer sus vehículos o cotizar en línea.
- **Panel de Concesionaria (Agency Panel):** Gestión completa de inventario de vehículos, leads, cotizaciones recibidas, suscripción a planes y datos bancarios/pagos.
- **Panel Master SaaS (Admin):** Control global de agencias, gestión de planes de membresía, códigos de suscripción y pasarelas de pago oficiales.

---

## 🚀 Requisitos Previos
- **Node.js** v18 o superior
- **npm** o **yarn** / **pnpm**

---

## 🛠️ Instalación y Puesta en Marcha Local

1. **Instalar dependencias:**
```bash
npm install
```

2. **Iniciar en modo desarrollo:**
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`.

---

## 📦 Construcción para Producción (Build)

Para compilar el frontend y el servidor:
```bash
npm run build
```

Para iniciar el servidor compilado en producción:
```bash
npm run start
```

---

## 🌐 Variables de Entorno (Opcional)

Si utilizas funciones de IA con Gemini, crea un archivo `.env` en la raíz:
```env
GEMINI_API_KEY=tu_clave_de_gemini_aqui
```

---

## 🚀 Despliegue en la Nube

El proyecto está listo para desplegarse en:
- **Cloud Run / Docker**
- **Render / Railway / Fly.io**
- **VPS (Ubuntu con Nginx + Node.js/PM2)**
- **Vercel / Netlify** (modo SPA frontend con `npm run build` apuntando a la carpeta `dist/`)
