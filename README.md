# CapitalFlow API

API REST para **simular y registrar micro-inversiones** a plazo fijo. La tasa se elige según el plazo mediante **Strategy Pattern**, y los registros se guardan en **PostgreSQL** con transacciones ACID vía **Prisma**.

Parte de **CapitalFlow**: [capitalflow-web](https://github.com/cristoferlabs/capitalflow-web) (frontend Angular).

![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)
![Jest](https://img.shields.io/badge/Tests-Jest-C21325?logo=jest&logoColor=white)

## Arquitectura

Clean Architecture en cuatro capas; el dominio no depende de Express ni de Prisma.

```
presentation/    rutas, controladores, validación (Zod), manejo de errores
      │
application/     InversionService · SimuladorService · DTOs
      │
domain/          entidades · IInversionRepository · estrategias de tasa
      ▲
infrastructure/  PrismaInversionRepository · cliente Prisma
```

## Reglas de negocio

| Plazo | Estrategia | Tasa anual |
|---|---|---|
| 1–6 meses | `ShortTermRateStrategy` | 8.0 % |
| 7–12 meses | `MediumTermRateStrategy` | 10.0 % |
| 13–24 meses | `LongTermRateStrategy` | 12.5 % |

- Monto mínimo: **S/ 100**. Plazo fuera de 1–24 meses → `400 PLAZO_NO_SOPORTADO`.
- `InterestRateStrategyFactory.register()` permite añadir tasas promocionales sin tocar el servicio.
- Montos y tasas usan `Decimal` / `NUMERIC` para precisión financiera.

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/v1/inversiones/simular` | Calcula ganancia y monto final sin persistir |
| `POST` | `/api/v1/inversiones` | Registra una inversión (transacción ACID) |
| `GET` | `/api/v1/inversiones/usuario/:id` | Historial de un usuario |
| `GET` | `/api/v1/inversiones` | Lista inversiones |
| `GET` | `/api/v1/inversiones/:id` | Detalle de una inversión |
| `GET` | `/health` | Health check |

Ejemplo:

```bash
curl -X POST http://localhost:3000/api/v1/inversiones/simular \
  -H "Content-Type: application/json" \
  -d '{"monto": 2000, "plazoMeses": 12}'
```

## Ejecución local

Requisitos: Node.js 22 y PostgreSQL 15 (local o en Docker).

```bash
cp .env.example .env           # ajusta DATABASE_URL
npm install
npm run db:push                # sincroniza el schema
npm run db:seed                # usuarios de prueba
npm run dev                    # http://localhost:3000
```

Con Docker, la imagen multi-stage compila TypeScript y al arrancar ejecuta `prisma db push` antes de levantar el servidor:

```bash
docker build -t capitalflow-api .
docker run -p 3000:3000 -e DATABASE_URL=... capitalflow-api
```

## Scripts

| Script | Uso |
|---|---|
| `npm run dev` | Servidor con recarga (tsx) |
| `npm run build` / `npm start` | Compilación y ejecución de producción |
| `npm test` / `npm run test:coverage` | Pruebas unitarias con Jest |
| `npm run db:studio` | Prisma Studio |

## Pruebas

`src/application/services/simulador.service.spec.ts` cubre la tasa por plazo (8 % a 6 meses, 10 % a 12 meses) y el rechazo de montos menores a S/ 100.
