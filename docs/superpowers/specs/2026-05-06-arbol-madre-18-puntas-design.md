# Arbol Madre: 18 puntas con fotos

## Objetivo
Asegurar que el arbol muestre 18 puntas fijas con 1 foto por punta. Si el usuario sube 1 a 8 fotos, se expanden a 18 repitiendo y mezclando de forma aleatoria pero estable. En preview sin fotos, se mantienen los placeholders actuales.

## Alcance
- Solo aplica al template arbol-madre.
- Sin cambios en backend o Supabase.
- Mantener la validacion actual: para generar link se requiere al menos 1 foto subida.

## Reglas
- Si hay fotos del usuario (1 a 8):
  - Expandir a 18 repitiendo hasta llegar a 18.
  - Distribucion aleatoria pero estable (mismo input -> misma distribucion).
- Si no hay fotos: mantener placeholders (cantidad actual de 8) y sin link en produccion.
- Cada punta usa una sola foto; no offsets alrededor de la punta.

## Cambios tecnicos
1. ArbolScene (pre-procesamiento de fotos)
   - Construir displayFotos:
     - Si data.fotos tiene longitud > 0, expandir a 18 repitiendo y mantener orden estable.
     - Si no hay fotos, mantener arreglo vacio para que useArbol use placeholders.
   - Pasar displayFotos a useArbol tal como hoy, para que overlay y hojas usen el mismo set.

2. useArbol (posiciones de puntas)
   - generateTree debe devolver tipPositions (una por punta) usando la posicion exacta del end de cada rama en depth=1.
   - Reemplazar leafPositions actuales por tipPositions (18).
   - Crear hojas usando esas 18 posiciones, sin offsets.
   - Mantener shuffle estable de posiciones para distribuir fotos por la copa.

## Casos limite
- 0 fotos: se muestran placeholders como hoy.
- 1 foto: se repite 18 veces.
- 6 a 8 fotos: se repiten hasta llegar a 18.

## Pruebas manuales
- Subir 1 foto: ver 18 puntas con la misma foto en posiciones distribuidas.
- Subir 4 fotos: ver repeticiones distribuidas sin agrupacion evidente.
- Subir 8 fotos: ver las 8 repetidas hasta completar 18.
- Sin fotos (preview): placeholders visibles como ahora.

## Fuera de alcance
- Cambios visuales adicionales (tamanos, animaciones, controles).
- Cambios en el modal de validacion (ya bloquea link sin fotos).