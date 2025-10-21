# Prueba Técnica Frontend — XDevelop

Este proyecto es la implementación completa de la Prueba Técnica de XDevelop, demostrando la integración de tecnologías modernas de frontend (Next.js, TypeScript, TanStack Query/Table, Zustand) para construir una aplicación segura, escalable y con una excelente experiencia de usuario.

## 🔗 Entregables

| Tipo | Enlace | 
 | ----- | ----- | 
| **Sitio Desplegado** | `https://x-develop-technical-test.vercel.app/users` | 
| **Repositorio Público** | `https://github.com/migueAngelDev/XDevelop-Technical-Test/tree/main/technical-test-xdevelop` | 

## ✅ Requerimientos Cumplidos (Mapa Rápido)

| Característica | Estado | Notas | 
 | ----- | ----- | ----- | 
| **Autenticación (Cookies & Middleware)** | ✅ Completo | Flujo de `accessToken` (cookie JS) y `refreshToken` (`HttpOnly` en servidor). Rutas protegidas por Next.js Middleware. | 
| **Data Fetching** | ✅ Completo | TanStack Query v5 para `useQuery` y `useMutation`. Uso de `placeholderData: keepPreviousData` para paginación suave. | 
| **Estado Global** | ✅ Completo | Zustand (`useSession`) para gestionar el estado global (`email`, `role`, `isAuth`). | 
| **Tabla de Usuarios** | ✅ Completo | TanStack Table con paginación **real** (ReqRes) y filtros locales (`role`, búsqueda `q`). | 
| **Permisos/Roles** | ✅ Completo | Simulación de rol (`admin`/`user`) basado en el email de login. Lógica de UI condicional (p. ej., crear/editar posts solo para `admin`). | 
| **APIs** | ✅ Completo | **ReqRes** (Auth/Usuarios), **JSONPlaceholder** (Posts/Comentarios/CRUD). | 
| **Arquitectura** | ✅ Completo | Arquitectura modular por "Vertical Slices" (domain/app/infra/ui). | 
| **Buscador de Libros (Open Library)** | ⏳ En Progreso | Módulo listo para extensión, pero no completamente funcional sin requerimiento explícito. | 

## 🛠️ Instrucciones para Correr el Proyecto

### Requisitos

* Node.js 18+ (o 20+ recomendado).

* npm (utilizado para el desarrollo del proyecto).

### Instalación

* npm install


### Variables de Entorno

Crea un archivo **`.env.local`** en la raíz del proyecto para definir las siguientes variables:

| Variable | Ejemplo/Descripción | 
 | ----- | ----- | 
| `REQRES_BASE_URL` | `https://reqres.in/api` | 
| `REQRES_API_KEY` | (Dejar vacío o completar si tu entorno lo requiere puedes usar `reqres-free-v1`) | 
| `ALLOW_FAKE_REGISTER` | `true` (Habilita el modo demo para registro si ReqRes rechaza el correo). | 

### Ejecución

| Comando | Acción | 
 | ----- | ----- | 
| `npm run dev` | Ejecuta en modo desarrollo. Abrir: `http://localhost:3000` | 
| `npm run build` / `npm start` | Compila y ejecuta en modo producción local. | 
| `npm run lint` | Ejecuta el linter (opcional). | 

### Credenciales Demo

Para iniciar sesión y probar el flujo:

* **Correo**: `eve.holt@reqres.in`

* **Contraseña**: `cityslicka`

## 💻 Justificación Técnica de la Implementación

### 1. Autenticación y Seguridad

* **Flujo de Tokens**: Se implementó un flujo estándar de *Access Token* (guardado en una cookie accesible por JS para ser enviado en peticiones del cliente) y *Refresh Token* (guardado en una cookie `HttpOnly`, `SameSite=Lax`, `Secure` en producción, para protegerlo de XSS).

