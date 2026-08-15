#!/bin/sh
set -e

# Asegura que el schema Prisma coincida con PostgreSQL.
# En el primer arranque, init.sql ya crea tablas + CHECKs + seed.
npx prisma db push --skip-generate

exec node dist/server.js
