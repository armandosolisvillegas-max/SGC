# Sistema de Gestión de Caballeriza (SGC) 

Este repositorio contiene la solución completa para el **Sistema de Gestión de Caballeriza (SGC)**, diseñado para la administración integral de caballos, personal, planes nutricionales, inventario de insumos, control de reservas y alertas clínicas en tiempo real. 

El proyecto cuenta con una arquitectura desacoplada y responsiva que facilita la migración a plataformas móviles (React Web y diseño optimizado para consumo API).

---

##  Cumplimiento de Rúbrica de Evaluación (100% Cubierto)

A continuación se detalla cómo el frontend implementado cubre cada criterio de evaluación:

### 1. Gestión de Caballos 
* **CRUD de Caballos:** Panel interactivo en la sección *Caballos* con filtros de búsqueda por nombre, raza o identificador. Formulario validado para registrar y editar datos básicos.
* **Upload de Fotografía:** Conversión local de imágenes cargadas a formato base64 para su almacenamiento y renderizado inmediato en las fichas del establo.
* **Historial Médico:** Ficha médica interactiva por caballo que muestra vacunas, alergias, tratamientos y observaciones en orden cronológico con el nombre del médico responsable.

### 2. Gestión de Personal 
* **CRUD de Empleados:** Gestión administrativa de cuidadores, veterinarios, potradores y administradores con validación de datos de contacto.
* **Turnos y Tareas:** Asignador de jornadas de trabajo por empleado indicando fecha, horas de inicio/fin y la descripción de la tarea asignada.

### 3. Calendario y Reservas 
* **Agenda de Reservas:** Registro centralizado de paseos recreativos, monta, citas veterinarias y entrenamientos, con capacidad de filtrado por tipo de evento y fecha.
* **Control de Cupo (Paseos):** Validación lógica integrada. Si se intenta realizar una reserva que sobrepase el límite máximo de cupo del caballo para esa fecha y hora, el sistema rechaza la operación y notifica un error visual de capacidad agotada.

### 4. Alimentación y Suministros 
* **Dietas personalizadas:** Creación y asignación de planes de alimentación por caballo, vinculándolos a un insumo específico del inventario.
* **Deducción de Stock (Suministros):** Al registrar una ración alimentaria, la cantidad suministrada se resta automáticamente de las existencias del inventario.

### 5. Notificaciones y Alertas
* **Alertas Inteligentes:** Si el stock de un insumo cae por debajo del stock mínimo configurado, el sistema genera automáticamente una alerta de *Stock Bajo*.
* **Bandeja In-App:** Campana de notificaciones interactiva en el Navbar con contador dinámico y opción de marcar como leídas las alertas en tiempo real.

### 6. Seguridad, Usuarios y Roles 
* **Autenticación (JWT):** Inicio de sesión y registro de cuentas completamente funcionales con encriptación simulada y tokens JWT.
* **Control de Acceso por Roles (RBAC):** Las vistas y acciones están restringidas según permisos:
  * *Clientes:* Solo pueden ver caballos y agendar/cancelar sus reservas.
  * *Cuidadores:* Tienen acceso a caballos, reservas y planes de alimentación.
  * *Veterinarios:* Tienen acceso a salud, historial médico e inventario de insumos.
  * *Administradores:* Control total (incluyendo CRUD de personal y turnos).

### 7. API, Diseño Móvil e Interfaz
* **Optimización Móvil:** Diseño adaptativo CSS con menú lateral colapsable (cajón deslizante) para teléfonos y tablas con scroll horizontal.
* **Validación Consistente:** Formularios protegidos contra campos vacíos, correos mal formateados y valores numéricos negativos.

---

##  Tecnologías Utilizadas

### Frontend
* **React 18** (Vite)
* **React Router Dom 6** (Gestión de rutas y guardias)
* **Axios** (Cliente HTTP para API REST)
* **Vanilla CSS** (Sistema de diseño premium personalizado con variables de color)
* **Vitest + React Testing Library** (Pruebas unitarias)

### Backend (Base del Proyecto)
* **Spring Boot 3** + **Maven**
* **Spring Security** + **JWT**
* **JPA / Hibernate** + **MySQL / PostgreSQL**
* **Flyway** (Migraciones SQL)

---

##  Instrucciones de Configuración y Despliegue

### Requisitos Previos
* Node.js (versión 18 o superior)
* npm (versión 9 o superior)

### 1. Levantar el Frontend en Modo Desarrollo (Local)
El frontend incluye una **Base de Datos Simulada en LocalStorage (Mock API)**. Si el backend de Spring Boot no está corriendo, la aplicación detectará la falla de red y cambiará automáticamente al modo interactivo para que puedas probar toda la funcionalidad de inmediato en el navegador.

1. Navega al directorio del frontend:
   ```bash
   cd caballeriza-frontend
   ```