* **Next.js Middleware**: `middleware.ts` intercepta todas las peticiones a rutas protegidas (`/users`, `/posts`) y verifica la presencia del `accessToken`. Si no está presente, redirige a `/login` adjuntando el parámetro `?next=` para la redirección posterior.

* **Manejo de 401 (Renovación)**: La función `apiFetch` (base para todas las llamadas) intercepta el error HTTP `401` y automáticamente intenta llamar a `/api/refresh` para obtener un nuevo *token* antes de reintentar la solicitud original.

### 2. Gestión de Estado y Datos

* **Zustand**: Se utiliza `useSession` (un *store* de Zustand) para almacenar la identidad del usuario (`email`, `role`) de forma global, permitiendo que componentes dispares (como la cabecera o el *layout*) reaccionen a los cambios de sesión.

* **TanStack Query v5**: Utilizado para todo el *data fetching* y *mutations*. Esto proporciona:

  * **Caching automático** de datos (ej., la página 1 de usuarios se sirve instantáneamente).

  * **Paginación Suave**: Se utiliza la opción `placeholderData: keepPreviousData` para que, al cambiar de página, la tabla muestre los datos antiguos mientras se cargan los nuevos, eliminando la sensación de "vacío" de la UI.

  * **Actualizaciones Optimistas**: Implementadas en las mutaciones de Posts (crear/editar) para ofrecer *feedback* inmediato al usuario.

### 3. Implementación de Tablas (TanStack Table)

* **Tabla de Usuarios (`/users`)**: La tabla está impulsada por TanStack Table. La paginación es **real** (controlando el estado `page` y disparando un nuevo `useQuery` para el servidor).

* **Filtros**: El filtrado por búsqueda (`q`) y rol es **local** sobre los datos ya obtenidos, permitiendo una experiencia de búsqueda instantánea.

* **Rendimiento**: Se utilizan *memos* y el *row model* de TanStack Table para optimizar la renderización y evitar costos de recálculo innecesarios.

### 4. Arquitectura

* **Vertical Slicing**: El proyecto está organizado por características (módulos), con una separación clara de responsabilidades:

  * `domain/`: Tipos de datos (TypeScript interfaces).

  * `infra/`: Repositorios HTTP y lógica de API (donde residen `fetchUsers`, `listPosts`).

  * `app/`: Hooks de aplicación (`useListUsers`, `useSession`).

  * `ui/`: Componentes y páginas React.

## 🗺️ Rutas Principales

| Ruta | Protección | Función | 
 | ----- | ----- | ----- | 
| `/` | Pública | Página de inicio con CTA condicional (Login o Panel). | 
| `/login` | Pública | Formulario de inicio de sesión. Maneja la redirección `?next=`. | 
| `/register` | Pública | Formulario de registro (con modo demo `ALLOW_FAKE_REGISTER`). | 
| `/users` | Protegida | Tabla de usuarios (paginación, búsqueda, filtro, acciones masivas). | 
| `/posts` | Protegida | Listado de posts, con filtro por usuario. Muestra acciones de CRUD condicionales al rol. | 
| `/posts/[id]` | Protegida | Detalle del post y sus comentarios. Edición en modal (solo `admin`). | 

## 🚀 Despliegue

Este proyecto está diseñado para desplegarse en **Vercel**.

1. Conectar el repositorio.

2. Asegurar que las variables de entorno (`REQRES_BASE_URL`, `REQRES_API_KEY`, etc.) estén configuradas en la configuración de Vercel.

3. El *deploy* se realiza automáticamente.

## 📈 Mejoras Futuras

* Completar y poner en uso el módulo de Libros (Open Library).

* Implementar Pruebas Unitarias para hooks críticos (`useListUsers`, lógica de `apiFetch`).

* Virtualización de filas (e.g., con `react-virtual`) si el límite de `total-count` excede los 100 elementos.

* Finalizar la lógica de "Acciones Masivas" (*bulk*) en la tabla de Usuarios.
