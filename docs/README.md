# Simple-Asist - Sistema de Registro de Asistencia

## Descripción del Proyecto

Simple-Asist es una aplicación web diseñada para gestionar el registro de asistencia mediante códigos QR. El sistema permite a los administradores supervisar la asistencia de estudiantes, mientras que los estudiantes pueden registrar su presencia escaneando códigos QR desde sus dispositivos móviles.

## Tecnologías Utilizadas

### Frontend

- **Next.js 15.5.3** - Framework de React con Server-Side Rendering
- **React 19.1.0** - Librería de interfaces de usuario
- **Material-UI 7.3.2** - Sistema de componentes y diseño
- **Tailwind CSS 4** - Framework de utilidades CSS

### Backend y Base de Datos

- **Firebase 12.2.1** - Backend as a Service
  - Firebase Authentication - Autenticación de usuarios
  - Cloud Firestore - Base de datos NoSQL

### Librerías Especializadas

- **jsQR 1.4.0** - Decodificación de códigos QR desde la cámara
- **qrcode.react 4.1.0** - Generación de códigos QR
- **react-toastify 11.0.5** - Notificaciones toast

### Herramientas de Desarrollo

- **ESLint 9.35.0** - Linter de código JavaScript
- **Turbopack** - Bundler de alta velocidad
- **PostCSS 4** - Procesador de CSS

## Arquitectura del Proyecto

```
src/
├── app/                          # Rutas de Next.js (App Router)
│   ├── (auth)/                   # Grupo de rutas de autenticación
│   │   └── registro/             # Página de registro
│   ├── admin/                    # Panel de administración
│   ├── asistencia/               # Módulo de asistencia
│   │   ├── scan/                 # Escaneo de códigos QR
│   │   └── ...                   # Otras páginas de asistencia
│   ├── asistencia-historial/     # Historial de asistencias
│   ├── dashboard/                # Dashboard general
│   ├── inicio-sesion/            # Página de login
│   ├── qr-display/               # Generador de códigos QR
│   ├── globals.css               # Estilos globales
│   ├── layout.js                 # Layout principal
│   └── page.js                   # Página de inicio
│
├── features/                     # Componentes por funcionalidad
│   ├── admin/                    # Componentes de administración
│   ├── attendance/               # Componentes de asistencia
│   │   ├── QRScanner.jsx         # Componente de escaneo QR
│   │   └── Table.jsx             # Tabla de asistencias
│   ├── auth/                     # Componentes de autenticación
│   │   ├── context.jsx           # Contexto de autenticación
│   │   ├── Login.jsx             # Componente de login
│   │   ├── Register.jsx          # Componente de registro
│   │   └── services.js           # Servicios de autenticación
│   └── students/                 # Componentes de gestión de estudiantes
│
└── firebase/                     # Configuración y servicios de Firebase
    ├── config.js                 # Configuración de Firebase
    ├── auth.js                   # Servicio de autenticación
    ├── attendance.js             # Servicio de asistencias
    ├── students.js               # Servicio de estudiantes
    ├── faculties.js              # Servicio de facultades
    └── schools.js                # Servicio de escuelas
```

## Flujo del Sistema

### 1. Autenticación de Usuarios

El sistema maneja dos tipos de usuarios con flujos diferenciados:

#### Administradores

1. Acceden a `/inicio-sesion`
2. Ingresan credenciales de administrador
3. Son redirigidos a `/admin`
4. Pueden gestionar estudiantes y revisar asistencias

#### Estudiantes

1. Acceden a `/inicio-sesion`
2. Ingresan credenciales de estudiante
3. Son redirigidos automáticamente a `/asistencia/scan`
4. Acceden directamente al módulo de registro de asistencia

**Detección de tipo de usuario:**

- Administrador: email específico (admin@correo.com)
- Estudiante: emails que contengan "estudiante", "student" o con formato `STU[número]@dominio.com`

### 2. Registro de Asistencia

El flujo de registro de asistencia sigue estos pasos:

#### 2.1. Generación del Código QR (Pantalla Pública)

1. Un administrador o sistema accede a `/qr-display`
2. Genera un código QR que representa el identificador del estudiante
3. El código QR se muestra en una pantalla visible (proyector, monitor, etc.)
4. Opciones disponibles:
   - Ingresar código manual del estudiante
   - Generar código aleatorio para pruebas
   - El QR se renderiza con nivel de corrección de errores alto

#### 2.2. Escaneo del Código QR (Dispositivo del Estudiante)

1. El estudiante inicia sesión en el sistema
2. Es redirigido automáticamente a `/asistencia/scan`
3. El navegador solicita permisos de cámara
4. El estudiante puede:
   - Seleccionar la cámara a usar (frontal/trasera/externa)
   - Ver una previsualización con marco de escaneo
   - El sistema detecta automáticamente códigos QR en el campo de visión

**Características técnicas del escáner:**

