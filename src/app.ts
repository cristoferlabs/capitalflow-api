import express, { Express } from 'express';
import { InterestRateStrategyFactory } from './domain/strategies/InterestRateStrategyFactory';
import { prisma } from './infrastructure/database/prisma';
import { PrismaInversionRepository } from './infrastructure/repositories/PrismaInversionRepository';
import { InversionService } from './application/services/InversionService';
import { InversionController } from './presentation/controllers/InversionController';
import { createInversionRouter } from './presentation/routes/inversionRoutes';
import { errorHandler } from './presentation/middlewares/errorHandler';

export function createApp(): Express {
  const app = express();

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  });

  app.use(express.json());

  const repository = new PrismaInversionRepository(prisma);
  const rateFactory = new InterestRateStrategyFactory();
  const service = new InversionService(repository, rateFactory);
  const controller = new InversionController(service);

  app.get('/health', (_req, res) => {
    res.status(200).json({ success: true, status: 'ok' });
  });

  app.use('/api/v1/inversiones', createInversionRouter(controller));

  app.use(errorHandler);

  return app;
}
