# 🌾 API REST - AgroConecta

Backend del sistema de gestión agrícola AgroConecta desarrollado con Node.js, Express y PostgreSQL.

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

## 🚀 Instalación

### 1. Instalar Dependencias

```bash
cd Backend
npm install
```

### 2. Configurar Base de Datos

#### Opción A: Usando psql (Línea de Comandos)

```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE db_agroconecta;

# Salir de psql
\q

# Ejecutar el script de creación de tablas
psql -U postgres -d db_agroconecta -f database/setup.sql
```

#### Opción B: Usando pgAdmin

1. Abre pgAdmin
2. Crea una nueva base de datos llamada `db_agroconecta`
3. Haz clic derecho en la base de datos → Query Tool
4. Copia y pega el contenido del archivo `database/setup.sql`
5. Ejecuta el script (F5 o botón Execute)

### 3. Configurar Variables de Entorno

El archivo `.env` ya está configurado con los valores por defecto:

```env
PORT=3000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=db_agroconecta
DB_PASSWORD=admin
DB_PORT=5432
```

⚠️ **IMPORTANTE**: Cambia `DB_PASSWORD` por tu contraseña de PostgreSQL.

## 🏃 Ejecutar el Servidor

```bash
npm start
```

Deberías ver:
```
🚀 Servidor activo en el puerto 3000
📍 http://localhost:3000
Conectado exitosamente a la Base de Datos PostgreSQL
```

## 📡 Endpoints Disponibles

### Módulo de Lotes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/lotes` | Obtener todos los lotes |
| GET | `/api/lotes/:id` | Obtener un lote por ID |
| POST | `/api/lotes` | Crear un nuevo lote |
| PUT | `/api/lotes/:id` | Actualizar un lote |
| DELETE | `/api/lotes/:id` | Eliminar un lote |
| GET | `/api/lotes/productor/:idProductor` | Obtener lotes de un productor |

### Ejemplos de Uso

#### Obtener todos los lotes
```bash
curl http://localhost:3000/api/lotes
```

#### Crear un nuevo lote
```bash
curl -X POST http://localhost:3000/api/lotes \
  -H "Content-Type: application/json" \
  -d '{
    "id_productor": 1,
    "id_producto": 1,
    "nombre_lote": "Lote Quinua Sur 2026",
    "superficie": 3.5,
    "fecha_siembra": "2026-01-15",
    "fecha_cosecha_est": "2026-06-20",
    "rendimiento_estimado": 700,
    "precio_venta_est": 13.00
  }'
```

## 📁 Estructura del Proyecto

```
Backend/
├── src/
│   ├── config/
│   │   └── db.js              # Configuración de PostgreSQL
│   ├── models/
│   │   ├── loteModel.js       # ✅ Queries SQL de Lotes
│   │   ├── costoModel.js      # (Por implementar)
│   │   └── productoModel.js   # (Por implementar)
│   ├── controllers/
│   │   ├── loteController.js  # ✅ Lógica de negocio de Lotes
│   │   ├── costoController.js # (Por implementar)
│   │   └── productoController.js # (Por implementar)
│   ├── routes/
│   │   ├── loteRoutes.js      # ✅ Endpoints de Lotes
│   │   ├── costoRoutes.js     # (Por implementar)
│   │   └── productoRoutes.js  # (Por implementar)
│   └── app.js                 # ✅ Configuración de Express
├── database/
│   └── setup.sql              # ✅ Script de creación de BD
├── .env                       # Variables de entorno
├── server.js                  # ✅ Punto de entrada
└── package.json
```

## ✅ Estado de Implementación

- ✅ Configuración de base de datos
- ✅ Módulo de Lotes (Completo)
- ⏳ Módulo de Gastos (Pendiente)
- ⏳ Módulo de Productos (Pendiente)

## 🔧 Próximos Pasos

1. Implementar módulo de Gastos (costoModel, costoController, costoRoutes)
2. Implementar módulo de Productos (productoModel, productoController, productoRoutes)
3. Agregar autenticación con JWT
4. Implementar validaciones con express-validator

## 🐛 Solución de Problemas

### Error de conexión a la base de datos

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solución**: Verifica que PostgreSQL esté corriendo:
```bash
# Windows
pg_ctl status

# Ver servicios en Windows
services.msc
```

### Error de autenticación

```
Error: password authentication failed for user "postgres"
```

**Solución**: Verifica la contraseña en el archivo `.env`

## 📄 Licencia

Este proyecto es parte del curso de Desarrollo de Sistemas Agropecuarios.
