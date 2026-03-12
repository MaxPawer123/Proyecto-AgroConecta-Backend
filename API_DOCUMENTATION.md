# 📚 Documentación Completa de API - AgroConecta

Base URL: `http://localhost:3000`

---

## 🌱 MÓDULO: LOTES

### 1. Obtener todos los lotes
```http
GET /api/lotes
```

### 2. Obtener un lote por ID
```http
GET /api/lotes/:id
```

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

### 4. Actualizar un lote
```http
PUT /api/lotes/:id
Content-Type: application/json

{
  "nombre_lote": "Lote Actualizado",
  "superficie": 2.8,
  "fecha_siembra": "2025-10-01",
  "fecha_cosecha_est": "2026-03-15",
  "rendimiento_estimado": 550,
  "precio_venta_est": 13.50,
  "estado": "ACTIVO"
}
```

### 5. Eliminar un lote
```http
DELETE /api/lotes/:id
```

### 6. Obtener lotes por productor
```http
GET /api/lotes/productor/:idProductor
```

---

## 💰 MÓDULO: GASTOS (COSTOS)

### 1. Obtener todos los gastos
```http
GET /api/gastos
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id_gasto": 1,
      "id_lote": 1,
      "nombre_lote": "Lote Quinua Norte 2025",
      "categoria": "Semillas",
      "descripcion": "Semilla Certificada Quinua",
      "cantidad": "2.00",
      "costo_unitario": "150.00",
      "monto_total": "300.00",
      "tipo_costo": "VARIABLE",
      "modalidad_pago": "NA",
      "fecha_gasto": "2026-01-21"
    }
  ],
  "count": 1
}
```

### 2. Obtener un gasto por ID
```http
GET /api/gastos/:id
```

### 3. Crear un nuevo gasto
```http
POST /api/gastos
Content-Type: application/json

{
  "id_lote": 1,
  "categoria": "Fertilizantes",
  "descripcion": "Urea y Fosfato",
  "cantidad": 3,
  "costo_unitario": 85.50,
  "tipo_costo": "VARIABLE",
  "modalidad_pago": "NA"
}
```

**Nota:** El `monto_total` se calcula automáticamente (cantidad × costo_unitario)

**Respuesta:**
```json
{
  "success": true,
  "message": "Gasto registrado exitosamente",
  "data": {
    "id_gasto": 3,
    "id_lote": 1,
    "categoria": "Fertilizantes",
    "descripcion": "Urea y Fosfato",
    "cantidad": "3.00",
    "costo_unitario": "85.50",
    "monto_total": "256.50",
    "tipo_costo": "VARIABLE",
    "modalidad_pago": "NA",
    "fecha_gasto": "2026-01-21"
  }
}
```

### 4. Actualizar un gasto
```http
PUT /api/gastos/:id
Content-Type: application/json

{
  "categoria": "Fertilizantes",
  "descripcion": "Urea y Fosfato - Actualizado",
  "cantidad": 4,
  "costo_unitario": 85.50,
  "tipo_costo": "VARIABLE",
  "modalidad_pago": "NA"
}
```

### 5. Eliminar un gasto
```http
DELETE /api/gastos/:id
```

### 6. Obtener gastos de un lote específico
```http
GET /api/gastos/lote/:idLote
```

### 7. Obtener resumen de costos del lote (Para KPIs)
```http
GET /api/gastos/lote/:idLote/resumen
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "total_gastos": 4,
    "costo_total": 1256.50,
    "costos_fijos": 500.00,
    "costos_variables": 756.50
  }
}
```

### 8. Obtener gastos agrupados por categoría
```http
GET /api/gastos/lote/:idLote/categoria
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "categoria": "Semillas",
      "cantidad_gastos": "2",
      "total_categoria": "300.00"
    },
    {
      "categoria": "Fertilizantes",
      "cantidad_gastos": "1",
      "total_categoria": "256.50"
    },
    {
      "categoria": "Alquiler de Terreno",
      "cantidad_gastos": "1",
      "total_categoria": "500.00"
    }
  ]
}
```

---

## 🌾 MÓDULO: PRODUCTOS (CATÁLOGO)

### 1. Obtener todos los productos
```http
GET /api/productos
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id_producto": 1,
      "nombre": "Quinua Real",
      "categoria": "Grano",
      "unidad_medida_base": "Kg",
      "imagen_url": null
    },
    {
      "id_producto": 2,
      "nombre": "Papa Imilla",
      "categoria": "Tuberculo",
      "unidad_medida_base": "Kg",
      "imagen_url": null
    }
  ],
  "count": 2
}
```