- Utiliza `getUserMedia` API para acceso a la cámara
- Decodificación en tiempo real con jsQR
- Marco visual para guiar al usuario
- Detección de múltiples cámaras disponibles
- Selector dinámico de dispositivos de video

#### 2.3. Confirmación de Asistencia

1. Al detectar un código QR, el sistema:

   - Detiene el escaneo automáticamente
   - Muestra el código detectado en el panel de control
   - Habilita el botón "Confirmar Asistencia"

2. El estudiante revisa el código y confirma

3. El sistema:

   - Envía los datos a Firebase (colección `attendances`)
   - Almacena información del registro:
     - Código/ID del estudiante
     - Fecha y hora (zona horaria America/Lima)
     - Estado: Presente
   - Muestra mensaje de confirmación visual

4. Opciones post-registro:
   - Ver mensaje de éxito
   - Opción para volver a escanear (nuevo registro)

### 3. Gestión Administrativa

#### Panel de Administración (`/admin`)

1. Gestión de estudiantes:

   - Agregar nuevos estudiantes
   - Editar información existente
   - Eliminar registros
   - Visualización en tabla

2. Revisión de asistencias:
   - Consulta de registros por fecha
   - Filtrado por estudiante
   - Estadísticas de asistencia
   - Exportación de datos

#### Historial de Asistencias (`/asistencia-historial`)

1. Visualización cronológica de registros
2. Búsqueda y filtrado
3. Análisis de patrones de asistencia

## Estructura de Datos en Firebase

### Colección: `students`

```javascript
{
  id: "auto-generated",
  full_name: "string",
  code: "string",
  email: "string",
  faculty: "string",
  school: "string"
}
```

### Colección: `attendances`

```javascript
{
  date: "YYYY-MM-DD",           // ID del documento
  dayOfWeek: "string",
  records: {
    [studentId]: {
      studentId: "string",
      status: "presente|ausente|tardanza",
      full_name: "string",
      code: "string"
    }
  },
  totalPresent: number,
  totalAbsent: number,
  totalLate: number,
  createdAt: "ISO-8601 timestamp"
}
```

## Configuración y Despliegue

### Requisitos Previos

- Node.js 18.x o superior
- npm o yarn
- Cuenta de Firebase con proyecto configurado

### Instalación

```bash
# Clonar el repositorio
git clone [repository-url]

# Instalar dependencias
npm install

# Configurar variables de entorno
# Crear archivo .env.local con credenciales de Firebase
```

### Variables de Entorno

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Comandos Disponibles

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start

# Linting
npm run lint
```

## Flujo de Datos

### Registro de Asistencia

```
Usuario (Estudiante)
    ↓
Login → Autenticación Firebase
    ↓
Redirección → /asistencia/scan
    ↓
Solicitar Permiso de Cámara
    ↓
Escanear QR desde /qr-display
    ↓
Decodificar con jsQR
    ↓
Confirmar Código
    ↓
Enviar a Firebase Firestore
    ↓
Actualizar colección 'attendances'
    ↓
Mostrar Confirmación Visual
```

### Consulta de Asistencias

```
Usuario (Admin)
    ↓
Login → Autenticación Firebase
    ↓
Redirección → /admin
    ↓
Solicitar datos → Firestore
    ↓
Procesar y formatear datos
    ↓
Renderizar en tabla/gráficos
    ↓
Permitir filtrado y exportación
```

## Seguridad

### Autenticación

- Firebase Authentication maneja tokens y sesiones
- Validación de credenciales en servidor
- Redirecciones basadas en roles

### Base de Datos

- Reglas de Firestore para control de acceso
- Validación de datos en servidor
- Índices para optimización de consultas

### Frontend

- Validación de formularios
- Sanitización de inputs
- Manejo de errores y estados

## Consideraciones de Rendimiento

### Optimizaciones Implementadas

1. **Turbopack**: Bundling rápido en desarrollo
2. **Code Splitting**: Next.js maneja automáticamente
3. **Lazy Loading**: Componentes cargados bajo demanda
4. **Memoización**: React hooks para prevenir re-renders innecesarios

### Acceso a Cámara

- Stream de video detenido al no usar
- Liberación de recursos al desmontar componentes
- Manejo de errores de permisos

## Limitaciones Conocidas

1. **Credenciales hardcoded**: Actualmente usa credenciales de prueba en el código
2. **Sin persistencia de sesión**: No implementa localStorage/sessionStorage
3. **Sin protección de rutas**: Middleware de autenticación pendiente
4. **Zona horaria fija**: Configurada para America/Lima

## Roadmap Futuro

- Implementación de roles y permisos dinámicos
- Integración con sistemas de gestión académica
- Reportes y analytics avanzados
- Notificaciones en tiempo real
- Modo offline con sincronización
- Aplicación móvil nativa
- Soporte multi-idioma
- Exportación a múltiples formatos (PDF, Excel, CSV)

## Soporte y Contribuciones

Para reportar problemas o solicitar características, contactar al equipo de desarrollo.

---

**Versión:** 0.1.0  
**Última actualización:** Octubre 2025