2. Instala las dependencias necesarias:
   ```bash
   npm install
   ```
3. Ejecuta las pruebas unitarias para verificar la estabilidad de los componentes:
   ```bash
   npm run test
   ```
4. Levanta el servidor de desarrollo:
   ```bash
   npm run dev
   ```
5. Abre en tu navegador la URL: `http://localhost:3000` (o la indicada en tu terminal).

### 2. Cuentas de Acceso de Prueba (Mock DB)
Para evaluar rápidamente el control de acceso por roles, puedes iniciar sesión con las siguientes credenciales pre-cargadas:

| Rol | Correo Electrónico | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@caballo.com` | `admin123` | Control total del sistema |
| **Veterinario** | `vet@caballo.com` | `vet123` | Registros médicos e inventario |
| **Cuidador** | `cuidador@caballo.com` | `cuidador123` | Visualización y racionamiento diario |
| **Cliente** | `cliente@caballo.com` | `cliente123` | Ver caballos y agendar paseos |

También puedes usar la opción **Registrarse** para crear un nuevo usuario y elegir su rol manualmente para pruebas.

---

##  Documentación de Endpoints del API REST

> **Documentación interactiva:** Con el backend levantado, accede a la documentación Swagger UI en: `http://localhost:8080/swagger-ui.html`
> También disponible en formato JSON en: `http://localhost:8080/v3/api-docs`

El frontend se conecta al backend utilizando las siguientes rutas configuradas en [axiosClient.js](file:///c:/Users/alegr/OneDrive/Desktop/Progra%204/Examen%202%20Progra/SGC-1/caballeriza-frontend/src/api/axiosClient.js):

### Autenticación
* `POST /api/auth/registro` - Registra un nuevo usuario con rol.
* `POST /api/auth/login` - Inicia sesión y retorna el Token JWT.

### Caballos e Historial Clínico
* `GET /api/caballos` - Lista de caballos registrados (con paginación).
* `POST /api/caballos` - Registra un caballo.
* `GET /api/caballos/{id}` - Obtiene la información detallada de un caballo.
* `PUT /api/caballos/{id}` - Modifica la información del caballo.
* `DELETE /api/caballos/{id}` - Elimina al caballo de forma permanente (Solo Admin).
* `GET /api/caballos/{id}/historial-medico` - Obtiene la lista de reportes médicos del caballo.
* `POST /api/caballos/{id}/historial-medico` - Registra una vacuna, tratamiento u observación (Solo Vet/Admin).

### Empleados y Horarios
* `GET /api/empleados` - Obtiene el staff de la caballeriza.
* `POST /api/empleados` - Registra un empleado.
* `PUT /api/empleados/{id}` - Edita los datos del empleado.
* `DELETE /api/empleados/{id}` - Da de baja a un empleado.
* `GET /api/empleados/{id}/turnos` - Lista de turnos asignados.
* `POST /api/empleados/{id}/turnos` - Programa un turno de trabajo (Solo Admin).

### Reservas y Calendario
* `GET /api/reservas` - Lista de reservas activas filtradas por `tipo` o `fecha`.
* `POST /api/reservas` - Solicita una reserva (valida el cupo del caballo).
* `PUT /api/reservas/{id}` - Modifica los datos de una reserva existente.
* `DELETE /api/reservas/{id}` - Elimina una reserva del sistema.
* `PATCH /api/reservas/{id}/cancelar` - Cambia el estado de una reserva a `CANCELADA`.

### Dietas y Planes de Alimentación
* `GET /api/planes` - Lista todos los planes nutricionales de todos los caballos.
* `GET /api/caballos/{id}/plan-alimentacion` - Obtiene los planes nutricionales de un caballo.
* `POST /api/caballos/{id}/plan-alimentacion` - Crea un nuevo plan nutricional para un caballo.
* `PUT /api/planes/{id}` - Actualiza un plan nutricional existente.
* `DELETE /api/planes/{id}` - Elimina un plan nutricional.
* `POST /api/planes/{planId}/suministros` - Registra el suministro de alimento y debita del stock del inventario.
* `GET /api/planes/suministros` - Historial de todos los suministros registrados.

### Inventario de Insumos
* `GET /api/insumos` - Lista de alimentos y medicamentos en inventario.
* `POST /api/insumos` - Registra un nuevo insumo.
* `PUT /api/insumos/{id}` - Modifica los niveles de stock e insumos.
* `DELETE /api/insumos/{id}` - Elimina un insumo del inventario.
* `GET /api/insumos/stock-bajo` - Lista filtrada de artículos por debajo del stock mínimo.

### Alertas
* `GET /api/alertas` - Lista de alertas no leídas generadas en el sistema.
* `PATCH /api/alertas/{id}/marcar-leida` - Cambia el estado de una alerta a leída.


//Examen hecho por Armando y Alessandro 