### 2. Obtener un producto por ID
```http
GET /api/productos/:id
```

### 3. Crear un nuevo producto
```http
POST /api/productos
Content-Type: application/json

{
  "nombre": "Cebada",
  "categoria": "Grano",
  "unidad_medida_base": "Kg",
  "imagen_url": "/images/cebada.jpg"
}
```

**Categorías válidas:** `Grano`, `Tuberculo`, `Hortaliza`, `Forraje`

**Respuesta:**
```json
{
  "success": true,
  "message": "Producto creado exitosamente",
  "data": {
    "id_producto": 3,
    "nombre": "Cebada",
    "categoria": "Grano",
    "unidad_medida_base": "Kg",
    "imagen_url": "/images/cebada.jpg"
  }
}
```

### 4. Actualizar un producto
```http
PUT /api/productos/:id
Content-Type: application/json

{
  "nombre": "Quinua Real Premium",
  "categoria": "Grano",
  "unidad_medida_base": "Kg",
  "imagen_url": "/images/quinua-premium.jpg"
}
```

### 5. Eliminar un producto
```http
DELETE /api/productos/:id
```

**Nota:** No se puede eliminar un producto que esté siendo usado en lotes activos.

### 6. Obtener productos por categoría
```http
GET /api/productos/categoria/:categoria
```

Ejemplo: `GET /api/productos/categoria/Grano`

### 7. Obtener productos con estadísticas de uso
```http
GET /api/productos/stats
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id_producto": 1,
      "nombre": "Quinua Real",
      "categoria": "Grano",
      "unidad_medida_base": "Kg",
      "total_lotes": "5",
      "superficie_total": "12.50"
    },
    {
      "id_producto": 2,
      "nombre": "Papa Imilla",
      "categoria": "Tuberculo",
      "unidad_medida_base": "Kg",
      "total_lotes": "2",
      "superficie_total": "3.80"
    }
  ],
  "count": 2
}
```

---

## 📊 CASOS DE USO PARA EL DASHBOARD

### 1. Obtener datos completos de un lote con sus gastos
```javascript
// Paso 1: Obtener el lote
GET /api/lotes/1

// Paso 2: Obtener gastos del lote
GET /api/gastos/lote/1

// Paso 3: Obtener resumen de costos
GET /api/gastos/lote/1/resumen
```

### 2. Calcular rentabilidad de un lote
```javascript
// Obtener el lote
GET /api/lotes/1
// Respuesta: rendimiento_estimado = 500, precio_venta_est = 12.50

// Obtener resumen de costos
GET /api/gastos/lote/1/resumen
// Respuesta: costo_total = 1256.50

// Cálculo en el frontend:
ingreso_estimado = 500 * 12.50 = 6250.00
costo_total = 1256.50
ganancia_estimada = 6250.00 - 1256.50 = 4993.50
```

### 3. Dashboard de productor
```javascript
// Obtener todos los lotes del productor
GET /api/lotes/productor/1

// Para cada lote, obtener resumen de costos
GET /api/gastos/lote/1/resumen
GET /api/gastos/lote/2/resumen
// etc.
```

---

## ❌ CÓDIGOS DE ERROR

| Código | Descripción |
|--------|-------------|
| 200 | OK - Petición exitosa |
| 201 | Created - Recurso creado exitosamente |
| 400 | Bad Request - Datos inválidos o incompletos |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error del servidor |

---

## 🧪 COLECCIÓN DE PRUEBAS (Postman/Thunder Client)

Importa el archivo `thunder-collection_agroconecta.json` en Thunder Client para tener todas las peticiones listas.

---

## 📝 NOTAS IMPORTANTES

1. **Cálculo automático de monto_total:** Al crear o actualizar gastos, el `monto_total` se calcula automáticamente como `cantidad × costo_unitario`.

2. **Estados de lote:** Los valores válidos son: `ACTIVO`, `COSECHADO`, `CANCELADO`.

3. **Tipos de costo:** Los valores válidos son: `FIJO`, `VARIABLE`.

4. **Modalidades de pago:** Los valores válidos son: `CICLO`, `ANUAL`, `NA` (No Aplica).

5. **Categorías de producto:** Los valores válidos son: `Grano`, `Tuberculo`, `Hortaliza`, `Forraje`.

6. **Integridad referencial:** No puedes eliminar un producto que esté siendo usado en lotes, ni eliminar un lote que tenga gastos asociados (a menos que uses `ON DELETE CASCADE`).
