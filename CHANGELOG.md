# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/).

---

## [1.5.0] - 2026-01-20

### Agregado
- **Sistema de Valoraciones y Comentarios**
  - Nueva colección `reviews` en Firestore para almacenar valoraciones
  - Componente `StarRating` interactivo para seleccionar calificación (1-5 estrellas)
  - Componente `StarDisplay` para mostrar calificaciones en modo lectura
  - Formulario `ReviewForm` para crear y editar valoraciones
  - Lista `ReviewList` con paginación (5 reviews por página)
  - Componente `ReviewItem` con avatar, fecha y acciones de editar/eliminar
  - Resumen `ReviewSummary` con promedio y total de valoraciones
  - `ReviewsContext` para gestión de estado y operaciones CRUD
  - `StarIcon` agregado a la biblioteca de iconos (filled, outline, half)
  - Sección de valoraciones en `RecipePage` debajo de los pasos
  - Rating promedio visible en `RecipeCard`
  - Reglas de seguridad en Firestore para la colección `reviews`

### Modificado
- `RecipesContext` ahora carga recetas públicas Y recetas privadas del usuario autenticado
- `RecipePage` muestra el rating promedio junto al contador de favoritos
- `RecipeCard` muestra la calificación promedio de cada receta
- `App.js` incluye `ReviewsProvider` en el árbol de componentes

---

## [1.4.0] - 2026-01-14

### Agregado
- **Nuevo Diseño Visual**
  - Rediseño completo de la interfaz con nueva paleta de colores
  - Colores: forest (verde), tangerine (naranja), honey (dorado), mint (menta), cocoa (marrón), cream (crema)
  - Nuevas fuentes: Outfit (display), DM Sans (body), Caveat (handwritten)
  - Animaciones CSS: fade-in, fade-in-up, scale-in, heart-beat, float, shimmer
  - Sombras suaves y efectos de glassmorphism
  - Componentes UI reutilizables: Button, Input, LoadingSpinner, EmptyState

### Agregado
- **Zoom de Imágenes**
  - Modal de zoom para imagen principal de receta
  - Zoom en imágenes de pasos de preparación
  - Indicadores visuales de hover para imágenes clickeables

### Modificado
- Componentes actualizados con nuevo sistema de diseño
- `RecipePage` con hero section mejorada
- `RecipeCard` con animaciones y efectos hover
- Reglas de Firebase actualizadas

---

## [1.3.0] - 2025-12-02

### Modificado
- Actualización del README.md con nueva documentación
- Mejoras en la estructura del proyecto

---

## [1.2.0] - 2025-04-23

### Agregado
- **Autenticación con Google**
  - Botón "Iniciar sesión con Google" en página de login
  - Integración con Firebase Authentication
  - Soporte para registro con Google en `SignupPage`

### Mejorado
- Formulario de recetas por pasos (Step 3 - ingredientes)
- Correcciones generales de bugs

---

## [1.1.0] - 2025-04-20 - 2025-04-22

### Agregado
- **Sistema de Pasos para Recetas**
  - Formulario de creación de recetas en múltiples pasos
  - Paso 1: Información básica (nombre, categoría, imagen)
  - Paso 2: Ingredientes
  - Paso 3: Instrucciones de preparación
  - Colección `steps` en Firestore

### Agregado
- **Sistema de Favoritos**
  - Botón de corazón para marcar/desmarcar favoritos
  - Página "Mis Favoritos" para ver recetas guardadas
  - Contador de favoritos en cada receta
  - Colección `favorites` en Firestore

### Agregado
- **Perfil de Usuario**
  - Página de perfil con información del usuario
  - Foto de perfil configurable
  - Visualización de recetas creadas

### Agregado
- **Navegación Móvil**
  - Barra de navegación inferior para dispositivos móviles
  - Iconos personalizados (Home, Heart, Book, User, ChefHat)
  - Navegación responsiva

### Agregado
- **Gestión de Categorías**
  - Tarjetas de categoría con diseño visual
  - Página de administración de categorías (solo admin)
  - CRUD completo para categorías

### Mejorado
- Estilos de `RecipeCard` con efectos hover
- Página "Mis Recetas" con mejor diseño
- LocalStorage para persistencia de datos temporales

---

## [1.0.0] - 2025-04-19 - 2025-04-20

### Agregado
- **Sistema de Autenticación**
  - Página de Login con email/contraseña
  - Página de Registro de nuevos usuarios
  - `AuthContext` para gestión de sesión
  - Rutas protegidas con `RequireAuth`

### Agregado
- **Control de Usuarios (Admin)**
  - Panel de administración de usuarios
  - Roles de usuario: admin, user
  - Página `/admin/usuarios` para gestión

### Agregado
- **CRUD de Recetas**
  - Crear nuevas recetas con formulario
  - Editar recetas existentes
  - Eliminar recetas con confirmación
  - Visualización detallada de recetas

### Agregado
- **Estructura Base**
  - Configuración de Firebase (Firestore, Auth, Hosting)
  - React Router para navegación
  - Contextos: RecipesContext, CategoriesContext, IngredientsContext
  - Diseño general y colores base

### Agregado
- **Páginas Principales**
  - `HomePage` con listado de recetas
  - `RecipePage` para ver detalle de receta
  - `CategoryPage` para filtrar por categoría
  - `AddRecipePage` para crear recetas
  - `EditRecipePage` para modificar recetas
  - `MisRecetasPage` para ver recetas propias

---

## [0.1.0] - 2025-04-18

### Agregado
- Commit inicial del proyecto
- Estructura básica de React
- Configuración inicial de Firebase
- Primera versión del diseño

---

## Tecnologías Utilizadas

- **Frontend**: React 18, React Router v6
- **Estilos**: Tailwind CSS con configuración personalizada
- **Backend**: Firebase (Firestore, Authentication, Hosting)
- **Estado**: React Context API
- **Build**: Create React App

---

## Autores

- JoseCristhianRG
- PokeWorldJG

---

## Enlaces

- [Repositorio GitHub](https://github.com/JoseCristhianRG/RecetApp)
- [Firebase Console](https://console.firebase.google.com/project/recetapp-759bd)
