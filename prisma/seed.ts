import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const count = await prisma.usuario.count();
  if (count > 0) {
    console.log('Seed omitido: ya hay usuarios.');
    return;
  }

  await prisma.usuario.createMany({
    data: [
      {
        id: '1',
        nombre: 'Cristofer Developer',
        email: 'cristofer@inversiones.io',
      },
      {
        id: '2',
        nombre: 'Usuario Demo',
        email: 'demo@inversiones.io',
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
