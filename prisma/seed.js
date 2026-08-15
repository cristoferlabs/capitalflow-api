const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.usuario.count();
  if (count > 0) {
    console.log('Seed omitido: ya hay usuarios.');
    return;
  }

  await prisma.usuario.createMany({
    data: [
      { id: '1', nombre: 'Ana Pérez', email: 'ana@example.com' },
      { id: '2', nombre: 'Luis Gómez', email: 'luis@example.com' },
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nombre: 'María Ruiz',
        email: 'maria@example.com',
      },
    ],
  });

  console.log('Usuarios seed creados.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
