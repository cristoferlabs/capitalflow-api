import 'dotenv/config';
import { createApp } from './app';

const PORT = Number(process.env.PORT) || 3000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`API micro-inversiones escuchando en http://localhost:${PORT}`);
  console.log(`  POST /api/v1/inversiones/simular`);
  console.log(`  POST /api/v1/inversiones`);
  console.log(`  GET  /api/v1/inversiones/usuario/:id`);
  console.log(`  GET  /api/v1/inversiones`);
  console.log(`  GET  /api/v1/inversiones/:id`);
});
