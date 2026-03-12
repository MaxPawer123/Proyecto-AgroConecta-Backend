# 📡 Ejemplos de Peticiones HTTP - API AgroConecta

## Base URL
```
http://localhost:3000
```

---

## 🌱 LOTES

### 1. Obtener todos los lotes
```http
GET /api/lotes
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id_lote": 1,
      "id_productor": 1,
      "id_producto": 1,
      "nombre_producto": "Quinua Real",
      "categoria": "Grano",
      "nombre_lote": "Lote Quinua Norte 2025",
      "superficie": "2.50",
      "fecha_siembra": "2025-10-01",
      "fecha_cosecha_est": "2026-03-15",
      "rendimiento_estimado": "500.00",
      "precio_venta_est": "12.50",
      "estado": "ACTIVO",
      "created_at": "2026-01-21T..."
    }
  ],
  "count": 1
}
```

---

### 2. Obtener un lote por ID
```http
GET /api/lotes/1
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id_lote": 1,
    "nombre_lote": "Lote Quinua Norte 2025",
    "superficie": "2.50",
    ...
  }
}
```

---

### 3. Crear un nuevo lote
```http
POST /api/lotes
Content-Type: application/json

{
  "id_productor": 1,
  "id_producto": 1,
  "nombre_lote": "Lote Quinua Sur 2026",
  "superficie": 3.5,
  "fecha_siembra": "2026-01-15",
  "fecha_cosecha_est": "2026-06-20",
  "rendimiento_estimado": 700,
  "precio_venta_est": 13.00
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Lote creado exitosamente",
  "data": {
    "id_lote": 2,
    "id_productor": 1,
    "id_producto": 1,
    "nombre_lote": "Lote Quinua Sur 2026",
    "superficie": "3.50",
    "fecha_siembra": "2026-01-15",
    "fecha_cosecha_est": "2026-06-20",
    "rendimiento_estimado": "700.00",
    "precio_venta_est": "13.00",
    "estado": "ACTIVO",
    "created_at": "2026-01-21T..."
  }
}
```

---

### 4. Actualizar un lote
```http
PUT /api/lotes/1
Content-Type: application/json

{
  "nombre_lote": "Lote Quinua Norte 2025 - ACTUALIZADO",
  "superficie": 2.8,
  "fecha_siembra": "2025-10-01",
  "fecha_cosecha_est": "2026-03-15",
  "rendimiento_estimado": 550,
  "precio_venta_est": 13.50,
  "estado": "ACTIVO"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Lote actualizado exitosamente",
  "data": {
    "id_lote": 1,
    "nombre_lote": "Lote Quinua Norte 2025 - ACTUALIZADO",
    "superficie": "2.80",
    ...
  }
}
```

---

### 5. Eliminar un lote
```http
DELETE /api/lotes/1
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Lote eliminado exitosamente",
  "data": {
    "id_lote": 1,
    "nombre_lote": "Lote Quinua Norte 2025",
    ...
  }
}
```

---

### 6. Obtener lotes de un productor
```http
GET /api/lotes/productor/1
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id_lote": 1,
      "id_productor": 1,
      "nombre_lote": "Lote Quinua Norte 2025",
      ...
    },
    {
      "id_lote": 2,
      "id_productor": 1,
      "nombre_lote": "Lote Quinua Sur 2026",
      ...
    }
  ],
  "count": 2
}
```

---

## 🧪 Probar con cURL (PowerShell)

### Obtener todos los lotes
```powershell
curl http://localhost:3000/api/lotes
```

### Crear un lote
```powershell
curl -X POST http://localhost:3000/api/lotes `
  -H "Content-Type: application/json" `
  -d '{\"id_productor\":1,\"id_producto\":2,\"nombre_lote\":\"Lote Papa 2026\",\"superficie\":2.0,\"fecha_siembra\":\"2026-02-01\",\"fecha_cosecha_est\":\"2026-07-15\",\"rendimiento_estimado\":800,\"precio_venta_est\":8.50}'
```

### Actualizar un lote
```powershell
curl -X PUT http://localhost:3000/api/lotes/1 `
  -H "Content-Type: application/json" `
  -d '{\"nombre_lote\":\"Lote Actualizado\",\"superficie\":3.0,\"fecha_siembra\":\"2026-01-01\",\"fecha_cosecha_est\":\"2026-06-01\",\"rendimiento_estimado\":600,\"precio_venta_est\":14.00,\"estado\":\"ACTIVO\"}'
```

### Eliminar un lote
```powershell
curl -X DELETE http://localhost:3000/api/lotes/1
```

---

## 🔧 Probar con VS Code (Thunder Client o REST Client)

### Instalar Thunder Client
1. Abre VS Code
2. Ve a Extensions (Ctrl+Shift+X)
3. Busca "Thunder Client"
4. Instala la extensión

### Usar Thunder Client
1. Haz clic en el icono del rayo en la barra lateral
2. Crea una nueva petición
3. Selecciona el método (GET, POST, PUT, DELETE)
4. Ingresa la URL
5. Si es POST o PUT, ve a la pestaña "Body" y selecciona "JSON"
6. Pega el JSON de ejemplo
7. Haz clic en "Send"

---

## 📊 Casos de Uso Reales

### Escenario 1: Registrar una nueva siembra de quinua
```http
POST /api/lotes
Content-Type: application/json

{
  "id_productor": 1,
  "id_producto": 1,
  "nombre_lote": "Campaña Quinua Primavera 2026",
  "superficie": 5.0,
  "fecha_siembra": "2026-09-15",
  "fecha_cosecha_est": "2027-02-20",
  "rendimiento_estimado": 1000,
  "precio_venta_est": 15.00
}
```

### Escenario 2: Actualizar el precio de venta estimado
```http
PUT /api/lotes/2
Content-Type: application/json

{
  "nombre_lote": "Campaña Quinua Primavera 2026",
  "superficie": 5.0,
  "fecha_siembra": "2026-09-15",
  "fecha_cosecha_est": "2027-02-20",
  "rendimiento_estimado": 1000,
  "precio_venta_est": 16.50,
  "estado": "ACTIVO"
}
```

### Escenario 3: Marcar un lote como cosechado
```http
PUT /api/lotes/2
Content-Type: application/json

{
  "nombre_lote": "Campaña Quinua Primavera 2026",
  "superficie": 5.0,
  "fecha_siembra": "2026-09-15",
  "fecha_cosecha_est": "2027-02-20",
  "rendimiento_estimado": 1000,
  "precio_venta_est": 16.50,
  "estado": "COSECHADO"
}
```

---

## ❌ Respuestas de Error

### Lote no encontrado
```json
{
  "success": false,
  "message": "Lote no encontrado"
}
```

### Datos incompletos
```json
{
  "success": false,
  "message": "Todos los campos son obligatorios"
}
```

### Error del servidor
```json
{
  "success": false,
  "message": "Error al crear el lote",
  "error": "descripción del error técnico"
}
```
