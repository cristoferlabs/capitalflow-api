# Backend Micro-Inversiones

API REST en Node.js + Express + TypeScript con Clean Architecture, Strategy Pattern y **Prisma ORM** + **PostgreSQL**.

## Arranque (Docker — recomendado)

Desde la raíz del monorepo:

```bash
docker compose up -d --build
```

- API: `http://localhost:3000`
- PostgreSQL: `localhost:5432` (`db_inversiones`)

## Arranque local (API fuera de Docker)

1. Levantar solo la base:

```bash
docker compose up -d postgres_db
```

2. En `BACKEND-INVERSIONES`:

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

Servidor: `http://localhost:3000`

### Usuarios seed

| id | nombre | email |
|----|--------|-------|
| `1` | Cristofer Developer | cristofer@inversiones.io |
| `2` | Usuario Demo | demo@inversiones.io |

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/v1/inversiones/simular` | Simula ganancia sin persistir |
| `POST` | `/api/v1/inversiones` | Registra inversión (`$transaction` ACID) |
| `GET` | `/api/v1/inversiones/usuario/:id` | Historial (relación Prisma = JOIN) |
| `GET` | `/api/v1/inversiones` | Lista inversiones |
| `GET` | `/api/v1/inversiones/:id` | Obtiene por id |
| `GET` | `/health` | Health check |

## Scripts DB

| Script | Uso |
|--------|-----|
| `npm run db:generate` | Genera Prisma Client |
| `npm run db:push` | Sincroniza schema → PostgreSQL |
| `npm run db:seed` | Carga usuarios de prueba |
| `npm run db:studio` | UI de Prisma Studio |

## Persistencia

- ORM: **Prisma 6** + **PostgreSQL 15**
- Bootstrap Docker: `init.sql` (tablas, `CHECK`, FK `ON DELETE CASCADE`, seed)
- Registro: `prisma.$transaction` (ACID)
- Historial: `include: { usuario }` (INNER JOIN vía FK requerida)
- Montos/tasas: `NUMERIC` / `Decimal` (precisión financiera)

## Testing (Jest)

```bash
npm test
npm run test:coverage
```

Suite unitaria: `src/application/services/simulador.service.spec.ts`  
Valida tasas Strategy (8% / 10%) y monto mínimo S/ 100.

## Arquitectura

```
Controllers → InversionService → PrismaInversionRepository → Prisma Client → PostgreSQL
                 ↘ SimuladorService → InterestRateStrategy (Factory)
```
