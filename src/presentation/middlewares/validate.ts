import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from '../../shared/errors/AppError';

type RequestTarget = 'body' | 'params' | 'query';

export function validate(schema: ZodSchema, target: RequestTarget = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        path: issue.path.join('.') || target,
        message: issue.message,
      }));

      next(
        new AppError(
          details.map((d) => d.message).join('; ') || 'Datos inválidos',
          400,
          'VALIDACION_FALLIDA'
        )
      );
      return;
    }

    req[target] = result.data;
    next();
  };
}
